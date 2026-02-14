import codecs

def unpack_comp3(raw):
    """COMP-3 packed decimal -> int"""
    h = raw.hex()
    sign = h[-1].upper()
    # each nibble except the last is a decimal digit (0-9)
    digits = "".join(c for c in h[:-1] if c.isdigit())
    val = int(digits) if digits else 0
    if sign == 'D':
        val = -val
    return val

def parse_mainframe_file(file_path):
    records = []

    # layout: ID(10) | NAME(20) | AMT(3, packed) | LOG(50)
    rec_len = 83

    with open(file_path, "rb") as f:
        while chunk := f.read(rec_len):
            if len(chunk) < rec_len:
                break
            try:
                rec_id = codecs.decode(chunk[0:10], "cp037").strip()
                name = codecs.decode(chunk[10:30], "cp037").strip()
                amt = unpack_comp3(chunk[30:33])
                log = codecs.decode(chunk[33:83], "cp037").strip()

                records.append({
                    "id": rec_id, "name": name, "amount": amt, "text": log
                })
            except Exception as e:
                print(f"bad record, skipping: {e}")
                
    return records