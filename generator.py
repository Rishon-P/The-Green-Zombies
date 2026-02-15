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

junk_logs = [
    "DEBUG: System dump memory leak at 0x000",
    "DEBUG: Null pointer dereference in module 7",
    "ERROR: Retry timeout on batch job #4412",
    "WARN: Disk cache overflow flushed segment 9",
    "DEBUG: Heap allocation failed for buffer pool",
    "ERROR: Connection pool exhausted srv-legacy-03",
]

important_logs = [
    "CONFIRM: Transaction verified for client",
    "CONFIRM: Wire transfer approved by compliance",
    "AUDIT: Quarterly balance reconciliation passed",
    "CONFIRM: Loan disbursement completed account",
    "AUDIT: KYC verification passed for applicant",
]

grey_area_logs = [
    "NOTICE: Account flagged for manual review",
    "WARN: Unusual login pattern detected for user",
    "NOTICE: Compliance hold pending officer review",
    "INFO: Record updated by system migration batch",
    "WARN: Data format mismatch in legacy import",
]

print("Writing legacy_mainframe.dat ...")

with open("legacy_mainframe.dat", "wb") as f:
    for i in range(50):
        roll = random.random()
        if roll < 0.35:
            log = random.choice(junk_logs)
        elif roll < 0.65:
            log = random.choice(important_logs)
        else:
            log = random.choice(grey_area_logs)

        f.write(create_ebcdic_record(str(i), fake.name(),
                                     random.randint(100, 9999), log))

print("Done — 50 records ready.")
