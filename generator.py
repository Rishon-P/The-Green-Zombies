"""Generate a legacy mainframe data file with EBCDIC encoding and COMP-3 binary format.

This script creates a binary file containing mixed transaction records, simulating
the format commonly found on legacy IBM mainframe systems.
"""

import random
import codecs
from faker import Faker

# Initialize faker for generating realistic names
fake = Faker()


def pack_comp3(number):
    """Pack a number into IBM COMP-3 format (Packed Decimal).
    
    COMP-3 is a mainframe storage format where each decimal digit is stored in a nibble (4 bits),
    with a sign indicator in the last nibble (0xC for positive, 0xD for negative).
    
    Args:
        number: Integer value to pack
        
    Returns:
        bytearray: The packed binary representation
    """
    # Convert number to string digits, padded to 5 digits (fills 3 bytes with sign nibble)
    digit_string = str(abs(number)).zfill(5)

    # Pack pairs of digits into bytes: '123' -> 0x12, 0x3C
    # Each byte contains two decimal digits in hexadecimal form
    packed = bytearray()
    for i in range(0, len(digit_string) - 1, 2):
        # Combine two adjacent digits and convert hex string to byte value
        byte_value = int(digit_string[i] + digit_string[i+1], 16)
        packed.append(byte_value)

    # Append the sign nibble: 0xC (positive) or 0xD (negative)
    # Format: last_digit=4 high bits, sign=4 low bits
    last_digit = int(digit_string[-1])
    sign_nibble = 0xC if number >= 0 else 0xD  # C=positive, D=negative
    last_byte = (last_digit << 4) | sign_nibble  # Shift digit left 4 bits and OR with sign
    packed.append(last_byte)

    return packed

def create_ebcdic_record(record_id, name, amount, log_text):
    """Create a binary transaction record in legacy mainframe format.
    
    Combines multiple fields with different encodings:
    - ID and name fields use EBCDIC (Extended Binary Coded Decimal Interchange Code)
    - Amount field uses COMP-3 (packed decimal binary format)
    - Log message field uses EBCDIC
    
    Args:
        record_id: Transaction ID (converted to 10-char string)
        name: Customer/entity name (padded to 20 chars)
        amount: Transaction amount in cents/smallest unit (packed as COMP-3)
        log_text: Transaction log/status message (padded to 50 chars)
        
    Returns:
        bytes: Complete EBCDIC/binary record concatenated together
    """
    # Convert and pad ID: text to EBCDIC encoding, left-aligned in 10 chars
    id_bytes = codecs.encode(f"{record_id:<10}"[:10], "cp037")

    # Convert and pad name: text to EBCDIC encoding, left-aligned in 20 chars
    name_bytes = codecs.encode(f"{name:<20}"[:20], "cp037")

    # Convert amount: integer to packed decimal (COMP-3 binary format)
    amount_bytes = pack_comp3(amount)

    # Convert and pad log message: text to EBCDIC encoding, left-aligned in 50 chars
    log_bytes = codecs.encode(f"{log_text:<50}"[:50], "cp037")

    # Concatenate all fields in order
    return id_bytes + name_bytes + amount_bytes + log_bytes

if __name__ == "__main__":
    print("Generating 'legacy_mainframe.dat'...")
    
    # Create output file in binary write mode
    with open("legacy_mainframe.dat", "wb") as output_file:
        # Generate 50 sample transaction records
        for record_index in range(50):
            # Randomly select log message: mix of debug and confirmation messages
            if random.random() > 0.5:
                transaction_log = "DEBUG: System dump memory leak at 0x000"
            else:
                transaction_log = "CONFIRM: Transaction verified for client"
            
            # Build the binary record with random data
            record = create_ebcdic_record(
                record_id=str(record_index),
                name=fake.name(),
                amount=random.randint(100, 9999),
                log_text=transaction_log
            )
            
            # Write the binary record to file
            output_file.write(record)
    
    print("Done. This file is now unreadable by standard text editors.")
