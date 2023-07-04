import { promisify } from "util";
import { pipeline } from "stream";
import fs from "fs";
import csv from "csvtojson";

const pump = promisify(pipeline);

const rFileUpload = {
  method: "POST",
  url: "/file-upload",
  handler: async function (request, reply) {
    try {
      const db = request.db;
      await db.read();
      if (!db.data.authors) {
        db.data.authors = [];
      }
      const data = await request.file();
      const filePath = "uploads/" + data.filename;
      await pump(data.file, fs.createWriteStream(filePath));
      const readstream = fs.createReadStream(filePath);
      await csv({ delimiter: ";" })
        .fromStream(readstream)
        .subscribe((json) => {
          db.data.authors.push(json);
        });
      await db.write();
      await fs.unlink(filePath, () => {});
      reply.send();
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const routes = [rFileUpload];
export default routes;
