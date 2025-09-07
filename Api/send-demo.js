import fs from "fs";
import csv from "csv-parser";

export default async function handler(req, res) {
  const { phone } = req.query;
  if (!phone) return res.status(400).send("Phone required");

  let contacts = [];
  if (fs.existsSync("./contacts.csv")) {
    fs.createReadStream("./contacts.csv")
      .pipe(csv())
      .on("data", (row) => contacts.push(row))
      .on("end", () => {
        res.send(`Demo message would be sent to ${phone} and ${contacts.length} CSV contacts.`);
      });
  } else {
    res.send(`Demo message would be sent to ${phone}. No CSV uploaded.`);
  }
}
