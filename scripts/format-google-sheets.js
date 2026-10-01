import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import { getGoogleSheetsClient, GOOGLE_SHEETS_HEADERS } from "../lib/googleSheets.js";

async function formatSheet() {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = (process.env.GOOGLE_SHEETS_TAB_NAME || "Applications").trim();

  console.log("Formatting sheet:", tabName, "in spreadsheet:", spreadsheetId);

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const targetSheet = meta.data.sheets?.find(
    (s) => s.properties?.title?.toLowerCase() === tabName.toLowerCase()
  );
  if (!targetSheet) {
    throw new Error(`Tab ${tabName} not found in spreadsheet`);
  }

  const sheetId = targetSheet.properties.sheetId;
  const requests = [];

  // 1. Remove Google Sheets Tables if present
  if (targetSheet.tables && targetSheet.tables.length > 0) {
    for (const table of targetSheet.tables) {
      requests.push({
        deleteTable: {
          tableId: table.tableId,
        },
      });
    }
  }

  // 2. Clear any existing basicFilter
  if (targetSheet.basicFilter) {
    requests.push({
      clearBasicFilter: {
        sheetId,
      },
    });
  }

  // 3. Clear existing banded ranges
  if (targetSheet.bandedRanges && targetSheet.bandedRanges.length > 0) {
    for (const b of targetSheet.bandedRanges) {
      requests.push({
        deleteBanding: {
          bandedRangeId: b.bandedRangeId,
        },
      });
    }
  }

  // 4. Clear all data validation rules across A:R (no people chips, dropdowns)
  requests.push({
    setDataValidation: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 2000,
        startColumnIndex: 0,
        endColumnIndex: 18,
      },
      rule: null,
    },
  });

  // 5. Freeze top 2 rows (Title banner + Column headers)
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId,
        gridProperties: {
          frozenRowCount: 2,
        },
      },
      fields: "gridProperties.frozenRowCount",
    },
  });

  // 6. Merge A1:R1 for Title Banner (check if already merged)
  const isAlreadyMerged = targetSheet.merges?.some(
    (m) =>
      m.startRowIndex === 0 &&
      m.endRowIndex === 1 &&
      m.startColumnIndex === 0 &&
      m.endColumnIndex === 18
  );
  if (!isAlreadyMerged) {
    requests.push({
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 18,
        },
        mergeType: "MERGE_ALL",
      },
    });
  }

  // 7. Row heights: Row 1 = 44px, Row 2 = 36px
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: "ROWS",
        startIndex: 0,
        endIndex: 1,
      },
      properties: {
        pixelSize: 44,
      },
      fields: "pixelSize",
    },
  });
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: "ROWS",
        startIndex: 1,
        endIndex: 2,
      },
      properties: {
        pixelSize: 36,
      },
      fields: "pixelSize",
    },
  });

  // 8. Explicit column widths
  const COLUMN_WIDTHS = [
    { index: 0, width: 90 },   // A: Application ID
    { index: 1, width: 155 },  // B: Submitted At
    { index: 2, width: 125 },  // C: Application Type
    { index: 3, width: 190 },  // D: Position Applied For
    { index: 4, width: 170 },  // E: Team / Department
    { index: 5, width: 120 },  // F: First Name
    { index: 6, width: 120 },  // G: Last Name
    { index: 7, width: 260 },  // H: Email
    { index: 8, width: 150 },  // I: Phone
    { index: 9, width: 180 },  // J: Job Title
    { index: 10, width: 120 }, // K: Experience
    { index: 11, width: 220 }, // L: LinkedIn
    { index: 12, width: 220 }, // M: Portfolio
    { index: 13, width: 220 }, // N: Opportunity
    { index: 14, width: 300 }, // O: About
    { index: 15, width: 320 }, // P: Cover Letter
    { index: 16, width: 220 }, // Q: Resume
    { index: 17, width: 100 }, // R: Status
  ];

  for (const col of COLUMN_WIDTHS) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: "COLUMNS",
          startIndex: col.index,
          endIndex: col.index + 1,
        },
        properties: {
          pixelSize: col.width,
        },
        fields: "pixelSize",
      },
    });
  }

  // 9. Format Row 1: Title Banner
  // Deep Forest Green #1D4B3C
  const bannerText = "GharPadharo Career Applications   •   Applications received through the Career Portal   •   DEVELOPMENT";
  requests.push({
    updateCells: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: 0,
        endColumnIndex: 1,
      },
      rows: [
        {
          values: [
            {
              userEnteredValue: {
                stringValue: bannerText,
              },
              userEnteredFormat: {
                backgroundColorStyle: {
                  rgbColor: { red: 0.113725, green: 0.294118, blue: 0.235294 }, // #1D4B3C
                },
                verticalAlignment: "MIDDLE",
                horizontalAlignment: "LEFT",
                padding: {
                  left: 14,
                },
              },
              textFormatRuns: [
                {
                  startIndex: 0,
                  format: {
                    fontSize: 11,
                    bold: true,
                    foregroundColorStyle: {
                      rgbColor: { red: 1, green: 1, blue: 1 },
                    },
                  },
                },
                {
                  startIndex: 31,
                  format: {
                    fontSize: 10,
                    bold: false,
                    foregroundColorStyle: {
                      rgbColor: { red: 0.917647, green: 0.956863, blue: 0.933333 }, // #EAF4EE
                    },
                  },
                },
                {
                  startIndex: 86,
                  format: {
                    fontSize: 10,
                    bold: true,
                    foregroundColorStyle: {
                      rgbColor: { red: 0.956863, green: 0.650980, blue: 0.164706 }, // #F4A62A Accent Orange
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      fields: "userEnteredValue,userEnteredFormat(backgroundColorStyle,verticalAlignment,horizontalAlignment,padding),textFormatRuns",
    },
  });

  // Background styling for the rest of Row 1 merged cells
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: 1,
        endColumnIndex: 18,
      },
      cell: {
        userEnteredFormat: {
          backgroundColorStyle: {
            rgbColor: { red: 0.113725, green: 0.294118, blue: 0.235294 },
          },
        },
      },
      fields: "userEnteredFormat.backgroundColorStyle",
    },
  });

  // 10. Format Row 2: Table Column Headers
  // Background: Primary Dark Green #245C4A
  const headerValues = GOOGLE_SHEETS_HEADERS.map((h, idx) => {
    const isCenter = [0, 1, 2, 17].includes(idx);
    return {
      userEnteredValue: {
        stringValue: h,
      },
      userEnteredFormat: {
        backgroundColorStyle: {
          rgbColor: { red: 0.141176, green: 0.360784, blue: 0.290196 }, // #245C4A
        },
        textFormat: {
          bold: true,
          fontSize: 10,
          foregroundColorStyle: {
            rgbColor: { red: 1, green: 1, blue: 1 },
          },
        },
        verticalAlignment: "MIDDLE",
        horizontalAlignment: isCenter ? "CENTER" : "LEFT",
      },
    };
  });

  requests.push({
    updateCells: {
      range: {
        sheetId,
        startRowIndex: 1,
        endRowIndex: 2,
        startColumnIndex: 0,
        endColumnIndex: 18,
      },
      rows: [
        {
          values: headerValues,
        },
      ],
      fields: "userEnteredValue,userEnteredFormat(backgroundColorStyle,textFormat,verticalAlignment,horizontalAlignment)",
    },
  });

  // 11. Add alternating row colors (banded range) starting from Row 2
  requests.push({
    addBanding: {
      bandedRange: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2000,
          startColumnIndex: 0,
          endColumnIndex: 18,
        },
        rowProperties: {
          headerColorStyle: {
            rgbColor: { red: 0.141176, green: 0.360784, blue: 0.290196 }, // #245C4A
          },
          firstBandColorStyle: {
            rgbColor: { red: 1, green: 1, blue: 1 }, // #FFFFFF
          },
          secondBandColorStyle: {
            rgbColor: { red: 0.968627, green: 0.980392, blue: 0.972549 }, // #F7FAF8
          },
        },
      },
    },
  });

  // 12. Add Native Filter on Row 2
  requests.push({
    setBasicFilter: {
      filter: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2000,
          startColumnIndex: 0,
          endColumnIndex: 18,
        },
      },
    },
  });

  // 13. Default format for data rows (Row 3 onwards: Row 2 to 2000 in 0-based indexing)
  // All text: regular font (bold: false), font size 10, text color #17231D
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 2,
        endRowIndex: 2000,
        startColumnIndex: 0,
        endColumnIndex: 18,
      },
      cell: {
        userEnteredFormat: {
          textFormat: {
            bold: false,
            fontSize: 10,
            foregroundColorStyle: {
              rgbColor: { red: 0.090196, green: 0.137255, blue: 0.113725 }, // #17231D
            },
          },
          verticalAlignment: "MIDDLE",
          horizontalAlignment: "LEFT",
        },
      },
      fields: "userEnteredFormat(textFormat.bold,textFormat.fontSize,textFormat.foregroundColorStyle,verticalAlignment,horizontalAlignment)",
    },
  });

  // Center alignment & numeric format for Column A (Application ID)
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 2,
        endRowIndex: 2000,
        startColumnIndex: 0,
        endColumnIndex: 1,
      },
      cell: {
        userEnteredFormat: {
          horizontalAlignment: "CENTER",
          numberFormat: {
            type: "NUMBER",
            pattern: "0",
          },
        },
      },
      fields: "userEnteredFormat(horizontalAlignment,numberFormat)",
    },
  });

  // Center alignment for Column B (Submitted At), Column C (Application Type), Column R (Status)
  for (const cIdx of [1, 2, 17]) {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 2,
          endRowIndex: 2000,
          startColumnIndex: cIdx,
          endColumnIndex: cIdx + 1,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat.horizontalAlignment",
      },
    });
  }

  // Text wrap for Column N (Opportunity), Column O (About), Column P (Cover Letter)
  for (const cIdx of [13, 14, 15]) {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 2,
          endRowIndex: 2000,
          startColumnIndex: cIdx,
          endColumnIndex: cIdx + 1,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat.wrapStrategy",
      },
    });
  }

  console.log(`Sending batchUpdate with ${requests.length} requests...`);
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests,
    },
  });

  console.log("✅ Successfully formatted sheet! Updated replies:", res.data.replies?.length);
}

formatSheet().catch((err) => {
  console.error("Format failed:", err);
  process.exit(1);
});
