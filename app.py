import streamlit as st
import pandas as pd
import hashlib
import json
import random
from web3 import Web3
from transformers import pipeline
from presidio_analyzer import AnalyzerEngine
from legacy_miner import parse_mainframe_file

# --- CONFIGURATION ---
CELO_RPC = "https://forno.celo-sepolia.celo-testnet.org"
CHAIN_ID = 11142220
EXPLORER_URL = "https://sepolia.celoscan.io"

w3 = Web3(Web3.HTTPProvider(CELO_RPC))

# --- 1. SETUP GREEN AI (DistilBERT) ---
@st.cache_resource
def load_classifier():
    return pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

# --- 2. SETUP PII SECURITY (Microsoft Presidio) ---
@st.cache_resource
def load_pii_analyzer():
    return AnalyzerEngine()

classifier = load_classifier()
pii_analyzer = load_pii_analyzer()

# --- APP UI ---
st.title("🌱 Eco-Vault: The Green Data Scavenger")
st.markdown("### Tech Stack: Python (Legacy Miner) + DistilBERT (Green AI) + Microsoft Presidio (Security)")

# --- SESSION STATE INITIALIZATION (The Memory) ---
if 'data' not in st.session_state:
    st.session_state.data = None
if 'analysis_done' not in st.session_state:
    st.session_state.analysis_done = False
if 'tx_hash' not in st.session_state:
    st.session_state.tx_hash = None

# 1. INGESTION
uploaded_file = st.file_uploader("Upload Mainframe Dump (.dat)", type="dat")

if uploaded_file:
    # Only parse the file if we haven't already done so
    if st.session_state.data is None:
        with open("temp_upload.dat", "wb") as f:
            f.write(uploaded_file.getbuffer())
        
        st.info("🔄 Legacy Miner: Decoding EBCDIC & COMP-3 binaries...")
        raw_data = parse_mainframe_file("temp_upload.dat")
        st.session_state.data = pd.DataFrame(raw_data) # Save to memory
    
    df = st.session_state.data # Load from memory

    # 2. ANALYSIS (The Core Logic)
    # We check if analysis is ALREADY done to keep the results on screen
    if st.button("🚀 Run Green Analysis") or st.session_state.analysis_done:
        
        # Only run the heavy AI part if we haven't done it yet
        if not st.session_state.analysis_done:
            results = []
            progress_bar = st.progress(0)
            
            for index, row in df.iterrows():
                text_content = row['text']
                
                # A. Check for PII
                pii_results = pii_analyzer.analyze(
                    text=text_content,
                    entities=None,
                    language='en'
                )
                has_pii = len(pii_results) > 0
                
                # B. Check Intent using DistilBERT
                ai_score = classifier(text_content)
                is_waste_candidate = ai_score[0]['label'] == 'NEGATIVE'

                
                # C. Classification Logic
                status = "UNKNOWN"
                if has_pii:
                    status = "🔴 TOXIC (PII Found)"
                elif is_waste_candidate:
                    status = "🟢 ROT (Digital Waste)"
                else:
                    status = "🟡 CRITICAL (Keep)"
                    
                results.append(status)
                progress_bar.progress((index + 1) / len(df))
            
            # Save results to session state
            st.session_state.data['Classification'] = results
            st.session_state.analysis_done = True
            st.rerun() # Refresh to show results

        # Display Metrics
        df_display = st.session_state.data
        waste_count = len(df_display[df_display['Classification'].str.contains("ROT")])
        toxic_count = len(df_display[df_display['Classification'].str.contains("TOXIC")])
        energy_saved = waste_count * 0.005 
        
        col1, col2, col3 = st.columns(3)
        col1.metric("Digital Waste (ROT)", waste_count, delta="Delete to Save Energy")
        col2.metric("Toxic PII Records", toxic_count, delta="Security Risk!")
        col3.metric("Est. Carbon Savings", f"{energy_saved:.4f} kgCO2e")
        
        st.dataframe(df_display)

        # 3. ACTION (Blockchain)
        st.subheader("🔗 Step 3: Carbon Credit Minting")
        
        # Check if we already have a transaction hash from a previous run
        if st.session_state.tx_hash:
            st.balloons()
            st.success(f"✅ DATA DELETED & AUDITED! Carbon Savings: {energy_saved:.4f} kgCO2e")
                # 3. ACTION (Blockchain & Cleanup)
            st.subheader("🔗 Step 3: Carbon Credit Minting")
            
            # Check if we already have a transaction hash from a previous run
            if st.session_state.tx_hash:
                st.balloons()
                st.success(f"✅ DATA DELETED & AUDITED! Carbon Savings: {energy_saved:.4f} kgCO2e")
                st.markdown(f"### 📜 [Click Here to View Proof on Celo Explorer]({EXPLORER_URL}/tx/{st.session_state.tx_hash})")
                st.info("The rows marked as 'ROT' have been removed from the active dataset.")
                
                # --- NEW FEATURE: DOWNLOAD CLEANED DATA ---
                st.markdown("### 📥 Download Modernized Dataset")
                st.write("Since browsers cannot delete local files, download your new 'Clean' dataset here. This simulates the bank updating their records.")
                
                # Convert the clean dataframe (from memory) to CSV
                clean_df = st.session_state.data
                csv = clean_df.to_csv(index=False).encode('utf-8')
                
                st.download_button(
                    label="⬇️ Download Cleaned Data (CSV)",
                    data=csv,
                    file_name="modernized_banking_data_clean.csv",
                    mime="text/csv",
                )
                # ------------------------------------------

            else:
                private_key = st.text_input("Enter Celo Private Key", type="password")
                
                if st.button("♻️ Delete Waste & Mint Proof") and private_key:
                    # 1. Filter out the waste rows (Simulate Deletion)
                    df_clean = df_display[~df_display['Classification'].str.contains("ROT")]
                    st.session_state.data = df_clean # Update the memory with the cleaner dataset
                    
                    # 2. Hash the deleted data for the receipt
                    waste_data = df_display[df_display['Classification'].str.contains("ROT")].to_json()
                    proof_hash = hashlib.sha256(waste_data.encode()).hexdigest()
                    
                    # 3. Create Blockchain Transaction
                    account = w3.eth.account.from_key(private_key)
                    payload = json.dumps({
                        "app": "Eco-Vault",
                        "action": "DIGITAL_DECARBONIZATION",
                        "deleted_records": waste_count,
                        "carbon_saved_kg": energy_saved,
                        "proof_hash": proof_hash
                    })
                    
                    tx = {
                        'to': account.address,
                        'value': 0,
                        'gas': 250000,
                        'gasPrice': w3.eth.gas_price,
                        'nonce': w3.eth.get_transaction_count(account.address),
                        'chainId': CHAIN_ID,
                        'data': w3.to_hex(text=payload)
                    }
                    
                    try:
                        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
                        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
                        
                        # SAVE THE HASH TO SESSION STATE
                        st.session_state.tx_hash = w3.to_hex(tx_hash)
                        st.rerun() # Force a refresh to show the success message and download button
                        
                    except Exception as e:
                        st.error(f"Blockchain Error: {e}")
            st.markdown(f"### 📜 [Click Here to View Proof on Celo Explorer]({EXPLORER_URL}/tx/{st.session_state.tx_hash})")
            st.info("The rows marked as 'ROT' have been removed from the active dataset.")
        else:
            private_key = st.text_input("Enter Celo Private Key", type="password")
            
            if st.button("♻️ Delete Waste & Mint Proof") and private_key:
                # 1. Filter out the waste rows (Simulate Deletion)
                df_clean = df_display[~df_display['Classification'].str.contains("ROT")]
                st.session_state.data = df_clean # Update the memory with the cleaner dataset
                
                # 2. Hash the deleted data for the receipt
                waste_data = df_display[df_display['Classification'].str.contains("ROT")].to_json()
                proof_hash = hashlib.sha256(waste_data.encode()).hexdigest()
                
                # 3. Create Blockchain Transaction
                account = w3.eth.account.from_key(private_key)
                payload = json.dumps({
                    "app": "Eco-Vault",
                    "action": "DIGITAL_DECARBONIZATION",
                    "deleted_records": waste_count,
                    "carbon_saved_kg": energy_saved,
                    "proof_hash": proof_hash
                })
                
                tx = {
                    'to': account.address,
                    'value': 0,
                    'gas': 250000,
                    'gasPrice': w3.eth.gas_price,
                    'nonce': w3.eth.get_transaction_count(account.address),
                    'chainId': CHAIN_ID,
                    'data': w3.to_hex(text=payload)
                }
                
                try:
                    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
                    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
                    
                    # SAVE THE HASH TO SESSION STATE
                    st.session_state.tx_hash = w3.to_hex(tx_hash)
                    st.rerun() # Force a refresh to update the table and show the link
                    
                except Exception as e:
                    st.error(f"Blockchain Error: {e}")

# Add a reset button to start over
if st.sidebar.button("Reset Demo"):
    st.session_state.clear()
    st.rerun()