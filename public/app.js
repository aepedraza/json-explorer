document.getElementById("file-input").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById("json-input").value = evt.target.result;
  };
  reader.readAsText(file);
});

document.getElementById("run-btn").addEventListener("click", async function () {
  const jsonText = document.getElementById("json-input").value;
  const query = document.getElementById("query-input").value;
  let json;
  try {
    json = JSON.parse(jsonText);
  } catch (err) {
    showError("Invalid JSON: " + err.message);
    return;
  }
  try {
    const res = await fetch("/api/jsonata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json, query }),
    });
    const data = await res.json();
    if (res.ok) {
      showResult(JSON.stringify(data.result, null, 2));
    } else {
      showError(data.error || "Unknown error");
    }
  } catch (err) {
    showError("Request failed: " + err.message);
  }
});

function showResult(result) {
  document.getElementById("output").innerHTML =
    '<pre class="result">' + result + "</pre>";
}

function showError(error) {
  document.getElementById("output").innerHTML =
    '<pre class="error">' + error + "</pre>";
}

