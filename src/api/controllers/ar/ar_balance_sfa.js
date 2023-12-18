import moment from "moment";
const truncateDataBalanceSfa = async (data, table, pool) => {
  try {
    const formattedData = data.map((row) => ({
      szDocId: row.TRANSACTION_NUMBER,
      dtmDate: row.TRANSACTION_DATE,
      szInvoiceId: row.SO_NUMBER,
      szKontraBon: "",
      szCustomerId: row.CUSTOMER_NUMBER,
      decAmount: row.ORIGINAL_AMOUNT,
      decRemain: row.OUTSTANDING_AMOUNT,
      bClosed: 0,
      dtmInvoice: row.TRANSACTION_DATE,
      dtmDue: row.DUE_DATE,
      bCollection: row.CLOSED_STATUS,
      szReasonId: "",
      dtmCollectPlan: row.TRANSACTION_DATE,
      szEmployeeId: "",
      szType: row.TRANSACTION_TYPE,
      szBranchId: row.BUSINESS_UNIT,
      szUserCreatedId: "oracle",
      szUserUpdatedId: "oracle",
      dtmCreated: moment().format("YYYY-MM-DD HH:mm:ss"),
      dtmLastUpdated: moment().format("YYYY-MM-DD HH:mm:ss"),
      decGiroMundur: row.NILAI_GIRO_MUNDUR,
    }));
    console.log(formattedData, "formattedData");
    const sqlQuery = `
        INSERT INTO ${table} (szDocId, dtmDate, szInvoiceId, szKontraBon, szCustomerId, decAmount, decRemain, bClosed, dtmInvoice, dtmDue, bCollection, szReasonId, dtmCollectPlan, szEmployeeId, szType, szBranchId, szUserCreatedId, szUserUpdatedId, dtmCreated, dtmLastUpdated, decGiroMundur)
        VALUES ${formattedData
          .map(
            (row) =>
              `(${Object.values(row)
                .map((value) => (value !== null ? `'${value}'` : "NULL"))
                .join(", ")})`
          )
          .join(",\n")};
      `;

    const result = await pool.request().query(sqlQuery);

    console.log("Data inserted successfully:", result);
  } catch (err) {
    console.error("Error inserting data into SQL Server", err);
    throw err;
  }
};

export { truncateDataBalanceSfa };
