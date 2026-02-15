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

_log_generator = None

_FEW_SHOT = (
    "Banking mainframe COBOL transaction log:\n"
    ">> ERROR: disk I/O failure on drive 7\n"
    ">> CONFIRM: wire transfer cleared\n"
    ">> AUDIT: end-of-day reconciliation ok\n"
    ">> WARN: thread pool near capacity\n"
    ">>"
)


def _get_log_generator():
    """Load distilgpt2 once, only when we actually need it."""
    global _log_generator
    if _log_generator is None:
        from transformers import pipeline
        print("Loading distilgpt2 (82 M params, energy-efficient) …")
        _log_generator = pipeline("text-generation", model="distilgpt2")
    return _log_generator


def generate_log() -> str:
    """
    AI generates a complete log entry from scratch.
    Few-shot prompting teaches the format; all content is novel.
    """
    gen = _get_log_generator()
    result = gen(
        _FEW_SHOT,
        max_new_tokens=18,
        do_sample=True,
        temperature=0.85,
        top_k=40,
        repetition_penalty=1.3,
        pad_token_id=50256,
    )
    full = result[0]["generated_text"]
    # everything after the prompt is what the AI invented
    new_text = full[len(_FEW_SHOT):].strip()
    # take only the first generated line
    new_text = new_text.split("\n")[0].strip()
    # strip any leading ">>" the model might echo
    if new_text.startswith(">>"):
        new_text = new_text[2:].strip()
    # keep only printable ASCII (EBCDIC cp037 safe)
    new_text = "".join(c for c in new_text if 32 <= ord(c) < 127)
    return new_text[:50] if new_text else "LOG: system event recorded"


def generate_source_name() -> str:
    """
    Produce a realistic source name for the record.
    ~50 % system identifiers (for error/debug logs),
    ~50 % person names (for transaction/audit logs).
    """
    if random.random() < 0.5:
        # system / server / process identifier
        prefixes = ["SRV", "NODE", "PROC", "BATCH", "HOST", "CORE"]
        zones = ["MAIN", "DB", "NET", "AUTH", "TXN", "LEDGER"]
        return f"{random.choice(prefixes)}-{random.choice(zones)}-{random.randint(1, 99):02d}"
    else:
        return fake.name()

if __name__ == "__main__":
    print("Generating 50 AI-written log entries …\n")

    with open("legacy_mainframe.dat", "wb") as f:
        for i in range(50):
            log = generate_log()
            f.write(create_ebcdic_record(str(i), generate_source_name(),
                                         random.randint(100, 9999), log))

            if (i + 1) % 10 == 0:
                print(f"  {i + 1}/50 records written …")

    print("\nDone — 50 AI-generated records ready.")
