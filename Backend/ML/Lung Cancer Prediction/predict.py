import os
import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Reduce TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# ------------------ MODEL PATH ------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "LCD.h5")

if not os.path.exists(MODEL_PATH):
    print("ERROR: Model file not found")
    sys.exit(1)

# ------------------ LOAD MODEL ------------------
try:
    model = load_model(MODEL_PATH)
except Exception as e:
    print("ERROR: Failed to load model")
    sys.exit(1)

# ------------------ CONFIG ------------------
IMAGE_SIZE = (224, 224)   # ✅ safest size
CLASS_LABELS = [
    "squamous cell carcinoma",
    "large cell carcinoma",
    "normal",
    "adenocarcinoma"
]

# ------------------ IMAGE PREPROCESS ------------------
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=IMAGE_SIZE)
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# ------------------ MAIN ------------------
if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("ERROR: Image path missing")
        sys.exit(1)

    img_path = sys.argv[1]

    if not os.path.exists(img_path):
        print("ERROR: Image file not found")
        sys.exit(1)

    try:
        img = preprocess_image(img_path)
        preds = model.predict(img, verbose=0)
        class_index = int(np.argmax(preds[0]))
        label = CLASS_LABELS[class_index]

        # ⚠️ VERY IMPORTANT: print ONLY ONE WORD
        if label == "normal":
            print("non-cancerous")
        else:
            print("cancerous")

    except Exception as e:
        print("ERROR:", str(e))
        sys.exit(1)
   