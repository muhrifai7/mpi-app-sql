import fs from "fs";
import readline from "readline";
import mssql from "mssql";
import path from "path";
import chokidar from "chokidar";

import { configSqlServerLocal } from "../../config/db.js";
import { truncateDataBalanceSfa } from "../controllers/ar/ar_balance_sfa.js";
import { deleteAllDataBalanceSfa } from "../controllers/ar/delete_ar.js";
import { parseCSVLine } from "./parseCsvAr.js";

const root_folder = process.env.SOURCE_FILE;
const upload_path = process.env.UPLOAD_PATH;
const processed_path = process.env.PROCCESSED_FILE;
const failed_path = process.env.FAILED_FILE;
const source_folder = path.join(root_folder, upload_path);
const success_folder = path.join(root_folder, processed_path);
const failed_folder = path.join(root_folder, failed_path);

const ROWS_PER_BATCH = 30;
const watcher = chokidar.watch(`${source_folder}`, {
  persistent: true,
  ignoreInitial: false,
});

watcher.on("ready", () => {
  console.log(`Watcher is ready and scanning files on ${source_folder}`);
});

watcher.on("add", async (filePath) => {
  const fileName = path.basename(filePath);
  if (fileName.toUpperCase().indexOf("AR BALANCE_SFA") !== -1) {
    setTimeout(async () => {
      try {
        console.log("Reading balance sfa sales started");
        let rowCount = 0;
        let batchRows = [];

        const readStream = fs.createReadStream(filePath, {
          encoding: "utf8",
          highWaterMark: 256 * 1024, // Set the buffer size to 64 KB (adjust as needed)
        });
        const rl = readline.createInterface({
          input: readStream,
          crlfDelay: Infinity, // To handle CRLF line endings on Windows
        });
        console.log(rl, "rl");

        const table = "Oracle_CustomerAR_Staging";
        const pool = new mssql.ConnectionPool(configSqlServerLocal);
        await pool.connect();
        await deleteAllDataBalanceSfa(table, pool);
        rl.on("line", async (line) => {
          rowCount++;
          const data = parseCSVLine(line);
          batchRows.push(data);
          if (rowCount === ROWS_PER_BATCH) {
            await truncateDataBalanceSfa(batchRows, table, pool);
            batchRows = [];
            rowCount = 0;
          }
        });

        rl.on("close", async () => {
          if (batchRows.length > 0) {
            // await insertBulkData(batchRows, table);
            await truncateDataBalanceSfa(batchRows, table, mssql);
          }
          const newFileName = `${success_folder}/${fileName}`;
          fs.rename(filePath, newFileName, (err) => {
            if (err) {
              console.log(`Error while renaming after insert: ${err.message}`);
            } else {
              console.log(
                `Succeed to process and moved file to: ${newFileName}`
              );
            }
          });
          console.log("close");
        });

        rl.on("error", (err) => {
          console.error("Error while reading the file:", err);
          const newFileName = `${failed_folder}/${fileName}`;
          fs.renameSync(filePath, newFileName, (err) => {
            if (err) {
              console.log(`Error while moving Failed file : ${err.message}`);
            } else {
              console.log(
                `Failed to process and moved file to: ${newFileName}`
              );
            }
          });
        });
      } catch (error) {
        console.log(error, "error'");
        const newFileName = `${failed_folder}/${fileName}`;
        fs.renameSync(filePath, newFileName, (err) => {
          if (err) {
            console.log(`Error while moving Failed file : ${err.message}`);
          } else {
            console.log(`Failed to process and moved file to: ${newFileName}`);
          }
        });
      }
    }, 800);
  }
});
