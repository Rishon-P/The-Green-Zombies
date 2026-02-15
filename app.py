import io
import zipfile
import hashlib
import json
import streamlit as st
import pandas as pd
from web3 import Web3
from transformers import pipeline
from presidio_analyzer import AnalyzerEngine

from reader import parse_mainframe_file
from generator import pack_comp3, create_ebcdic_record

# talking to celo sepolia testnet
CELO_RPC = "https://forno.celo-sepolia.celo-testnet.org"
CHAIN_ID = 11142220
EXPLORER = "https://sepolia.celoscan.io"

w3 = Web3(Web3.HTTPProvider(CELO_RPC))

@st.cache_resource
def load_classifier():
    return pipeline(
        "text-classification",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )

@st.cache_resource
def load_pii_analyzer():
    return AnalyzerEngine()

classifier = load_classifier()
pii_analyzer = load_pii_analyzer()

def build_summary(tier_df):
    """Builds a short human-readable summary of what's in each tier."""
    n = len(tier_df)
    if n == 0:
        return "No records in this category."

    # count different types of log entries
    sys_logs = int(tier_df['text'].str.contains("DEBUG|ERROR|WARN", case=False).sum())
    confirms = int(tier_df['text'].str.contains("CONFIRM|AUDIT", case=False).sum())
    notices = int(tier_df['text'].str.contains("NOTICE|INFO", case=False).sum())

    pii_flags = 0
    if 'PII_Count' in tier_df.columns:
        pii_flags = int(tier_df['PII_Count'].sum())

    parts = []
    if sys_logs:
        parts.append(f"{sys_logs} system/error logs")
    if confirms:
        parts.append(f"{confirms} confirmed transactions")
    if notices:
        parts.append(f"{notices} notices/info entries")
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

st.title("🌱 Zero-Rot")

# need to keep data around between streamlit reruns
if "data" not in st.session_state:
    st.session_state.data = None
if "analysis_done" not in st.session_state:
    st.session_state.analysis_done = False
if "tx_hash" not in st.session_state:
    st.session_state.tx_hash = None

st.header("📂 Step 1 — Upload Legacy Data")
uploaded_file = st.file_uploader("Upload a mainframe dump (.dat)", type="dat")

if uploaded_file:
    if st.session_state.data is None:
        with open("temp_upload.dat", "wb") as f:
            f.write(uploaded_file.getbuffer())
        st.info("Decoding EBCDIC & COMP-3 …")
        raw_records = parse_mainframe_file("temp_upload.dat")
        st.session_state.data = pd.DataFrame(raw_records)

    df = st.session_state.data
    st.header("🧠 Step 2 — AI Classification")

    if st.button("🚀 Run Analysis") or st.session_state.analysis_done:

        if not st.session_state.analysis_done:
            tiers = []
            pii_counts = []
            bar = st.progress(0)

            for i, row in df.iterrows():
                txt = row["text"]

                pii_hits = pii_analyzer.analyze(text=txt, entities=None, language="en")
                pii_count = len(pii_hits)
                has_pii = pii_count > 0

                result = classifier(txt)[0]
                is_negative = result["label"] == "NEGATIVE"
                confidence = result["score"]

                if is_negative and not has_pii and confidence >= 0.85:
                    tier = "🔴 Red (Absolute ROT)"
                elif has_pii or confidence < 0.85:
                    tier = "🟡 Yellow (Quarantine)"
                else:
                    tier = "🟢 Green (Important)"

                tiers.append(tier)
                pii_counts.append(pii_count)
                bar.progress((i + 1) / len(df))

            st.session_state.data["Tier"] = tiers
            st.session_state.data["PII_Count"] = pii_counts
            st.session_state.analysis_done = True
            st.rerun()

        df_all = st.session_state.data
        green_df = df_all[df_all["Tier"].str.contains("Green")]
        yellow_df = df_all[df_all["Tier"].str.contains("Yellow")]
        red_df = df_all[df_all["Tier"].str.contains("Red")]

        green_n = len(green_df)
        yellow_n = len(yellow_df)
        red_n = len(red_df)
        energy_saved = red_n * 0.005  # rough estimate of carbon savings

        c1, c2, c3, c4 = st.columns(4)
        c1.metric("🟢 Keep", green_n)
        c2.metric("🟡 Review", yellow_n)
        c3.metric("🔴 Delete", red_n)
        c4.metric("Carbon Savings", f"{energy_saved:.2f} kgCO2e")

        # green records
        st.subheader("🟢 Green — Safe, Business-Critical")
        st.success(build_summary(green_df))
        st.dataframe(green_df, use_container_width=True)

        # yellow records
        st.subheader("🟡 Yellow — Quarantined for Human Review")
        st.warning(build_summary(yellow_df))
        st.dataframe(yellow_df, use_container_width=True)

        # red records
        st.subheader("🔴 Red — Digital Waste")
        st.error(build_summary(red_df))
        st.dataframe(red_df, use_container_width=True)
        st.header("🛡️ Step 3 — Compliance Sign-off")

        approved = st.checkbox(
            "I, as a human compliance officer, have reviewed the Red and "
            "Yellow data summaries and authorize this action."
        )

        if not approved:
            st.info("Review the tables above and tick the box to continue.")

        else:
            st.header("⚡ Step 4 — Execute & Download")

            if st.session_state.tx_hash:
                # already done — show results
                st.balloons()
                st.success(
                    f"Red data deleted & logged on-chain!  "
                    f"Carbon savings: {energy_saved:.4f} kgCO2e"
                )
                st.markdown(
                    f"### 📜 [View proof on Celo Explorer]"
                    f"({EXPLORER}/tx/{st.session_state.tx_hash})"
                )

                # download the green data re-encoded as .dat
                st.subheader("📥 Green Data — Modernised .dat")
                st.download_button(
                    "⬇️ Download Green Data (.dat)",
                    dataframe_to_dat(green_df),
                    "eco_vault_green_clean.dat",
                    "application/octet-stream",
                )

                # and the yellow data goes into a zip
                if not yellow_df.empty:
                    st.subheader("📥 Yellow Data — Quarantine Archive")
                    st.download_button(
                        "⬇️ Download Yellow Data (.zip)",
                        make_zip(yellow_df, "quarantined_yellow.csv"),
                        "eco_vault_yellow_quarantine.zip",
                        "application/zip",
                    )

            else:
                private_key = st.text_input("Celo Private Key", type="password")

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

# reset button in the sidebar
if st.sidebar.button("Reset"):
    st.session_state.clear()
    st.rerun()