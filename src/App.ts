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
    const parsedParams = req.params.id.match(/(.*)\.(.*)/);
    let id: string, format: string;

    if (parsedParams) {
      id = parsedParams[1];
      format = parsedParams[2];
    } else {
      id = format = "";
    }

    let csvRes = await Csv.findById(id).exec();
    if (csvRes) {
      switch (format) {
        case "json":
          {
            return res.send(csvRes.json);
          }
          break;
        case "csv":
          {
            res.setHeader("Content-Type", "text/csv");
            return res.send(csvRes.csv);
          }
          break;
        default:
          {
            res.status(400).send("Wrong format: " + format);
          }
          break;
      }
    } else {
      return res.status(404).send({ error: "Not found" });
    }
  } catch (e) {
    logger.error(req.url, e.message);
    return res.status(404).send({ error: "Not found" });
  }
});

app.post("/csv", async (req: Request, res: Response) => {
  const { csv, url } = req.body;
  const result = await csvToJson({ csv, url });
  if (result.isOk()) {
    const { csv, json } = result.value;
    const csvModel = new Csv({ csv, json });

    csvModel.save();

    res.status(201).send({ url: "/csv/" + csvModel._id });
  } else {
    res.status(500).send("Internal Error: " + result.error);
  }
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});
