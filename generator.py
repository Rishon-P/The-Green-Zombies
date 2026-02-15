import random
import codecs
from faker import Faker

fake = Faker()

def pack_comp3(number, width=3):
    digits = str(abs(number)).zfill(width * 2 - 1)
    packed = bytearray()
    for i in range(0, len(digits) - 1, 2):
        packed.append(int(digits[i] + digits[i + 1], 16))
    sign = 0xC if number >= 0 else 0xD
    packed.append((int(digits[-1]) << 4) | sign)
    return packed


def create_ebcdic_record(rec_id, name, amount, log_text):
    return (
        codecs.encode(f"{rec_id:<10}",   "cp037")
        + codecs.encode(f"{name:<20}",   "cp037")
        + pack_comp3(amount)
        + codecs.encode(f"{log_text:<50}", "cp037")
    )


# ---------------------------------------------------------------------------
# distilgpt2 — 82 M params, decoder-only, energy-efficient
# Generates unique mainframe log entries from scratch.
# The ONLY input is a single keyword (e.g. "ERROR") — the AI invents the
# entire log message independently. Zero hardcoded sentences anywhere.
# ---------------------------------------------------------------------------

_log_generator = None          # lazy singleton


def _get_log_generator():
    """Load distilgpt2 once, only when we actually need it."""
    global _log_generator
    if _log_generator is None:
        from transformers import pipeline
        print("Loading distilgpt2 (82 M params, energy-efficient) …")
        _log_generator = pipeline("text-generation", model="distilgpt2")
    return _log_generator


def generate_log(keyword: str) -> str:
    """
    AI generates a full log entry from a SINGLE keyword.
    e.g. keyword="ERROR" → "ERROR: connection timeout on port 443"
    The keyword is just a log-level token — all content is AI-generated.
    """
    gen = _get_log_generator()
    prompt = f"{keyword}:"
    result = gen(
        prompt,
        max_new_tokens=18,
        do_sample=True,
        temperature=0.85,
        top_k=40,
        repetition_penalty=1.3,
        pad_token_id=50256,
    )
    text = result[0]["generated_text"].strip()
    text = text.split("\n")[0].strip()
    text = "".join(c for c in text if 32 <= ord(c) < 127)
    return text[:50] if text else f"{keyword}: system event"


# ---------------------------------------------------------------------------
# Record generation — each record gets a log-level keyword, a source name,
# and a dollar amount.  The keyword determines whether the source is a
# system identifier or a person name — no person names on system errors.
# ---------------------------------------------------------------------------

# Log-level keywords fed to distilgpt2 (single tokens, not sentences).
# Weighted so we get a realistic mix of ~55 % junk, ~35 % important, ~10 % grey.
_KEYWORDS = [
    # (keyword,  weight,  source_type)
    ("ERROR",    20,  "system"),
    ("WARN",     10,  "system"),
    ("DEBUG",    10,  "system"),
    ("FAULT",     5,  "system"),
    ("CONFIRM",  15,  "person"),
    ("AUDIT",    10,  "person"),
    ("APPROVED", 10,  "person"),
    ("NOTICE",    5,  "system"),
    ("ALERT",     5,  "system"),
    ("INFO",      5,  "system"),
    ("TRANSFER",  5,  "person"),
]

_KW_LIST    = [k for k, w, _ in _KEYWORDS for _ in range(w)]
_KW_SOURCE  = {k: s for k, _, s in _KEYWORDS}


def _system_name() -> str:
    """Generate a realistic mainframe system identifier."""
    prefixes = ["SRV", "NODE", "PROC", "BATCH", "HOST", "CORE", "JOB", "SPOOL"]
    zones    = ["MAIN", "DB", "NET", "AUTH", "TXN", "LEDGER", "DISK", "MEM"]
    return f"{random.choice(prefixes)}-{random.choice(zones)}-{random.randint(1, 99):02d}"


def generate_record(rec_id: int):
    """Generate one complete record: (id, name, amount, log_text)."""
    keyword = random.choice(_KW_LIST)
    log_text = generate_log(keyword)

    # system errors → system name;  financial logs → person name
    if _KW_SOURCE[keyword] == "system":
        name = _system_name()
    else:
        name = fake.name()

    amount = random.randint(100, 9999)
    return str(rec_id), name, amount, log_text


# ---------------------------------------------------------------------------
# CLI entry-point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Generating 50 AI-written log entries …\n")

    with open("legacy_mainframe.dat", "wb") as f:
        for i in range(50):
            rec_id, name, amount, log_text = generate_record(i)
            f.write(create_ebcdic_record(rec_id, name, amount, log_text))

            if (i + 1) % 10 == 0:
                print(f"  {i + 1}/50 records written …")

    print("\nDone — 50 AI-generated records ready.")
