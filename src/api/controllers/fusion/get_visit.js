import schedule from "node-schedule";
import mssql from "mssql";
import { configSqlServer, getPoolToSimpi } from "../../../config/db.js";

// Insert to table rayon Db ke simpe_test
export default async () => {
  const batchSize = 1000;
  await mssql.connect(configSqlServer);
  // select data rayon from sql
  const query = `SELECT * FROM dms_sd_doccall a
                  INNER JOIN dms_sd_doccallitem b
                  ON a.szDocId = b.szDocId;
                `;

  try {
    const result = await mssql.query(query);

    const data = result.recordset;
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
