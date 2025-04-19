import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3000;
const apiUrl = "https://dev.smartjournal.net:443/um/test/api/jr/txn";

app.use(express.json());
app.use(cors());


app.get("/api/getAidList", (req, res) => {
  let url = apiUrl + "/aidlist/v1";
  let settings = {method: "Get"}
  fetch(url, settings)
    .then(response => response.json())
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/getAtmList", (req, res) => {
  let url = apiUrl + "/atmlist/v1";
  let settings = {method: "Get"}
  fetch(url, settings)
    .then(response => response.json())
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/getTransactions", (req, res) => {
  const atmid = req.headers["atmid"];
  const datetime = req.headers["datetime"];
  if (!atmid || !datetime) {
      return res.status(400).json({ error: "Missing atmid or datetime" });
  }
  let url = apiUrl + "/txnlist/"+parseInt(atmid)+"/"+parseInt(datetime)+"/v1";
  let settings = {method: "Get"}
  fetch(url, settings)
    .then(response  => response.json())
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;