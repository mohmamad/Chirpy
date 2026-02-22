import express from "express";
const app = express();
const PORT = 8080;
app.get("/healthz", (req, res) => {
    res.status(200).type("text/plain; charset=utf-8").send("OK");
});
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
