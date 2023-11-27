import mssql from "mssql";
import { configSqlServerLocal } from "../../../config/db.js";

export default async (req,res) => {
  await mssql.connect(configSqlServerLocal);
  // select data rayon from sql
  const query = `SELECT * FROM spt_monitor
                `;

  try {
    const result = await mssql.query(query);

    const data = result.recordset;
    return res.json(200,{
      message : "oke",
      data : result
    })
    return data;
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
