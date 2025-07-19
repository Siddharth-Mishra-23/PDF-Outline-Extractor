from flask import Flask, request, jsonify
from flask_cors import CORS
from extract_outline import extract_headings_from_pdf
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/extract', methods=['POST'])
def extract_outline():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF uploaded'}), 400

    pdf_file = request.files['pdf']

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_path = temp_pdf.name
            pdf_file.save(temp_path)

        # ✅ Process the file after it's closed
        result = extract_headings_from_pdf(temp_path)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as e:
                print(f"Warning: Couldn't delete temp file: {e}")

if __name__ == '__main__':
    app.run(debug=True)
