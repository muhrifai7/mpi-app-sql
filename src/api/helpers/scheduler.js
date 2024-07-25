import schedule from "node-schedule";
import mssql from "mssql";
import { configSqlServer, getPoolToSimpi } from "../../config/db.js";

// Insert to table rayon Db ke simpe_test
const importDataRayonToSimpi = async () => {
  const batchSize = 1000;
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
                WHERE a.szRouteType IN('TKO', 'TOCOL')
                ORDER BY a.szId;
                `;

  const poolToSimpi = await getPoolToSimpi();
  try {
    const result = await mssql.query(query);

    const data = result.recordset;
    if (data.length > 0) {
      await poolToSimpi.query("START TRANSACTION");
      const truncateQuery = `TRUNCATE TABLE rayon`;
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

// Insert to table pricelist Db ke simpe_test
const importDataPriceListToSimpi = async () => {
  const batchSize = 1000;
  await mssql.connect(configSqlServer);
  // select data rayon from sql
  const query = `SELECT a.iInternalId AS iInternalId
                    ,a.iId AS iIdA
                    ,a.szId AS szIdA
                    ,a.szName
                    ,a.szDescription
                    ,a.szCombinationId AS szCombinationIdA
                    ,a.szCompanyId
                    ,a.dtmValidFrom
                    ,a.dtmValidTo
                    ,a.intPriority
                    ,a.bActive
                    ,a.szUserCreatedId
                    ,a.szUserUpdatedId
                    ,a.dtmCreated
                    ,a.dtmLastUpdated
                    ,a.szStatusSubmitFusion
                    ,b.iInternalId AS iInternalIdB
                    ,b.iId AS iIdB
                    ,b.szId AS szIdB
                    ,b.intItemNumber AS intItemNumberB
                    ,b.szCombinationId AS szCombinationIdB
                    ,b.szCombinationValue
                    ,b.szCombinationValueNm
                    ,c.iInternalId AS iInternalIdC
                    ,c.iId AS iIdC
                    ,c.szId AS szIdC
                    ,c.intItemNumber AS intItemNumberC
                    ,c.intItemNumber2
                    ,c.szProductId
                    ,c.decMinQty
                    ,c.bIncludeTax
                    ,c.decPrice
                    ,c.szUomId
                    ,c.intLine
                    ,c.dtmStartDate
                    ,c.dtmEndDate
                    ,c.szPriceListId
                    ,c.szPriceListItemId
                    ,c.szPriceListChargeId
                  FROM dms_sd_pricecatalog a
                  INNER JOIN DMS_SD_PriceCatalogItemCombinationValue b ON a.szid = b.szid
                  INNER JOIN DMS_SD_PriceCatalogItemCombinationValueItem c ON b.szid = c.szid
                  WHERE c.dtmStartDate <= GETDATE()
                    AND c.dtmEndDate >= GETDATE()
                `;

  const poolToSimpi = await getPoolToSimpi();
  try {
    const result = await mssql.query(query);
    const data = result.recordset;
    console.log(data, "data");
    if (data.length > 0) {
      await poolToSimpi.query("START TRANSACTION");
      const truncateQuery = `TRUNCATE TABLE price_list`;
      await poolToSimpi.query(truncateQuery);
      const chunks = [];
      for (let i = 0; i < data.length; i += batchSize) {
        chunks.push(data.slice(i, i + batchSize));
      }

      for (const chunk of chunks) {
        const values = chunk.map((data) => [
          data?.iInternalId,
          data?.iIdA,
          data?.szIdA,
          data?.szName,
          data?.szDescription,
          data?.szCombinationIdA,
          data?.szCompanyId,
          data?.dtmValidFrom,
          data?.dtmValidTo,
          data?.intPriority,
          data?.bActive,
          data?.szUserCreatedId,
          data?.szUserUpdatedId,
          data?.dtmCreated,
          data?.dtmLastUpdated,
          data?.szStatusSubmitFusion,
          data?.iInternalIdB,
          data?.iIdB,
          data?.szIdB,
          data?.intItemNumberB,
          data?.szCombinationIdB,
          data?.szCombinationValue,
          data?.szCombinationValueNm,
          data?.iInternalIdC,
          data?.iIdC,
          data?.szIdC,
          data?.intItemNumberC,
          data?.intItemNumber2,
          data?.szProductId,
          data?.decMinQty,
          data?.bIncludeTax,
          data?.decPrice,
          data?.szUomId,
          data?.intLine,
          data?.dtmStartDate,
          data?.dtmEndDate,
          data?.szPriceListId,
          data?.szPriceListItemId,
          data?.szPriceListChargeId,
        ]);

        // query insert only
        const insertQuery = `
        INSERT INTO price_list (
          iInternalId
          ,iId
          ,szId
          ,szName
          ,szDescription
          ,szCombinationId
          ,szCompanyId
          ,dtmValidFrom
          ,dtmValidTo
          ,intPriority
          ,bActive
          ,szUserCreatedId
          ,szUserUpdatedId
          ,dtmCreated
          ,dtmLastUpdated
          ,szStatusSubmitFusion
          ,iInternalId_1
          ,iId_1
          ,szId_1
          ,intItemNumber
          ,szCombinationId_1
          ,szCombinationValue
          ,szCombinationValueNm
          ,iInternalId_2
          ,iId_2
          ,szId_2
          ,intItemNumber_1
          ,intItemNumber2
          ,szProductId
          ,decMinQty
          ,bIncludeTax
          ,decPrice
          ,szUomId
          ,intLine
          ,dtmStartDate
          ,dtmEndDate
          ,szPriceListId
          ,szPriceListItemId
          ,szPriceListChargeId
          )
          VALUES ?
          ON DUPLICATE KEY UPDATE
          iInternalId = VALUES(iInternalId),
          iId = VALUES(iId)
          ,szId = VALUES(szId)
          ,szName = VALUES(szName)
          ,szDescription = VALUES(szDescription)
          ,szCombinationId = VALUES(szCombinationId)
          ,szCompanyId = VALUES(szCompanyId)
          ,dtmValidFrom = VALUES(dtmValidFrom)
          ,dtmValidTo = VALUES(dtmValidTo)
          ,intPriority = VALUES(intPriority)
          ,bActive = VALUES(bActive)
          ,szUserCreatedId = VALUES(szUserCreatedId)
          ,szUserUpdatedId = VALUES(szUserUpdatedId)
          ,dtmCreated = VALUES(dtmCreated)
          ,dtmLastUpdated = VALUES(dtmLastUpdated)
          ,szStatusSubmitFusion = VALUES(szStatusSubmitFusion)
          ,iInternalId_1 = VALUES(iInternalId_1)
          ,iId_1 = VALUES(iId_1)
          ,szId_1 = VALUES(szId_1)
          ,intItemNumber = VALUES(intItemNumber)
          ,szCombinationId_1 = VALUES(szCombinationId_1)
          ,szCombinationValue = VALUES(szCombinationValue)
          ,szCombinationValueNm = VALUES(szCombinationValueNm)
          ,iInternalId_2 = VALUES(iInternalId_2)
          ,iId_2 = VALUES(iId_2)
          ,szId_2 = VALUES(szId_2)
          ,intItemNumber_1 = VALUES(intItemNumber_1)
          ,intItemNumber2 = VALUES(intItemNumber2)
          ,szProductId = VALUES(szProductId)
          ,decMinQty = VALUES(decMinQty)
          ,bIncludeTax = VALUES(bIncludeTax)
          ,decPrice = VALUES(decPrice)
          ,szUomId = VALUES(szUomId)
          ,intLine = VALUES(intLine)
          ,dtmStartDate = VALUES(dtmStartDate)
          ,dtmEndDate = VALUES(dtmEndDate)
          ,szPriceListId = VALUES(szPriceListId)
          ,szPriceListItemId = VALUES(szPriceListItemId)
          ,szPriceListChargeId = VALUES(szPriceListChargeId)
          `;
        const execQuery = await poolToSimpi.query(insertQuery, [values]);
        console.log(
          "Batch inserted. Row(s) affected:",
          execQuery[0]?.affectedRows
        );
      }

      console.log("All batches price list inserted successfully.");
      await poolToSimpi.query("COMMIT");
    }
  } catch (error) {
    await poolToSimpi.query("ROLLBACK");
    console.error("Error executing query:", error);
  }
};

schedule.scheduleJob("* 3 * * *", async () => {
  console.log("schedule run every day at 3 am start");
  const resRayon = await importDataRayonToSimpi();
  const resPriceList = await importDataPriceListToSimpi();
  console.log(resRayon, "resRayon", resPriceList);
});
