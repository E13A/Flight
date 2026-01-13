from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY

# Read the prompt content
with open('C:/Users/TUF/.gemini/antigravity/brain/0ff74bb8-0d9a-4b72-8269-52ca16568365/pptx_generation_prompt.md', 'r', encoding='utf-8') as f:
    content = f.read().strip()

# Create PDF
pdf_filename = "FlightGuard_Presentation_Instructions.pdf"
doc = SimpleDocTemplate(pdf_filename, pagesize=letter,
                        rightMargin=0.75*inch, leftMargin=0.75*inch,
                        topMargin=1*inch, bottomMargin=1*inch)

# Container for the 'Flowable' objects
elements = []

# Define styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=18,
    textColor='#0A192F',
    spaceAfter=30,
    alignment=1  # Center
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['BodyText'],
    fontSize=11,
    alignment=TA_JUSTIFY,
    leading=14,
    spaceAfter=12
)

# Add title
title = Paragraph("PowerPoint Generation Instructions: FlightGuard DApp", title_style)
elements.append(title)
elements.append(Spacer(1, 0.2*inch))

# Add subtitle
subtitle_style = ParagraphStyle(
    'Subtitle',
    parent=styles['Normal'],
    fontSize=12,
    textColor='#3B82F6',
    alignment=1,
    spaceAfter=20
)
subtitle = Paragraph("Complete Specifications for AI-Generated Presentation", subtitle_style)
elements.append(subtitle)
elements.append(Spacer(1, 0.3*inch))

# Add the main content
# Split content into smaller chunks if it's too long for single paragraph
paragraph = Paragraph(content, body_style)
elements.append(paragraph)

# Build PDF
doc.build(elements)
print(f"{pdf_filename} created successfully!")
