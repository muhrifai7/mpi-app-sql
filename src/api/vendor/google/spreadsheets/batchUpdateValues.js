import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

export const batchUpdateValues = async (
  spreadsheetId,
  service,
  range,
  valueInputOption,
  _values
) => {
  let values = [
    [4, 24],
    [345, 82],
  ];
  values = _values;
  const data = [
    {
      range,
      values,
    },
  ];
  const resource = {
    data,
    valueInputOption,
  };
  try {
    const result = service.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource,
    });
    console.log("%d cells updated.", result.data);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log("err", err);
    throw err;
  }
};
