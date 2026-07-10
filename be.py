from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import requests

app = Flask(__name__)
CORS(app)

# ---------------- SERIAL ----------------
try:
    ser = serial.Serial("COM4", 9600, timeout=1)
    print("Serial Port COM4 Connected")
except Exception as e:
    print("Serial Error:", e)
    ser = None

# ---------------- VARIABLES ----------------
sentence = ""
pattern = "000000"
ai_response = ""
last_letter = ""

# ---------------- BRAILLE MAP ----------------
braille_map = {
    'A': "100000", 'B': "110000", 'C': "100100",
    'D': "100110", 'E': "100010", 'F': "110100",
    'G': "110110", 'H': "110010", 'I': "010100",
    'J': "010110", 'K': "101000", 'L': "111000",
    'M': "101100", 'N': "101110", 'O': "101010",
    'P': "111100", 'Q': "111110", 'R': "111010",
    'S': "011100", 'T': "011110", 'U': "101001",
    'V': "111001", 'W': "010111", 'X': "101101",
    'Y': "101111", 'Z': "101011"
}

# ---------------- OLLAMA ----------------
def ask_ai(text):

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3",      # change to llama3 if needed
                "prompt": f"User: {text}\nAssistant:",
                "stream": False
            },
            timeout=60
        )

        data = response.json()

        return data.get("response", "No response")

    except Exception as e:

        print(e)

        return "AI not running"

# ---------------- DATA ----------------
@app.route("/data")
def data():

    global sentence
    global pattern
    global ai_response
    global last_letter

    if ser and ser.in_waiting:

        line = ser.readline().decode(errors="ignore").strip()

        print(line)

        # ---------------- LETTER ----------------

        if line.startswith("LETTER:"):

            letter = line.split(":",1)[1].strip()

            last_letter = letter

            pattern = braille_map.get(letter,"000000")

        # ---------------- WORD ----------------

        elif line.startswith("WORD:"):

            # Arduino already builds words.
            pass

        # ---------------- SENTENCE ----------------

        elif line.startswith("SENTENCE:"):

            sentence = line.split(":",1)[1].strip()

            ai_response = ask_ai(sentence)

    return jsonify({

        "sentence": sentence,
        "pattern": pattern,
        "ai_response": ai_response,
        "last_letter": last_letter

    })

# ---------------- MANUAL INPUT ----------------
@app.route("/simulate", methods=["POST"])
def simulate():

    global sentence
    global ai_response
    global pattern
    global last_letter

    data = request.json

    sentence = data["sentence"]

    pattern = "000000"

    last_letter = ""

    ai_response = ask_ai(sentence)

    return jsonify({

        "sentence": sentence,
        "ai_response": ai_response

    })

# ---------------- RUN ----------------
if __name__ == "__main__":

    print("Vision AID Backend Running...")
    print("http://localhost:5000")

    app.run(host="0.0.0.0", port=5000, debug=True)