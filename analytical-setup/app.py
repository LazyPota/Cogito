import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

# --- Inisialisasi Model saat Startup ---
# Model dimuat hanya sekali saat server dinyalakan untuk efisiensi.

# 1. Pipeline untuk Analisis Sentimen
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# 2. Pipeline untuk Deteksi Kekeliruan Logika (dimuat dari disk)
MODEL_PATH = './fallacy_detector_model'
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Direktori model tidak ditemukan di {MODEL_PATH}")

fallacy_pipeline = pipeline(
    "text-classification",
    model=MODEL_PATH,
    tokenizer=MODEL_PATH
)

# --- Definisi Fungsi Logika ---
def get_logic_score(text: str) -> int:
    result = fallacy_pipeline(text)[0]
    if result['label'] != "not a fallacy":
        return int(10 * (1 - result['score']))
    else:
        return int(80 + 20 * result['score'])

def get_sentiment_score(text: str) -> int:
    # ... implementasi fungsi ...
    return 0

def get_structure_score(text: str) -> int:
    # ... implementasi fungsi ...
    return 0

# --- Konfigurasi Server Flask ---
app = Flask(__name__)
CORS(app) # Mengizinkan Cross-Origin Resource Sharing

# --- Definisi API Endpoint ---
@app.route('/assess', methods=['POST'])
def assess_endpoint():
    # Validasi request body
    if not request.json or 'argument' not in request.json:
        return jsonify({"error": "Payload harus berupa JSON dengan key 'argument'"}), 400

    argument_text = request.json['argument']

    # Lakukan inferensi
    logic = get_logic_score(argument_text)
    structure = get_structure_score(argument_text)
    sentiment = get_sentiment_score(argument_text)
    final_score = max(0, logic + structure + sentiment)

    # Kembalikan respons terstruktur
    return jsonify({
        "scores": {
            "logic": logic,
            "structure": structure,
            "sentimentBonus": sentiment,
            "final": final_score
        }
    })

if __name__ == '__main__':
    # Jalankan server di localhost pada port 5000
    app.run(host='0.0.0.0', port=5000)