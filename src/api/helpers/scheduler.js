// const directory = "/src/fonts";
import fs from "node:fs/promises";
import path from "path";
import schedule from "node-schedule";
import { getPoolToSqlServer, getPoolToSimpi } from "../../config/db.js";

const root_folder = process.env.SOURCE_FILE;
const processedpath = process.env.PROCCESSED_FILE;
const success_folder = `${root_folder}/${processedpath}`;

const ext = ["csv"];

// function ini jalan setiap jam 1 pagi, untuk mengapus file dengan masa 1 hari
// const removeOldFile = schedule.scheduleJob("*/1 * * * *", async () => {
//   const second = 60 * 60 * 30;
//   const currentTime = Math.floor(new Date().getTime() / 1000);
//   const files = Array.from(await fs.readdir(success_folder)).filter((file) => {
//     return ext.indexOf(file.split(".").at(-1)) !== -1;
//   });
//   for (const file of files) {
//     const filePath = path.join(success_folder, file);
//     const stats = await fs.stat(filePath); // age of file
//     const birthTime = Math.floor(stats.ctimeMs / 1000);
//     if (currentTime - birthTime > second) {
//       console.log(`Remove ${filePath} file success!`);
//       fs.rm(filePath);
//     }
//   }
//   console.log(`This runs at 00:00AM every day, Clean data on ${processedpath}`);
// });

// schedule.scheduleJob("*/1 * * * *", async () => {
//   const resRayon = await importDataRayonToSimpi();
//   console.log(resRayon, "resRayon");
// });

// Insert to table rayon Db ke simpe_test
const importDataRayonToSimpi = async () => {
  const poolToSimpi = await getPoolToSimpi();
  const getPoolToSqlServer = await getPoolToSqlServer();
  console.log(getPoolToSqlServer, "getPoolToSqlServer");
  // select data rayon from sql
  const query = `SELECT a.szId AS kode_rayon
                  ,a.szName AS nama_rayon
                  ,a.szEmployeeId AS kode_sales
                  ,c.szName AS nama_sales
                  ,b.szCustomerId AS kode_customer
                  ,d.szName AS nama_customer
                FROM DMS_SD_Route a
                INNER JOIN DMS_SD_RouteItem b ON a.szId = b.szId
                LEFT JOIN DMS_PI_Employee c ON a.szEmployeeId = c.szId
                LEFT JOIN DMS_AR_Customer d ON b.szCustomerId = d.szId
                ORDER BY a.szId`;

  try {
    const rayonSqlResult = await getPoolToSqlServer.query(query);
    const data = rayonSqlResult[0];
    console.log(data, "data");
    const values = data.map((data) => [
      data.kode_rayon,
      data.nama_rayon,
      data.kode_sales,
      data.nama_sales,
      data.kode_customer,
      data.nama_customer,
    ]);
    // query insert only
    const insertQuery = `
    INSERT INTO rayon (kode_rayon, nama_rayon, kode_sales,nama_sales,kode_customer,nama_customer)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      kode_rayon = VALUES(kode_rayon),
      nama_rayon = VALUES(nama_rayon),
      kode_sales = VALUES(kode_sales),
      nama_sales = VALUES(nama_sales),
      kode_customer = VALUES(kode_customer),
      nama_customer = VALUES(nama_customer);
  `;

    const execQuery = await poolToSimpi.query(insertQuery, [values]);
    console.log("row(s) affected.", execQuery[0]?.affectedRows);
    console.log("info =>", execQuery[0]?.info);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

console.log(await importDataRayonToSimpi());
