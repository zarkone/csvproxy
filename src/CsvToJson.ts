import axios, { AxiosResponse } from "axios";
import { parse } from "@fast-csv/parse";
import { Stream, Writable } from "stream";

function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}
function readableToString(readable: Stream): Promise<Array<Object>> {
  return new Promise((resolve, reject) => {
    let data: Array<Object> = [];
    readable.on("data", function (chunk) {
      data.push(chunk);
    });
    readable.on("end", function () {
      resolve(data);
    });
    readable.on("error", function (err) {
      reject(err);
    });
  });
}

export default async function csvToJson(csv: string): Promise<Object> {
  const csvStream = parse({ headers: true });

  if (isUrl(csv)) {
    axios
      .get(csv, { responseType: "stream" })
      .then((r: AxiosResponse<Stream>) => {
        r.data.pipe(csvStream);
      });
  } else {
    csvStream.write(csv);
  }

  return readableToString(csvStream);
}
