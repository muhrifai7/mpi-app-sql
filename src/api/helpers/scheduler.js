import schedule from "node-schedule";
import mssql from "mssql";
import { configSqlServer, getPoolToSimpi } from "../../config/db.js";

schedule.scheduleJob("0 1 * * *", async () => {
  console.log("schedule run every dat at 1 am start");
  const resRayon = await importDataRayonToSimpi();
  console.log(resRayon, "resRayon");
});

// Insert to table rayon Db ke simpe_test
const importDataRayonToSimpi = async () => {
  const batchSize = 1000;
  const poolToSimpi = await getPoolToSimpi();
  await mssql.connect(configSqlServer);
  // select data rayon from sql
  const query = `SELECT
                  a.szId AS kode_rayon,
                  a.szName AS nama_rayon,
                  a.szEmployeeId AS kode_sales,
                  c.szName AS nama_sales,
                  b.szCustomerId AS kode_customer,
                  d.szName AS nama_customer
                FROM DMS_SD_Route a
                INNER JOIN DMS_SD_RouteItem b ON a.szId = b.szId
                LEFT JOIN DMS_PI_Employee c ON a.szEmployeeId = c.szId
                LEFT JOIN DMS_AR_Customer d ON b.szCustomerId = d.szId
                ORDER BY a.szId;
                `;

  try {
    const result = await mssql.query(query);
    const data = result.recordset;
    if (data.length > 0) {
      await poolToSimpi.query("START TRANSACTION");
      const truncateQuery = `TRUNCATE TABLE RAYON`;
      await poolToSimpi.query(truncateQuery);
      const chunks = [];
      for (let i = 0; i < data.length; i += batchSize) {
        chunks.push(data.slice(i, i + batchSize));
      }

      for (const chunk of chunks) {
        const values = chunk.map((data) => [
          data?.kode_rayon,
          data?.nama_rayon,
          data?.kode_sales,
          data?.nama_sales,
          data?.kode_customer,
          data?.nama_customer,
        ]);

        // query insert only
        const insertQuery = `
          INSERT INTO rayon (kode_rayon, nama_rayon, kode_sales, nama_sales, kode_customer, nama_customer)
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
        console.log(
          "Batch inserted. Row(s) affected:",
          execQuery[0]?.affectedRows
        );
      }

      console.log("All batches inserted successfully.");
      await poolToSimpi.query("COMMIT");
    }
  } catch (error) {
    await poolToSimpi.query("ROLLBACK");
    console.error("Error executing query:", error);
  }
};

(async () => {
  const resRayon = await importDataRayonToSimpi();
  console.log(resRayon, "resRayon");
})();
