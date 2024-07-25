import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

/**
 * Helper functions for Google Sheets
 * spreadshet doc
 * https://docs.google.com/spreadsheets/d/1xc0tkt1ww6rjQdEwe_coAIXVJIH0S_gUQj0D_FBvav4/edit?hl=id#gid=0
 */
class HelpersSheet {
  constructor() {
    const auth = new GoogleAuth({
      keyFilename: "src/service-account-keys/keyfile.json",
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    this.sheetsService = google.sheets({ version: "v4", auth });
    this.driveService = google.drive({ version: "v3", auth });
    this.filesToDelete = [];
  }

  reset() {
    this.filesToDelete = [];
  }

  /**
   * Adds the Drive file ID for deletion on cleanup.
   * @param {string} id The Drive file ID.
   */
  deleteFileOnCleanup(id) {
    this.filesToDelete.push(id);
  }

  /**
   * Cleans up the test suite.
   * @return {Promise} returns list of deletion promises
   */
  cleanup() {
    return Promise.all(
      this.filesToDelete.map((fileId) =>
        this.driveService.files.delete({ fileId })
      )
    );
  }

  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  async createTestSpreadsheet() {
    const res = await this.sheetsService.spreadsheets.create({
      resource: {
        properties: {
          title: "Test Spreadsheet",
        },
      },
      fields: "spreadsheetId",
    });
    this.deleteFileOnCleanup(res.data.spreadsheetId);
    return res.data.spreadsheetId;
  }

  /**
   * Adds a string to a 11x11 grid of Spreadsheet cells.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @return {Promise} A promise to return the Google API service.
   */
  async populateValues(spreadsheetId) {
    await this.sheetsService.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 10,
                startColumnIndex: 0,
                endColumnIndex: 10,
              },
              cell: {
                userEnteredValue: {
                  stringValue: "Hello",
                },
              },
              fields: "userEnteredValue",
            },
          },
        ],
      },
    });
    return spreadsheetId;
  }
}

export default HelpersSheet;
