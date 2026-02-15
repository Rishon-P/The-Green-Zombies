import codecs


def unpack_comp3(raw):
    """COMP-3 bytes back to a normal int. Last hex nibble is the sign."""
    h = raw.hex()
    val = int(h[:-1])
    if h[-1].upper() == "D":
        val = -val
    return val

def parse_mainframe_file(file_path):
    """Read all 83-byte chunks from the file, return list of dicts."""
    records = []

    with open(file_path, "rb") as f:
        while chunk := f.read(83):
            try:
                records.append({
                    "id":     codecs.decode(chunk[0:10],  "cp037").strip(),
                    "name":   codecs.decode(chunk[10:30], "cp037").strip(),
                    "amount": unpack_comp3(chunk[30:33]),
                    "text":   codecs.decode(chunk[33:83], "cp037").strip(),
                })
            except Exception as e:
                print(f"Skipping bad record: {e}")

    return records