document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("pdfFile");
  const file = fileInput.files[0];
  const spinner = document.getElementById("spinner");
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!file) return;

  const formData = new FormData();
  formData.append("pdf", file);

  // Show spinner
  spinner.style.display = "inline";
  output.innerHTML = "";
  downloadBtn.style.display = "none";

  try {
    const response = await fetch("http://127.0.0.1:5000/extract", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    spinner.style.display = "none";

    // Display pretty JSON
    output.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;

    // Enable download
    downloadBtn.style.display = "inline";
    downloadBtn.onclick = () => {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "outline.json";
      link.click();
      URL.revokeObjectURL(url);
    };

  } catch (err) {
    spinner.style.display = "none";
    output.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    console.error("❌ Upload failed:", err);
  }
});
