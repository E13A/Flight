from PIL import Image, ImageDraw, ImageFont
from pygments import highlight
from pygments.lexers import get_lexer_for_filename, guess_lexer
from pygments.formatters import ImageFormatter
import os

# Configuration
BG_COLOR = "#1eff00" 
FONT_SIZE = 24
LINE_NUMBERS = True

FILES_TO_CAPTURE = [
    {
        "path": r"smart contracts and etls/contracts/CompanyFunding.sol",
        "lines": (20, 50),
        "title": "Smart Contract: Funding Pool Logic"
    },
    {
        "path": r"smart contracts and etls/contracts/UserDelayInsurance.sol",
        "lines": (20, 50),
        "title": "Smart Contract: Insurance Policy Logic"
    },
    {
        "path": r"smart contracts and etls/etl/listener.py",
        "lines": (15, 45),
        "title": "ETL: Event Listener"
    },
    {
        "path": r"backend/api/endpoints/bookings.py",
        "lines": (10, 40),
        "title": "Backend: Booking Endpoint"
    },
    {
        "path": r"frontend/src/app/page.jsx",
        "lines": (10, 40),
        "title": "Frontend: Landing Page Component"
    }
]

def generate_code_image(file_info):
    path = file_info["path"]
    start_line, end_line = file_info["lines"]
    
    if not os.path.exists(path):
        print(f"Skipping {path}: File not found")
        return None

    try:
        with open(path, "r", encoding="utf-8") as f:
            lines = f.read().splitlines()
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return None

    # Extract snippet
    snippet_lines = lines[start_line:end_line]
    snippet = "\n".join(snippet_lines)
    
    # syntax highlighting
    try:
        lexer = get_lexer_for_filename(path)
    except:
        try:
            lexer = guess_lexer(snippet)
        except:
             from pygments.lexers.special import TextLexer
             lexer = TextLexer()

    formatter = ImageFormatter(
        font_name="Consolas",
        font_size=FONT_SIZE,
        line_numbers=True,
        line_number_start=start_line + 1,
        style="monokai", # dark theme
    )

    # Generate image data
    # ImageFormatter returns bytes. We need to save it.
    output_filename = f"code_image_{os.path.basename(path)}.png"
    
    with open(output_filename, "wb") as f:
        f.write(highlight(snippet, lexer, formatter))
    
    print(f"Generated {output_filename}")
    return output_filename

def main():
    for file_info in FILES_TO_CAPTURE:
        generate_code_image(file_info)

if __name__ == "__main__":
    main()
