"""
Lung Cancer Prediction — persistent inference server.

WHY THIS FILE EXISTS:
The old approach spawned a fresh `python predict.py <image>` process for
every single request. Each spawn re-imported TensorFlow and re-loaded
LCD.h5 from disk, which took 12-30+ seconds and repeatedly spiked memory
on Render's free tier (512MB RAM / 0.15 CPU) until the OS killed the
process — that's the silent "Python exited with code: 1" with no
traceback you were seeing.

This server loads the model ONCE at startup and just runs `.predict()`
on each request afterwards, which is fast and has a flat memory profile.

Run with:  python server.py
Node calls it over HTTP at POST /predict instead of spawning a process.
"""

import os
import sys
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Reduce TensorFlow log noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "LCD.h5")

IMAGE_SIZE = (224, 224)
CLASS_LABELS = [
    "squamous cell carcinoma",
    "large cell carcinoma",
    "normal",
    "adenocarcinoma",
]

app = Flask(__name__)
model = None  # populated once, below


def load_model_once():
    global model
    if model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        print(f"FATAL: Model file not found at {MODEL_PATH}", flush=True)
        sys.exit(1)

    print("Loading lung cancer model (one-time)...", flush=True)
    model = load_model(MODEL_PATH)
    # Warm up so the very first real request isn't the slow one.
    dummy = np.zeros((1, IMAGE_SIZE[0], IMAGE_SIZE[1], 3), dtype="float32")
    model.predict(dummy, verbose=0)
    print("Model loaded and warmed up. Server ready.", flush=True)


def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=IMAGE_SIZE)
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    img_path = data.get("path")

    if not img_path:
        return jsonify({"error": "Missing 'path' in request body"}), 400

    if not os.path.exists(img_path):
        return jsonify({"error": "Image file not found", "path": img_path}), 400

    try:
        img = preprocess_image(img_path)
        preds = model.predict(img, verbose=0)
        class_index = int(np.argmax(preds[0]))
        label = CLASS_LABELS[class_index]
        result = "non-cancerous" if label == "normal" else "cancerous"
        return jsonify({"result": result, "label": label})

    except Exception as e:
        print("Prediction error:", str(e), flush=True)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    load_model_once()
    port = int(os.environ.get("PY_PORT", 6000))
    # threaded=False keeps memory predictable on a 0.15 CPU instance —
    # requests are handled one at a time, which is fine for this use case.
    app.run(host="127.0.0.1", port=port, threaded=False)