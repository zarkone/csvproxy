import mongoose, { Schema, Document } from "mongoose";
import { CsvRecord } from "./CsvRecord";

const uri: string = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/local";

mongoose.connect(uri, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Successfully Connected!");
  }
});

export interface ICsv extends Document {
  csv: string;
  json: [CsvRecord];
}

export const CsvSchema = new Schema<ICsv>({
  csv: String,
  json: Schema.Types.Mixed,
});

export const Csv = mongoose.model<ICsv>("Csv", CsvSchema);
