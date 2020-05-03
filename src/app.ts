import express, { Request, Response } from "express";
import { Csv, ICsv } from "./CsvModel";
import csvToJson from "./CsvToJson";
import { logger } from "./Logger";
import expressPinoLogger from "express-pino-logger";

// Express APP config
const app = express();

app.use(express.json());
app.use(expressPinoLogger({ logger }));
app.set("port", process.env.PORT || 3000);

// API Endpoints
app.get("/csv/:id", async (req: Request, res: Response) => {
  try {
    let csvRes = await Csv.findById(req.params.id).exec();
    if (csvRes) {
      return res.send(csvRes);
    } else {
      return res.status(404).send({ error: "Not found" });
    }
  } catch (e) {
    logger.error(req.url, e.message);
    return res.status(404).send({ error: "Not found" });
  }
});

app.post("/csv", async (req: Request, res: Response) => {
  const csv = req.body.csv;
  const json = await csvToJson(csv);
  const csvModel = new Csv({ csv, json });
  csvModel.save();

  res.status(201).send({ url: "/csv/" + csvModel._id });
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});
