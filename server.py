from flask import Flask, request, send_file, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route("/upload/", methods=["POST"])
def upload_image():
    try:
        print("Received request...")  # Debugging
        file = request.files.get("file")
        mode = request.form.get("mode")

        if not file:
            return jsonify({"error": "No file received!"}), 400
        if not mode:
            return jsonify({"error": "No mode selected!"}), 400

        image = Image.open(file.stream)
        print(f"Image format: {image.format}, Size: {image.size}")  # Debugging

        if mode == "upsample":
            image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
        elif mode == "downsample":
            image = image.resize((image.width // 2, image.height // 2), Image.LANCZOS)
        else:
            return jsonify({"error": "Invalid mode selected!"}), 400

        img_io = io.BytesIO()
        image.save(img_io, format="JPEG")
        img_io.seek(0)

        print("Processing complete!")  # Debugging
        return send_file(img_io, mimetype="image/jpeg")

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging
        return jsonify({"error": str(e)}), 500  # Ensure errors return as JSON

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
