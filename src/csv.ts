import mongoose from "mongoose";

const uri: string = "mongodb://127.0.0.1:27017/local";

mongoose.connect(uri, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Successfully Connected!");
  }
});

export interface ICsv extends mongoose.Document {
  csv: string;
  json: string;
}

export const CsvSchema = new mongoose.Schema({
  csv: { type: String, required: true },
  json: { type: String, required: true },
});

export const Csv = mongoose.model<ICsv>("Csv", CsvSchema);
