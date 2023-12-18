import dotenv from "dotenv";
dotenv.config();
import mssql from "mssql";
import mysql from "mysql2/promise";

let poolToWebDiskon = null;
let poolToSimpi = null;
let poolToSimpiTest = null;
let poolToSqlServer = null;

export async function getPoolToWebDiskon() {
  if (!poolToWebDiskon) {
    try {
      poolToWebDiskon = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_diskon_modifier_test",
        connectionLimit: 10, // Adjust the limit as per your requirements
      });
      console.log("Connected to WebDiskon database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToWebDiskon;
}

export async function getPoolToSimpi() {
  if (!poolToSimpi) {
    try {
      poolToSimpi = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_simpi",
        connectionLimit: 10, // Adjust the limit as per your requirements
        port: 3306,
      });
      console.log("Connected to Simpi database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToSimpi;
}

export async function getPoolToSimpiTest() {
  if (!poolToSimpiTest) {
    try {
      poolToSimpi = mysql.createPool({
        host: "202.157.186.47",
        user: "mpiapps_technical",
        password: "Technical123",
        database: "mpiapps_simpi_test",
        connectionLimit: 10, // Adjust the limit as per your requirements
        port: 3306,
      });
      console.log("Connected to Simpi database!");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  return poolToSimpi;
}

export const configSqlServerLocal = {
  user: process.env.SQL_DB_USER || "sa",
  password: process.env.SQL_DB_PASS || "P@ssw0rd",
  server: process.env.DB_SERVER || "sql-server",
  database: process.env.DB_DATABASE || "master",
  options: {
    trustServerCertificate: true,
  },
};

export const configSqlServer = {
  user: "sa",
  password: "P@ssw0rd.1",
  server: "172.16.1.22",
  database: "MPI_PROD_NEW", // Replace with the actual name of your database
  options: {
    trustServerCertificate: true, // For development purposes only. Set to true for self-signed certificates in development environment.
  },
};
