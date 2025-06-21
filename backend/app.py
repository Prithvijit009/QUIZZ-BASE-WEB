from flask import Flask, request, jsonify, send_from_directory
import os, json, uuid

app = Flask(__name__, static_folder="../frontend")

QUIZ_PATH = "../data/quizzes.json"
RESULT_PATH = "../data/results.json"
LOCATION_PATH = "../data/locations.json"

# ✅ Serve frontend files
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "create.html")

@app.route("/<path:path>")
def serve_file(path):
    return send_from_directory(app.static_folder, path)

# ✅ Create Quiz
@app.route("/create-quiz", methods=["POST"])
def create_quiz():
    data = request.get_json()
    quiz_id = str(uuid.uuid4())[:8]

    if not os.path.exists(QUIZ_PATH):
        with open(QUIZ_PATH, "w") as f:
            json.dump({}, f)

    with open(QUIZ_PATH, "r+") as f:
        quizzes = json.load(f)
        quizzes[quiz_id] = data["quiz"]
        f.seek(0)
        json.dump(quizzes, f, indent=2)

    return jsonify({"quiz_id": quiz_id})

# ✅ Get quiz by quiz_id
@app.route("/get-quiz/<quiz_id>")
def get_quiz(quiz_id):
    if os.path.exists(QUIZ_PATH):
        with open(QUIZ_PATH) as f:
            quizzes = json.load(f)
        return jsonify(quizzes.get(quiz_id, []))
    return jsonify([])

# ✅ Save result
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json
    quiz_id = data["quiz_id"]
    answers = data["answers"]
    score = data["score"]

    if not os.path.exists(RESULT_PATH):
        with open(RESULT_PATH, "w") as f:
            json.dump({}, f)

    with open(RESULT_PATH, "r+") as f:
        result_data = json.load(f)
        result_data[str(uuid.uuid4())] = {
            "quiz_id": quiz_id,
            "answers": answers,
            "score": score
        }
        f.seek(0)
        json.dump(result_data, f, indent=2)

    return jsonify({"message": "Result saved"})

# ✅ Save friend location
@app.route("/save-location", methods=["POST"])
def save_location():
    loc = request.get_json()
    LOCATION_PATH = "../data/locations.json"

    if not os.path.exists(LOCATION_PATH):
        with open(LOCATION_PATH, "w") as f:
            json.dump([], f)

    with open(LOCATION_PATH, "r+") as f:
        try:
            locations = json.load(f)
            if not isinstance(locations, list):
                locations = []
        except:
            locations = []

        locations.append(loc)
        f.seek(0)
        f.truncate()
        json.dump(locations, f, indent=2)

    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
