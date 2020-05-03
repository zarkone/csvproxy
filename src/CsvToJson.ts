import axios, { AxiosResponse } from "axios";

import { parse } from "@fast-csv/parse";
import { Stream, Writable } from "stream";
import { Result, Ok, Err, err, ok } from "neverthrow";
import { CsvRecord } from "./CsvRecord";
import { text } from "express";

type DecodeErr = string;

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
      console.log("debug1", chunk);
      data.push(chunk);
    });
    readable.on("end", function () {
      console.log("end!");
      resolve(ok(data));
    });

    readable.on("error", function (error) {
      reject(error);
    });
  });
}

export default async function csvToJson(
  csvMaybeUrl: string
): Promise<Result<{ json: CsvRecord[]; csv: string }, DecodeErr>> {
  const toJsonStream = parse({ headers: true });

  let csv: string;

  if (isUrl(csvMaybeUrl)) {
    let { data } = await axios.get(csvMaybeUrl);
    csv = data;
    toJsonStream.write(data);
    toJsonStream.end();
  } else {
    csv = csvMaybeUrl;
    toJsonStream.write(csvMaybeUrl);
    toJsonStream.end();
  }

  const json = await readableToString<CsvRecord>(toJsonStream);
  console.log("debug2", json);
  return new Promise((resolve, reject) => {
    if (json.isOk()) {
      resolve(
        new Ok({
          json: json.value,
          csv,
        })
      );
    } else {
      reject(new Err("Decode error"));
    }
  });
}
