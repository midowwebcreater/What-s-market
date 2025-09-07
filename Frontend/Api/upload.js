import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send("Upload failed");
    const oldPath = files.contacts.filepath;
    const newPath = `./contacts.csv`;
    fs.rename(oldPath, newPath, (err) => {
      if (err) return res.status(500).send("Save failed");
      res.send("Contacts uploaded successfully!");
    });
  });
}
