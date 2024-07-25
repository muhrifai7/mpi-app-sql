import fetch from "node-fetch";

const GOOGLE_SHEETS_API = "https://sheets.googleapis.com/";
const makeHttpRequestOauth2 = async (
  url,
  method,
  headers,
  body = null,
  valueInputOption
) => {
  try {
    const apiUrl = new URL(GOOGLE_SHEETS_API + url);
    apiUrl.searchParams.append("valueInputOption", valueInputOption);
    const response = await fetch(apiUrl.href, {
      method: method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
      redirect: "follow",
    });
    if (!response.ok) {
      return {
        status: false,
        statusCode: response.status,
        message: response.statusText,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    throw error;
  }
};

export { makeHttpRequestOauth2 };
