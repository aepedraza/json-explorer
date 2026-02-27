const express = require("express");
const jsonata = require("jsonata");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/jsonata", async (req, res) => {
  const { json, query } = req.body;
  // Input validation
  if (typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query must be a non-empty string." });
  }

  if (
    json === null ||
    json === undefined ||
    (typeof json !== "object" && !Array.isArray(json))
  ) {
    return res
      .status(400)
      .json({ error: "JSON input must be an object or array." });
  }

  try {
    const expr = jsonata(query);
    const result = await expr.evaluate(json);
    console.log("DEBUG: result =", result, "typeof", typeof result); // Debug log
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;

