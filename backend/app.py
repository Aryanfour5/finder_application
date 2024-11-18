from flask import Flask, request, jsonify
from transformers import pipeline
import requests
from io import BytesIO
from pdfminer.high_level import extract_text

app = Flask(__name__)

# Load pre-trained summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


def fetch_pdf_text(pdf_url):
    """
    Fetch and extract text from a PDF file at the given URL.
    """
    response = requests.get(pdf_url)
    response.raise_for_status()  # Ensure the request was successful
    pdf_content = BytesIO(response.content)
    return extract_text(pdf_content)


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    pdf_url = data.get("pdf_url")
    authors = data.get("authors", "Unknown")
    date = data.get("date", "Unknown")

    if not pdf_url:
        return jsonify({"error": "No PDF URL provided"}), 400

    try:
        # Extract text from the PDF
        full_text = fetch_pdf_text(pdf_url)

        # Summarize Methodology and Findings
        methodology_summary = summarizer(
            full_text[:2000], max_length=150, min_length=50, do_sample=False
        )[0]["summary_text"]
        findings_summary = summarizer(
            full_text[2000:4000], max_length=150, min_length=50, do_sample=False
        )[0]["summary_text"]

        return jsonify(
            {
                "Methodology": methodology_summary,
                "Findings": findings_summary,
                "Authors": authors,
                "Date of Publication": date,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
