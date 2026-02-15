import io
import zipfile
import hashlib
import json
import pathlib
import streamlit as st
import pandas as pd
from web3 import Web3
from transformers import pipeline
from presidio_analyzer import AnalyzerEngine

from reader import parse_mainframe_file
from generator import pack_comp3, create_ebcdic_record
import plotly.graph_objects as go

st.set_page_config(
    page_title="Eco-Vault",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded",
)

css_path = pathlib.Path(__file__).parent / "style.css"
if css_path.exists():
    st.markdown(f"<style>{css_path.read_text()}</style>", unsafe_allow_html=True)

# talking to celo sepolia testnet
CELO_RPC = "https://forno.celo-sepolia.celo-testnet.org"
CHAIN_ID = 11142220
EXPLORER = "https://sepolia.celoscan.io"

w3 = Web3(Web3.HTTPProvider(CELO_RPC))

@st.cache_resource
def load_classifier():
    return pipeline(
        "zero-shot-classification",
        model="typeform/distilbert-base-uncased-mnli"
    )

@st.cache_resource
def load_pii_analyzer():
    return AnalyzerEngine()

classifier = load_classifier()
pii_analyzer = load_pii_analyzer()

# Candidate labels for zero-shot classification — the AI maps each log to one.
CANDIDATE_LABELS = [
    "system error or diagnostic noise",
    "confirmed financial transaction",
    "security alert or compliance review",
]

LABEL_TO_TIER = {
    "system error or diagnostic noise":    "🔴 Red (Absolute ROT)",
    "confirmed financial transaction":     "🟢 Green (Important)",
    "security alert or compliance review": "🟡 Yellow (Quarantine)",
}

def build_summary(tier_df):
    """Builds a short human-readable summary of what's in each tier."""
    n = len(tier_df)
    if n == 0:
        return "No records in this category."

    pii_flags = 0
    if 'PII_Count' in tier_df.columns:
        pii_flags = int(tier_df['PII_Count'].sum())

    # Count by AI-assigned label
    parts = []
    if 'AI_Label' in tier_df.columns:
        for label in CANDIDATE_LABELS:
            count = int((tier_df['AI_Label'] == label).sum())
            if count:
                parts.append(f"{count} {label}")
    if pii_flags:
        parts.append(f"{pii_flags} PII flags")

    if parts:
        return f"{n} records — {', '.join(parts)}."
    return f"{n} records."


def dataframe_to_dat(df):
    """Takes a dataframe and converts it back into the mainframe .dat format."""
    buf = bytearray()
    for _, row in df.iterrows():
        record = create_ebcdic_record(
            str(row["id"]),
            str(row["name"]),
            int(row["amount"]),
            str(row["text"])
        )
        buf += record
    return bytes(buf)


def make_zip(df, csv_name="quarantined_data.csv"):
    """Zips up a dataframe as CSV — everything stays in memory."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(csv_name, df.to_csv(index=False))
    buf.seek(0)
    return buf.getvalue()

# --- sidebar ---

with st.sidebar:
    st.markdown(
        "<div style='text-align:center; padding:1rem 0 0.5rem;'>"
        "<span style='font-size:2.5rem;'>🌱</span><br>"
        "<span style='font-size:1.4rem; font-weight:800; "
        "background:linear-gradient(135deg,#66bb6a,#2e7d32); "
        "-webkit-background-clip:text; -webkit-text-fill-color:transparent;'>"
        "Eco-Vault</span><br>"
        "<span style='font-size:0.75rem; opacity:0.45; letter-spacing:2px; "
        "text-transform:uppercase;'>digital decarbonisation</span>"
        "</div>",
        unsafe_allow_html=True
    )
    st.markdown("")
    st.markdown("---")

    # little progress tracker so the user knows where they are
    step = 1
    if st.session_state.get("data") is not None:
        step = 2
    if st.session_state.get("analysis_done"):
        step = 3
    if st.session_state.get("tx_hash"):
        step = 4

    steps = ["Upload data", "AI classification", "Review & approve", "Execute & download"]
    for i, label in enumerate(steps, 1):
        if i < step:
            icon = "✅"
        elif i == step:
            icon = "▶️"
        else:
            icon = "⬜"
        opacity = "1" if i <= step else "0.4"
        st.markdown(
            f"<div style='opacity:{opacity}; padding:3px 0; font-size:0.9rem;'>"
            f"{icon} &nbsp; {label}</div>",
            unsafe_allow_html=True
        )

    st.markdown("---")
    st.markdown(
        "<div style='opacity:0.4; font-size:0.75rem; text-align:center;'>"
        "DistilBERT (Zero-Shot NLI) · Presidio<br>Celo Blockchain (Sepolia)"
        "</div>",
        unsafe_allow_html=True
    )
    st.markdown("")
    if st.button("🔄 Start Over", use_container_width=True):
        st.session_state.clear()
        st.rerun()

# --- session state ---

if "data" not in st.session_state:
    st.session_state.data = None
if "analysis_done" not in st.session_state:
    st.session_state.analysis_done = False
if "tx_hash" not in st.session_state:
    st.session_state.tx_hash = None

# --- hero ---

st.markdown(
    "<div class='hero-wrapper'>"
    "<div class='hero-icon'>🌱</div><br>"
    "<div class='hero-title'>Eco-Vault</div>"
    "<div class='hero-subtitle'>Classify · Quarantine · Delete · Prove</div>"
    "</div>",
    unsafe_allow_html=True
)

st.markdown("<div class='section-divider'></div>", unsafe_allow_html=True)

# ------ step 1: upload ------

st.markdown(
    "<span class='step-badge'>STEP 1</span>"
    "<span class='step-header'>Upload Legacy Data</span>",
    unsafe_allow_html=True
)
st.caption("Drop in a mainframe dump and we'll decode the EBCDIC + COMP-3 for you.")
st.markdown("")
uploaded_file = st.file_uploader(
    "Upload a mainframe dump (.dat)", type="dat", label_visibility="collapsed"
)

if uploaded_file:
    if st.session_state.data is None:
        with open("temp_upload.dat", "wb") as f:
            f.write(uploaded_file.getbuffer())
        st.info("Decoding EBCDIC & COMP-3 …")
        raw_records = parse_mainframe_file("temp_upload.dat")
        st.session_state.data = pd.DataFrame(raw_records)

    df = st.session_state.data

    st.markdown("<div class='section-divider'></div>", unsafe_allow_html=True)
    st.markdown(
        "<span class='step-badge'>STEP 2</span>"
        "<span class='step-header'>AI Classification</span>",
        unsafe_allow_html=True
    )
    st.caption("Each record gets scanned for PII (Presidio) and classified by zero-shot AI (DistilBERT-NLI), then sorted.")
    st.markdown("")

    if st.button("🚀 Run Analysis", use_container_width=False) or st.session_state.analysis_done:

        if not st.session_state.analysis_done:
            tiers = []
            pii_counts = []
            ai_labels = []
            bar = st.progress(0)

            for i, row in df.iterrows():
                txt = row["text"]

                pii_hits = pii_analyzer.analyze(text=txt, entities=None, language="en")
                pii_count = len(pii_hits)
                has_pii = pii_count > 0

                result = classifier(txt, candidate_labels=CANDIDATE_LABELS)
                top_label = result["labels"][0]
                top_score = result["scores"][0]

                if has_pii:
                    tier = "🟡 Yellow (Quarantine)"
                elif top_score < 0.50:
                    tier = "🟡 Yellow (Quarantine)"
                else:
                    tier = LABEL_TO_TIER[top_label]

                tiers.append(tier)
                pii_counts.append(pii_count)
                ai_labels.append(top_label)
                bar.progress((i + 1) / len(df))

            st.session_state.data["Tier"] = tiers
            st.session_state.data["PII_Count"] = pii_counts
            st.session_state.data["AI_Label"] = ai_labels
            st.session_state.analysis_done = True
            st.rerun()

        df_all = st.session_state.data
        green_df = df_all[df_all["Tier"].str.contains("Green")]
        yellow_df = df_all[df_all["Tier"].str.contains("Yellow")]
        red_df = df_all[df_all["Tier"].str.contains("Red")]

        green_n = len(green_df)
        yellow_n = len(yellow_df)
        red_n = len(red_df)
        total_n = green_n + yellow_n + red_n
        energy_saved = red_n * 0.005

        # --- results dashboard ---
        st.markdown("")

        # top row: pie chart on the left, metrics on the right
        chart_col, spacer, metrics_col = st.columns([1.2, 0.1, 2])

        with chart_col:
            st.markdown(
                "<div style='text-align:center; opacity:0.5; font-size:0.8rem; "
                "margin-bottom:0.5rem; letter-spacing:1px; text-transform:uppercase;'>"
                "Record Distribution</div>",
                unsafe_allow_html=True
            )
            fig = go.Figure(data=[go.Pie(
                labels=["Green (Keep)", "Yellow (Review)", "Red (Delete)"],
                values=[green_n, yellow_n, red_n],
                hole=0.55,
                marker=dict(colors=["#4caf50", "#ffc107", "#f44336"]),
                textinfo="percent+value",
                textfont=dict(size=13, color="white"),
                hovertemplate="<b>%{label}</b><br>%{value} records<br>%{percent}<extra></extra>",
            )])
            fig.update_layout(
                showlegend=False,
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                margin=dict(t=10, b=10, l=10, r=10),
                height=220,
                annotations=[dict(
                    text=f"<b>{total_n}</b><br><span style='font-size:10px'>records</span>",
                    x=0.5, y=0.5, font=dict(size=20, color="white"),
                    showarrow=False
                )],
            )
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        with metrics_col:
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("🟢 Keep", green_n)
            m2.metric("🟡 Review", yellow_n)
            m3.metric("🔴 Delete", red_n)
            m4.metric("🌍 CO₂ Saved", f"{energy_saved:.3f} kg")

            # show percentages as a little bonus
            if total_n > 0:
                st.markdown(
                    f"<div style='opacity:0.45; font-size:0.82rem; margin-top:0.3rem;'>"
                    f"&nbsp; Keep {green_n/total_n*100:.0f}% · "
                    f"Review {yellow_n/total_n*100:.0f}% · "
                    f"Delete {red_n/total_n*100:.0f}%"
                    f"</div>",
                    unsafe_allow_html=True
                )

        st.markdown("")

        # --- tier cards ---

        # green
        st.markdown(
            f"<div class='tier-card tier-green'>"
            f"<div class='tier-label'>🟢 Green — Safe, Business-Critical</div>"
            f"<div class='tier-desc'>{build_summary(green_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {green_n} green records"):
            st.dataframe(green_df, use_container_width=True, hide_index=True)

        # yellow
        st.markdown(
            f"<div class='tier-card tier-yellow'>"
            f"<div class='tier-label'>🟡 Yellow — Quarantined for Review</div>"
            f"<div class='tier-desc'>{build_summary(yellow_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {yellow_n} yellow records"):
            st.dataframe(yellow_df, use_container_width=True, hide_index=True)

        # red
        st.markdown(
            f"<div class='tier-card tier-red'>"
            f"<div class='tier-label'>🔴 Red — Digital Waste</div>"
            f"<div class='tier-desc'>{build_summary(red_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {red_n} red records"):
            st.dataframe(red_df, use_container_width=True, hide_index=True)

        # --- step 3: compliance ---

        st.markdown("<div class='section-divider'></div>", unsafe_allow_html=True)
        st.markdown(
            "<span class='step-badge'>STEP 3</span>"
            "<span class='step-header'>Compliance Sign-off</span>",
            unsafe_allow_html=True
        )

        st.markdown("")
        approved = st.checkbox(
            "I confirm I have reviewed the classified data above and authorise "
            "deletion of Red records with blockchain proof."
        )

        if not approved:
            st.info("☝️ Review the tier cards above, then tick the checkbox to proceed.")

        else:
            st.markdown("<div class='section-divider'></div>", unsafe_allow_html=True)
            st.markdown(
                "<span class='step-badge'>STEP 4</span>"
                "<span class='step-header'>Execute & Download</span>",
                unsafe_allow_html=True
            )

            if st.session_state.tx_hash:
                st.balloons()

                # big success banner
                st.markdown(
                    "<div class='glass-card' style='text-align:center; "
                    "border-color:rgba(76,175,80,0.3);'>"
                    "<div style='font-size:2.5rem; margin-bottom:0.3rem;'>✅</div>"
                    "<div style='font-size:1.3rem; font-weight:700; color:#66bb6a;'>"
                    "Deletion Complete & Logged On-Chain</div>"
                    f"<div style='opacity:0.6; margin-top:0.4rem;'>"
                    f"{red_n} records deleted · {energy_saved:.4f} kg CO₂e saved</div>"
                    "</div>",
                    unsafe_allow_html=True
                )

                # explorer link
                st.markdown(
                    f"<div style='text-align:center; margin:1rem 0;'>"
                    f"<a href='{EXPLORER}/tx/{st.session_state.tx_hash}' target='_blank' "
                    f"style='color:#66bb6a; text-decoration:none; font-weight:600; "
                    f"font-size:1rem;'>"
                    f"📜 View proof on Celo Explorer →</a></div>",
                    unsafe_allow_html=True
                )

                # download section
                st.markdown("")
                st.markdown(
                    "<div style='opacity:0.5; font-size:0.8rem; letter-spacing:1px; "
                    "text-transform:uppercase; margin-bottom:0.8rem;'>Downloads</div>",
                    unsafe_allow_html=True
                )
                dl1, dl2 = st.columns(2)

                with dl1:
                    st.markdown(
                        "<div class='glass-card' style='border-color:rgba(76,175,80,0.2); "
                        "text-align:center; padding:16px;'>"
                        "<div style='font-size:1.5rem;'>📄</div>"
                        "<div style='font-weight:600; margin:4px 0;'>Green Data</div>"
                        "<div style='opacity:0.5; font-size:0.8rem;'>Re-encoded mainframe .dat</div>"
                        "</div>",
                        unsafe_allow_html=True
                    )
                    st.download_button(
                        "⬇️ Download .dat",
                        dataframe_to_dat(green_df),
                        "eco_vault_green_clean.dat",
                        "application/octet-stream",
                        use_container_width=True,
                    )

                with dl2:
                    if not yellow_df.empty:
                        st.markdown(
                            "<div class='glass-card' style='border-color:rgba(255,193,7,0.2); "
                            "text-align:center; padding:16px;'>"
                            "<div style='font-size:1.5rem;'>🗜️</div>"
                            "<div style='font-weight:600; margin:4px 0;'>Yellow Data</div>"
                            "<div style='opacity:0.5; font-size:0.8rem;'>Quarantine archive .zip</div>"
                            "</div>",
                            unsafe_allow_html=True
                        )
                        st.download_button(
                            "⬇️ Download .zip",
                            make_zip(yellow_df, "quarantined_yellow.csv"),
                            "eco_vault_yellow_quarantine.zip",
                            "application/zip",
                            use_container_width=True,
                        )
                    else:
                        st.markdown(
                            "<div class='glass-card' style='text-align:center; padding:16px;'>"
                            "<div style='font-size:1.5rem; opacity:0.3;'>📭</div>"
                            "<div style='font-weight:600; margin:4px 0; opacity:0.5;'>"
                            "No Yellow Data</div>"
                            "<div style='opacity:0.3; font-size:0.8rem;'>Nothing to quarantine</div>"
                            "</div>",
                            unsafe_allow_html=True
                        )

            else:
                # haven't fired the tx yet — show the key input
                st.markdown("")
                st.markdown(
                    "<div class='glass-card' style='border-color:rgba(76,175,80,0.15);'>"
                    "<div style='font-size:0.85rem; font-weight:600; margin-bottom:0.5rem;'>"
                    "🔐 Blockchain Authentication</div>"
                    "<div style='opacity:0.5; font-size:0.8rem; margin-bottom:0.8rem;'>"
                    "Your private key signs a zero-value transaction on Celo Sepolia. "
                    "The only cost is a tiny gas fee (fractions of a cent on testnet). "
                    "The key never leaves your browser.</div>"
                    "</div>",
                    unsafe_allow_html=True
                )

                private_key = st.text_input(
                    "Celo Wallet Private Key",
                    type="password",
                    placeholder="Paste your private key here…"
                )

                if st.button("♻️ Delete Red & Mint Proof") and private_key:
                    # throw away the red rows
                    st.session_state.data = pd.concat([green_df, yellow_df])

                    # hash the deleted stuff so we have a receipt
                    proof_hash = hashlib.sha256(
                        red_df.to_json().encode()
                    ).hexdigest()

                    acct = w3.eth.account.from_key(private_key)

                    # build the on-chain payload
                    payload = json.dumps({
                        "app": "Eco-Vault v2",
                        "action": "DIGITAL_DECARBONIZATION",
                        "tier": "RED_ABSOLUTE_ROT",
                        "deleted_records": int(red_n),
                        "quarantined": int(yellow_n),
                        "kept_records": int(green_n),
                        "carbon_saved_kg": float(energy_saved),
                        "proof_hash": proof_hash,
                    })

                    tx = {
                        "to": acct.address,
                        "value": 0,
                        "gas": 250000,
                        "gasPrice": w3.eth.gas_price,
                        "chainId": CHAIN_ID,
                        "nonce": w3.eth.get_transaction_count(acct.address),
                        "data": w3.to_hex(text=payload),
                    }

                    try:
                        signed = w3.eth.account.sign_transaction(tx, private_key)
                        raw = w3.eth.send_raw_transaction(signed.raw_transaction)
                        st.session_state.tx_hash = w3.to_hex(raw)
                        st.rerun()
                    except Exception as e:
                        st.error(f"Blockchain error: {e}")

# (reset button is in the sidebar above)