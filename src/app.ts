import express, { Request, Response } from "express";
import { Csv, ICsv } from "./csv";
import { logger } from "./Logger";
import expressPinoLogger from "express-pino-logger";

// Our Express APP config
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
