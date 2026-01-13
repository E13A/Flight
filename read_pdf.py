
import pypdf
import sys

try:
    reader = pypdf.PdfReader("report_rules.pdf")
    with open("report_content.txt", "w", encoding="utf-8") as f:
        for page in reader.pages:
            f.write(page.extract_text() + "\n")
    print("Done writing to report_content.txt")
except Exception as e:
    print(f"Error reading PDF: {e}")
