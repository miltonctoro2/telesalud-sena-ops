import pypdf

def extract_pdf_text(pdf_path, output_txt_path):
    print(f"Abriendo PDF: {pdf_path}")
    reader = pypdf.PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total de páginas: {num_pages}")
    
    with open(output_txt_path, "w", encoding="utf-8") as f:
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            f.write(f"--- PÁGINA {i+1} ---\n")
            f.write(text)
            f.write("\n\n")
    print(f"Texto extraído guardado en: {output_txt_path}")

if __name__ == "__main__":
    extract_pdf_text("Herramienta-autoevaluación-de-competencias-OPS.pdf", "extracted_text.txt")
