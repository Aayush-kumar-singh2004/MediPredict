# import os
# import sys
# import numpy as np
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image
# import contextlib

# # Suppress TensorFlow INFO and WARNING logs
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# # Assuming the model file is in the same directory as this script
# model_path = os.path.join(os.path.dirname(__file__), 'LCD.h5')
# if not os.path.exists(model_path):
#     print(f"Model file not found at {model_path}")
#     sys.exit(1)

# try:
#     model = load_model(model_path)
# except Exception as e:
#     print(f"Error loading model: {e}")
#     sys.exit(1)

# IMAGE_SIZE = (350, 350)  # Updated image size
# class_labels = ['squamous cell carcinoma', 'large cell carcinoma', 'normal', 'adenocarcinoma']

# def load_and_preprocess_image(img_path, target_size):
#     try:
#         img = image.load_img(img_path, target_size=target_size)
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array /= 255.0
#         return img_array
#     except Exception as e:
#         print(f"Error in loading and preprocessing image: {e}")
#         sys.exit(1)

# def predict_image_class(model, img_path, target_size):
#     try:
#         img = load_and_preprocess_image(img_path, target_size)
        
#         # Suppress the progress bar and other logs from Keras
#         with open(os.devnull, 'w') as f, contextlib.redirect_stdout(f), contextlib.redirect_stderr(f):
#             predictions = model.predict(img)
        
#         predicted_class = np.argmax(predictions[0])
#         predicted_label = class_labels[predicted_class]
        
#         if (predicted_label == 'normal'):
#             return 'non-cancerous'
#         else:
#             return 'cancerous'
        
#     except Exception as e:
#         print(f"Error in predicting image class: {e}")
#         sys.exit(1)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print("Usage: python predict.py <image_path>")
#         sys.exit(1)

#     img_path = sys.argv[1]
#     if not os.path.exists(img_path):
#         print(f"Image file not found at {img_path}")
#         sys.exit(1)

    # predicted_label = predict_image_class(model, img_path, IMAGE_SIZE)
    # print(predicted_label)



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
   