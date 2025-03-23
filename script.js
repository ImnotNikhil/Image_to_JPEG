document.getElementById("processButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const mode = document.querySelector('input[name="mode"]:checked');

    if (!fileInput.files.length) {
        alert("Please select an image first!");
        return;
    }
    if (!mode) {
        alert("Please select an option (Upsample or Downsample)!");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("mode", mode.value);

    try {
        let response = await fetch("http://127.0.0.1:5000/upload/", {
            method: "POST",
            body: formData
        });

        let contentType = response.headers.get("content-type");

        if (!response.ok) {
            // If the server sends a JSON error, parse it
            if (contentType && contentType.includes("application/json")) {
                let errorData = await response.json();
                alert("Error: " + errorData.error);
            } else {
                let errorText = await response.text();
                alert("Error: " + errorText);
            }
            return;
        }

        // If the response is an image, display it
        if (contentType && contentType.includes("image/jpeg")) {
            let blob = await response.blob();
            let imgUrl = URL.createObjectURL(blob);
            document.getElementById("processedImage").src = imgUrl;
        } else {
            alert("Unexpected response from server!");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while processing the image.");
    }
});
