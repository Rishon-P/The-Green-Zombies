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

# Binary zero-shot labels — the AI decides Green vs Red.
# Yellow is NOT an AI label; it only appears when Presidio finds PII in a Red record.
CLASS_LABELS = [
    "important financial record",   # → Green
    "system noise or junk log",     # → Red
]

def build_summary(tier_df):
    """Builds a short human-readable summary of what's in each tier."""
    n = len(tier_df)
    if n == 0:
        return "No records in this category."

    parts = []
    pii_flags = 0
    if 'PII_Count' in tier_df.columns:
        pii_flags = int(tier_df['PII_Count'].sum())
    if pii_flags:
        parts.append(f"{pii_flags} PII detections")

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


def display_columns(df):
    """Return a display-ready dataframe with clean column names."""
    cols = [c for c in ["id", "name", "amount", "text", "Tier"] if c in df.columns]
    out = df[cols].copy()
    out = out.rename(columns={"name": "Source"})
    return out


# --- sidebar ---

with st.sidebar:
    st.markdown(
        "<div style='text-align:center; padding:1.2rem 0 0.5rem;'>"
        "<span style='font-size:2.8rem; filter:drop-shadow(0 0 12px rgba(76,175,80,0.3));'>🌱</span><br>"
        "<span style='font-size:1.5rem; font-weight:900; "
        "background:linear-gradient(135deg,#81c784,#66bb6a,#2e7d32); "
        "-webkit-background-clip:text; -webkit-text-fill-color:transparent;'>"
        "Eco-Vault</span><br>"
        "<span style='font-size:0.68rem; opacity:0.35; letter-spacing:3px; "
        "text-transform:uppercase; font-weight:500;'>digital decarbonisation</span>"
        "</div>",
        unsafe_allow_html=True
    )
    st.markdown("")
    st.markdown("---")

    # progress tracker
    step = 1
    if st.session_state.get("data") is not None:
        step = 2
    if st.session_state.get("analysis_done"):
        step = 3
    if st.session_state.get("tx_hash"):
        step = 4

    steps = ["Upload data", "AI classification", "Review & approve", "Execute & download"]
    icons = ["📁", "🧠", "✅", "♻️"]
    for i, (label, ic) in enumerate(zip(steps, icons), 1):
        if i < step:
            mark = "✅"
            cls = "sidebar-step"
        elif i == step:
            mark = ic
            cls = "sidebar-step sidebar-step-active"
        else:
            mark = "⬜"
            cls = "sidebar-step"
        opacity = "1" if i <= step else "0.35"
        st.markdown(
            f"<div class='{cls}' style='opacity:{opacity};'>"
            f"{mark} &nbsp; {label}</div>",
            unsafe_allow_html=True
        )

    st.markdown("---")
    st.markdown(
        "<div style='text-align:center; padding:0.5rem 0;'>"
        "<span class='tech-chip'>distilgpt2</span>"
        "<span class='tech-chip'>DistilBERT-NLI</span><br>"
        "<span class='tech-chip'>Presidio</span>"
        "<span class='tech-chip'>Celo L2</span>"
        "<span class='tech-chip'>EBCDIC</span>"
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
if "uploaded_file_id" not in st.session_state:
    st.session_state.uploaded_file_id = None

# --- hero ---

st.markdown(
    "<div class='hero-wrapper'>"
    "<div class='hero-icon'>🌱</div><br>"
    "<div class='hero-title'>Eco-Vault</div>"
    "<div class='hero-subtitle'>Classify · Quarantine · Delete · Prove</div>"
    "</div>",
    unsafe_allow_html=True
)

# AI Pipeline Visualiser
pipe_cols = st.columns([1, 0.2, 1, 0.2, 1, 0.2, 1])
with pipe_cols[0]:
    st.markdown(
        "<div class='pipeline-box'>"
        "<div class='pipeline-icon'>📼</div>"
        "<div class='pipeline-label'>EBCDIC Decoder</div>"
        "<div class='pipeline-desc'>cp037 + COMP-3</div>"
        "</div>", unsafe_allow_html=True
    )
with pipe_cols[1]:
    st.markdown("<div class='pipeline-arrow'>▸▸▸</div>", unsafe_allow_html=True)
with pipe_cols[2]:
    st.markdown(
        "<div class='pipeline-box'>"
        "<div class='pipeline-icon'>🧠</div>"
        "<div class='pipeline-label'>DistilBERT-NLI</div>"
        "<div class='pipeline-desc'>Zero-shot classify</div>"
        "</div>", unsafe_allow_html=True
    )
with pipe_cols[3]:
    st.markdown("<div class='pipeline-arrow'>▸▸▸</div>", unsafe_allow_html=True)
with pipe_cols[4]:
    st.markdown(
        "<div class='pipeline-box'>"
        "<div class='pipeline-icon'>🔍</div>"
        "<div class='pipeline-label'>Presidio PII</div>"
        "<div class='pipeline-desc'>Entity scanner</div>"
        "</div>", unsafe_allow_html=True
    )
with pipe_cols[5]:
    st.markdown("<div class='pipeline-arrow'>▸▸▸</div>", unsafe_allow_html=True)
with pipe_cols[6]:
    st.markdown(
        "<div class='pipeline-box'>"
        "<div class='pipeline-icon'>⛓️</div>"
        "<div class='pipeline-label'>Celo L2</div>"
        "<div class='pipeline-desc'>On-chain proof</div>"
        "</div>", unsafe_allow_html=True
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
    # detect new / changed file by hashing actual content
    file_bytes = uploaded_file.getbuffer()
    file_id = hashlib.md5(file_bytes).hexdigest()
    if file_id != st.session_state.uploaded_file_id:
        st.session_state.data = None
        st.session_state.analysis_done = False
        st.session_state.tx_hash = None
        st.session_state.uploaded_file_id = file_id

    if st.session_state.data is None:
        with open("temp_upload.dat", "wb") as f:
            f.write(file_bytes)
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
    st.caption("Zero-shot AI (DistilBERT-NLI) classifies each record → Green or Red. Then Presidio scans Red for PII → Yellow.")
    st.markdown(
        "<div style='display:flex; gap:8px; margin:0.5rem 0 1rem;'>"
        "<span class='chain-badge'>"
        "<span class='live-dot live-dot-green'></span>AI Pipeline Active</span>"
        "</div>",
        unsafe_allow_html=True
    )

    if st.button("🚀 Run Analysis", use_container_width=False) or st.session_state.analysis_done:

        if not st.session_state.analysis_done:
            tiers = []
            pii_counts = []
            bar = st.progress(0)

            for i, row in df.iterrows():
                txt = row["text"]

                # --- STEP A: Zero-shot AI decides Green vs Red ---
                result = classifier(txt, candidate_labels=CLASS_LABELS)
                top_label = result["labels"][0]
                top_score = result["scores"][0]

                if top_label == CLASS_LABELS[0] and top_score >= 0.50:
                    tier = "🟢 Green (Important)"
                    pii_count = 0
                else:
                    # --- STEP B: Presidio scans Red for PII ---
                    pii_hits = pii_analyzer.analyze(
                        text=txt, entities=None, language="en"
                    )
                    pii_count = len(pii_hits)

                    if pii_count > 0:
                        tier = "🟡 Yellow (Quarantine)"
                    else:
                        tier = "🔴 Red (Absolute ROT)"

                tiers.append(tier)
                pii_counts.append(pii_count)
                bar.progress((i + 1) / len(df))

            st.session_state.data["Tier"] = tiers
            st.session_state.data["PII_Count"] = pii_counts

            # Replace person names with system IDs for non-Green records
            for idx in range(len(st.session_state.data)):
                if "Green" not in tiers[idx]:
                    st.session_state.data.at[idx, "name"] = f"SYSTEM-{idx + 1:03d}"
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

        # top row: donut + bar chart + metrics
        chart_col, bar_col, metrics_col = st.columns([1, 1, 1.5])

        with chart_col:
            st.markdown(
                "<div style='text-align:center; opacity:0.45; font-size:0.75rem; "
                "margin-bottom:0.5rem; letter-spacing:1.5px; text-transform:uppercase; "
                "font-weight:600;'>Distribution</div>",
                unsafe_allow_html=True
            )
            fig = go.Figure(data=[go.Pie(
                labels=["Green", "Yellow", "Red"],
                values=[green_n, yellow_n, red_n],
                hole=0.62,
                marker=dict(
                    colors=["#4caf50", "#ffc107", "#f44336"],
                    line=dict(color="rgba(0,0,0,0.3)", width=2)
                ),
                textinfo="percent+value",
                textfont=dict(size=12, color="white", family="monospace"),
                hovertemplate="<b>%{label}</b><br>%{value} records<br>%{percent}<extra></extra>",
            )])
            fig.update_layout(
                showlegend=False,
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                margin=dict(t=8, b=8, l=8, r=8),
                height=220,
                annotations=[dict(
                    text=f"<b>{total_n}</b><br><span style='font-size:9px; color:rgba(255,255,255,0.4);'>TOTAL</span>",
                    x=0.5, y=0.5, font=dict(size=22, color="white"),
                    showarrow=False
                )],
            )
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        with bar_col:
            st.markdown(
                "<div style='text-align:center; opacity:0.45; font-size:0.75rem; "
                "margin-bottom:0.5rem; letter-spacing:1.5px; text-transform:uppercase; "
                "font-weight:600;'>Breakdown</div>",
                unsafe_allow_html=True
            )
            bar_fig = go.Figure(data=[go.Bar(
                x=["Keep", "Review", "Delete"],
                y=[green_n, yellow_n, red_n],
                marker=dict(
                    color=["#4caf50", "#ffc107", "#f44336"],
                    line=dict(color="rgba(255,255,255,0.1)", width=1),
                ),
                text=[green_n, yellow_n, red_n],
                textposition="outside",
                textfont=dict(size=13, color="rgba(255,255,255,0.7)", family="monospace"),
                hovertemplate="<b>%{x}</b>: %{y} records<extra></extra>",
            )])
            bar_fig.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                margin=dict(t=8, b=30, l=10, r=10),
                height=220,
                xaxis=dict(
                    showgrid=False,
                    color="rgba(255,255,255,0.4)",
                    tickfont=dict(size=11)
                ),
                yaxis=dict(visible=False),
                bargap=0.35,
            )
            st.plotly_chart(bar_fig, use_container_width=True, config={"displayModeBar": False})

        with metrics_col:
            st.markdown(
                "<div style='text-align:center; opacity:0.45; font-size:0.75rem; "
                "margin-bottom:0.5rem; letter-spacing:1.5px; text-transform:uppercase; "
                "font-weight:600;'>Metrics</div>",
                unsafe_allow_html=True
            )
            m1, m2 = st.columns(2)
            m1.metric("🟢 Keep", green_n)
            m2.metric("🟡 Review", yellow_n)
            m3, m4 = st.columns(2)
            m3.metric("🔴 Delete", red_n)
            m4.metric("🌍 CO₂ Saved", f"{energy_saved:.3f} kg")

            if total_n > 0:
                st.markdown(
                    f"<div style='opacity:0.35; font-size:0.78rem; margin-top:0.3rem; "
                    f"text-align:center; font-family:monospace;'>"
                    f"Keep {green_n/total_n*100:.0f}% · "
                    f"Review {yellow_n/total_n*100:.0f}% · "
                    f"Delete {red_n/total_n*100:.0f}%"
                    f"</div>",
                    unsafe_allow_html=True
                )

        st.markdown("")

        # --- tier cards ---

        # green
        st.markdown(
            f"<div class='tier-card tier-green'>"            f"<div class='tier-count'>{green_n}</div>"            f"<div class='tier-label'>🟢 Green — Safe, Business-Critical</div>"
            f"<div class='tier-desc'>{build_summary(green_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {green_n} green records"):
            st.dataframe(display_columns(green_df), use_container_width=True, hide_index=True)

        # yellow
        st.markdown(
            f"<div class='tier-card tier-yellow'>"            f"<div class='tier-count'>{yellow_n}</div>"            f"<div class='tier-label'>🟡 Yellow — Quarantined for Review</div>"
            f"<div class='tier-desc'>{build_summary(yellow_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {yellow_n} yellow records"):
            st.dataframe(display_columns(yellow_df), use_container_width=True, hide_index=True)

        # red
        st.markdown(
            f"<div class='tier-card tier-red'>"            f"<div class='tier-count'>{red_n}</div>"            f"<div class='tier-label'>🔴 Red — Digital Waste</div>"
            f"<div class='tier-desc'>{build_summary(red_df)}</div>"
            f"</div>",
            unsafe_allow_html=True
        )
        with st.expander(f"📋 View {red_n} red records"):
            st.dataframe(display_columns(red_df), use_container_width=True, hide_index=True)

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
                    "<div class='success-banner'>"
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
                    "<div style='opacity:0.45; font-size:0.75rem; letter-spacing:1.5px; "
                    "text-transform:uppercase; margin-bottom:1rem; font-weight:600; "
                    "text-align:center;'>Downloads</div>",
                    unsafe_allow_html=True
                )
                dl1, dl2 = st.columns(2)

                with dl1:
                    st.markdown(
                        "<div class='dl-card dl-card-green'>"
                        "<div style='font-size:2rem; margin-bottom:6px;'>📄</div>"
                        "<div style='font-weight:700; margin:6px 0; font-size:1.05rem;'>Green Data</div>"
                        "<div style='opacity:0.4; font-size:0.78rem;'>Re-encoded mainframe .dat</div>"
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
                            "<div class='dl-card dl-card-yellow'>"
                            "<div style='font-size:2rem; margin-bottom:6px;'>🗜️</div>"
                            "<div style='font-weight:700; margin:6px 0; font-size:1.05rem;'>Yellow Data</div>"
                            "<div style='opacity:0.4; font-size:0.78rem;'>Quarantine archive .zip</div>"
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
                            "<div class='dl-card' style='opacity:0.4;'>"
                            "<div style='font-size:2rem; margin-bottom:6px;'>📭</div>"
                            "<div style='font-weight:700; margin:6px 0; font-size:1.05rem;'>No Yellow Data</div>"
                            "<div style='opacity:0.4; font-size:0.78rem;'>Nothing to quarantine</div>"
                            "</div>",
                            unsafe_allow_html=True
                        )

            else:
                # haven't fired the tx yet — show the key input
                st.markdown("")
                st.markdown(
                    "<div class='glass-card' style='border-color:rgba(76,175,80,0.15);'>"
                    "<div style='display:flex; align-items:center; gap:10px; margin-bottom:0.6rem;'>"
                    "<span style='font-size:1.3rem;'>🔐</span>"
                    "<span style='font-size:0.95rem; font-weight:700;'>Blockchain Authentication</span>"
                    "<span class='chain-badge' style='margin-left:auto;'>Celo Sepolia</span>"
                    "</div>"
                    "<div style='opacity:0.45; font-size:0.82rem; margin-bottom:0.8rem; line-height:1.6;'>"
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