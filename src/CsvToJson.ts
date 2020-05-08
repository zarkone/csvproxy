import axios, { AxiosResponse } from "axios";

import { parse } from "@fast-csv/parse";
import { Stream, Writable } from "stream";
import { Result, Ok, Err, err, ok } from "neverthrow";
import { CsvRecord } from "./CsvRecord";
import { text } from "express";

type DecodeErr = string;
type NoValueErr = string;

function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

function readableToString<T>(
  readable: Stream
): Promise<Result<T[], DecodeErr>> {
  return new Promise((resolve, reject) => {
    let data: T[] = [];
    readable.on("data", function (chunk) {
      data.push(chunk);
    });
    readable.on("end", function () {
      resolve(ok(data));
    });

    readable.on("error", function (error) {
      reject(error);
    });
  });
}

export default async function csvToJson(params: {
  url?: string | null;
  csv?: string | null;
}): Promise<
  Result<{ json: CsvRecord[]; csv: string }, DecodeErr | NoValueErr>
> {
  const { url, csv } = params;
  const toJsonStream = parse({ headers: true });
  let resultCsv: string;

  if (url) {
    let { data } = await axios.get(url);
    resultCsv = data;
  } else if (csv) {
    resultCsv = csv;
  } else {
    return new Promise((resolve, reject) => {
      resolve(new Err("No csv  url provided"));
    });
  }

  toJsonStream.write(resultCsv);
  toJsonStream.end();

  const json = await readableToString<CsvRecord>(toJsonStream);

  return new Promise((resolve, reject) => {
    if (json.isOk()) {
      resolve(
        new Ok({
          json: json.value,
          csv: resultCsv,
        })
      );
    } else {
      reject(new Err("Decode error"));
    }
  });
}
