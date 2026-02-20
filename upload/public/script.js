function displayFiles(files) {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    files.forEach(file => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="file-name">
                <i class="fa-solid fa-file"></i> ${file.originalname}
            </span>
            <div class="file-actions">
                <button onclick="downloadFile('${file.filename}')">
                    <i class="fa-solid fa-download"></i>
                </button>
                <button onclick="deleteFile('${file._id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        fileList.appendChild(li);
    });
}
