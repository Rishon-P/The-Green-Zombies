"""Read and display legacy mainframe transaction records in a friendly format."""

from reader import parse_mainframe_file

def main():
    file_path = "legacy_mainframe.dat"

    print()
    print("=" * 72)
    print("  Legacy Mainframe Transaction Report")
    print("=" * 72)
    print()

    try:
        records = parse_mainframe_file(file_path)
    except FileNotFoundError:
        print(f"  Could not find '{file_path}'.")
        print("  Run generator.py first to create the data file.")
        return

    if not records:
        print("  No records found in the file.")
        return

    print(f"  Found {len(records)} record(s)\n")

    # header
    print(f"  {'#':<5} {'ID':<12} {'Name':<22} {'Amount':>10}   Log Message")
    print(f"  {'-'*5} {'-'*12} {'-'*22} {'-'*10}   {'-'*30}")

    total = 0
    for i, rec in enumerate(records, start=1):
        amt = rec["amount"]
        total += amt
        # format amount with dollar sign and commas
        amt_str = f"${amt:,.2f}" if amt >= 0 else f"-${abs(amt):,.2f}"
        print(f"  {i:<5} {rec['id']:<12} {rec['name']:<22} {amt_str:>10}   {rec['text']}")

    print(f"\n  {'-'*72}")
    total_str = f"${total:,.2f}" if total >= 0 else f"-${abs(total):,.2f}"
    print(f"  {'Total':>39} {total_str:>10}")
    print(f"  {'Records':>39} {len(records):>10}")
    print()


if __name__ == "__main__":
    main()
