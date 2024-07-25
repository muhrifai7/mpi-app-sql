import mssql from "mssql";
import { configSqlServer } from "../../../config/db.js";

export default async (req, res) => {
  await mssql.connect(configSqlServer);
  const { nomor_surat } = req.params;
  const query = `SELECT
                A.szBranchId
                , c.szName as szBranchNm
                , a.szEmployeeId
                , d.szName AS szEmployeeNm
                , a.szCustomerId
                , h.szName as szCustomerNm
                , A.szDocId
                , A.dtmDoc
                , b.szProductId
                , e.szName as szProductNm
                , b.decQty
                , b.szUomId
                , g.szName szUomNm
                , f.decPrice
                , f.decDiscount
                , f.decAmount
                , f.decBruto
                , f.decDisc1
                , f.decDisc1Value
                , f.decDisc2
                , f.decDisc2Value
                , f.decDisc3
                , f.decDisc3Value
                , f.decDisc4
                , f.decDisc4Value
                , f.decDisc5
                , f.decDisc5Value
                , f.decDisc6
                , f.decDisc6Value
                , i.szValue
                , a.bFlagMinimumOrder
                , isnull(j.szPromoId, '') as fdk
                , a.szDocStatus
                , a.dtmCreated
                FROM
                DMS_SD_DocSo as a
                LEFT JOIN DMS_SD_DocSoItem as b on b.szDocId = a.szDocId
                LEFT JOIN DMS_SM_Branch as c on c.szId = a.szBranchId
                LEFT JOIN DMS_PI_Employee as d on d.szId = a.szEmployeeId
                INNER JOIN DMS_INV_Product as e on e.szId = b.szProductId
                LEFT JOIN DMS_SD_DocSoItemPrice as f on f.szDocId = a.szDocId and f.intItemNumber = b.intItemNumber
                LEFT JOIN DMS_INV_Uom as g on g.szId = b.szUomId
                LEFT JOIN DMS_AR_Customer as h on h.szId = a.szCustomerId
                LEFT JOIN DMS_SM_Config as i on i.szConfigScopeValue = a.szBranchId AND i.szConfigId = 'MinimumOrder' AND i.szId = 'DMSDocSo' AND i.szConfigScope = 'BRANCH'
                LEFT JOIN DMS_SD_DocSoItemPromo as j on j.szDocId = b.szDocId AND j.intItemNumber = b.intItemNumber
                WHERE
                A.szBranchId = 'SOL'
                --and A.szDocId = '131324006095'
                and j.szPromoId = ${nomor_surat};
                    `;
  try {
    const result = await mssql.query(query);
    const data = result.recordset;
    return res.json({ status: true, data: data });
  } catch (error) {
    console.error("Error retrieving outlet:", error.message);
  }
};
