let mode = "downsample";

function setMode(selectedMode) {
    mode = selectedMode;
}

async function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        document.getElementById("errorMessage").innerText = "Please select an image!";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("mode", mode);

    try {
        const response = await fetch("http://127.0.0.1:5000/upload/", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to process image.");

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById("processedImage").src = imageUrl;
        document.getElementById("errorMessage").innerText = "";
    } catch (error) {
        console.error(error);
        document.getElementById("errorMessage").innerText = "Error processing image.";
    }
}
