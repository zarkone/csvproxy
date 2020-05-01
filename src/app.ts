import express, { Request, Response } from "express";
import { Csv, ICsv } from "./csv";

// Our Express APP config
const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);

// API Endpoints
app.get("/csv/:id", (req: Request, res: Response) => {
  let csvModel = Csv.findById(req.params.id, (err, csvRes: ICsv) => {
    res.send(csvRes);
  });
});

app.post("/csv", (req: Request, res: Response) => {
  let csv = req.body.csv;
  let json = "{}";
  let csvModel = new Csv({ csv, json });

  csvModel.save();

  res.send({ id: csvModel._id });
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});
