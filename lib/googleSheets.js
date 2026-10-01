import { google } from "googleapis";

/**
 * Canonical Google Sheet Header Row definition for GharPadharo Career Applications.
 * Exactly 18 columns, in this exact order (A through R):
 * 
 * A  Application ID
 * B  Submitted At
 * C  Application Type
 * D  Position Applied For
 * E  Team / Department
 * F  First Name
 * G  Last Name
 * H  Email
 * I  Phone
 * J  Job Title
 * K  Experience
 * L  LinkedIn
 * M  Portfolio
 * N  Opportunity
 * O  About
 * P  Cover Letter
 * Q  Resume
 * R  Status
 */
export const GOOGLE_SHEETS_HEADERS = [
  "Application ID",
  "Submitted At",
  "Application Type",
  "Position Applied For",
  "Team / Department",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Job Title",
  "Experience",
  "LinkedIn",
  "Portfolio",
  "Opportunity",
  "About",
  "Cover Letter",
  "Resume",
  "Status",
];

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * Checks whether all required Google Sheets integration environment variables are configured.
 * @returns {boolean}
 */
export function isGoogleSheetsConfigured() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();

  return Boolean(spreadsheetId && clientEmail && privateKey);
}

/**
 * Resolves the application base URL for generating external links (e.g. secure resume endpoints).
 * Priority: NEXT_PUBLIC_APP_URL -> NEXTAUTH_URL -> AUTH_URL -> http://localhost:3000
 * @returns {string}
 */
export function getAppBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/**
 * Cleans and formats the PEM private key, resolving escaped newline characters.
 * @param {string} rawKey 
 * @returns {string}
 */
export function normalizePrivateKey(rawKey) {
  if (!rawKey) return "";
  let key = rawKey.trim();
  // Strip surrounding quotes if present in .env
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Replace literal '\n' sequences with real newlines
  return key.replace(/\\n/g, "\n");
}

/**
 * Formats a Date object or timestamp into the human-readable date & time format:
 * DD/MM/YYYY hh:mm AM/PM (e.g., 30/09/2026 03:23 PM)
 * 
 * Rules:
 * - Uses Asia/Kolkata (IST)
 * - Excludes ISO 'T', milliseconds, 'Z', timezone suffixes, or raw JS Date strings
 * - Accurately reflects candidate's MongoDB createdAt submission time
 * 
 * @param {Date|string|number} dateInput 
 * @returns {string}
 */
export function formatSubmittedAt(dateInput) {
  if (!dateInput) return "—";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type) => parts.find((p) => p.type === type)?.value || "";

  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const dayPeriod = getPart("dayPeriod").toUpperCase();

  return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`;
}

/**
 * Initializes and returns an authenticated Google Sheets v4 API client.
 * Uses a Google Cloud Service Account with JWT authorization.
 * 
 * @returns {import("googleapis").sheets_v4.Sheets}
 */
export function getGoogleSheetsClient() {
  if (!isGoogleSheetsConfigured()) {
    throw new Error(
      "Google Sheets credentials are not configured. Please define GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in your server environment."
    );
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Formats an application document into an array of 18 values matching `GOOGLE_SHEETS_HEADERS`.
 * Exactly 18 columns in order A through R.
 * 
 * Key refinements:
 * - Column A (Application ID): Numeric integer from application.applicationNumber (1, 2, 3...)
 * - Column B (Submitted At): Human readable "DD/MM/YYYY hh:mm AM/PM" from createdAt
 * 
 * @param {Object} app - Raw MongoDB Application document or serialized application object
 * @returns {Array<string|number>} Array of 18 cell values
 */
export function formatApplicationForSheet(app) {
  if (!app) return [];

  const isGeneral =
    app.applicationType === "general" ||
    app.jobId === "general" ||
    app.jobSlug === "general-application" ||
    (app.applicationType !== "job" && !app.jobId && !app.jobSlug);

  // Column A: Application ID (Simple sequential integer: 1, 2, 3...)
  const applicationId =
    typeof app.applicationNumber === "number"
      ? app.applicationNumber
      : typeof app.applicationNumber === "string" && !isNaN(Number(app.applicationNumber))
      ? Number(app.applicationNumber)
      : typeof app.id === "number"
      ? app.id
      : "";

  // Column B: Submitted At (Human-readable DD/MM/YYYY hh:mm AM/PM, prefixed with ' to preserve format)
  const appliedAt = app.createdAt || app.appliedAt || new Date();
  const rawSubmittedAt = formatSubmittedAt(appliedAt);
  const submittedAt = rawSubmittedAt !== "—" ? `'${rawSubmittedAt}` : "—";

  // Column C: Application Type ("Job" | "General")
  const applicationType = isGeneral ? "General" : "Job";

  // Column D: Position Applied For ("—" for General, Job title for Job)
  const positionAppliedFor = isGeneral
    ? "—"
    : app.jobTitle?.trim() || app.jobSlug?.trim() || "—";

  // Column E: Team / Department ("—" for General, Job team for Job)
  const teamDepartment = isGeneral
    ? "—"
    : app.jobTeam?.trim() || "—";

  // Column F & G: First Name & Last Name
  let firstName = (app.firstName || "").trim();
  let lastName = (app.lastName || "").trim();
  if (!firstName && app.candidate) {
    const parts = app.candidate.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // Column H: Email
  const email = (app.email || "").toLowerCase().trim();

  // Column I: Phone (prefix with single quote if starts with + to prevent Google Sheets #ERROR! formula parsing)
  let phone = (app.phone || "").trim();
  if (phone) {
    if (phone.startsWith("+") || phone.startsWith("=")) {
      phone = `'${phone}`;
    }
  } else {
    phone = "—";
  }

  // Column J: Job Title (Candidate's current designation)
  const currentJobTitle = (app.currentJobTitle || "").trim() || "—";

  // Column K: Experience
  const experience = (app.experience || "").trim() || "—";

  // Column L: LinkedIn
  const linkedin = (app.linkedin || "").trim() || "—";

  // Column M: Portfolio
  const portfolio = (app.portfolio || "").trim() || "—";

  // Column N: Opportunity (Candidate's general application answer, or "—" for Job)
  const opportunity = isGeneral
    ? (app.opportunityLookingFor || "").trim() || "—"
    : "—";

  // Column O: About (Candidate's general application answer, or "—" for Job)
  const about = isGeneral
    ? (app.aboutYourself || "").trim() || "—"
    : "—";

  // Column P: Cover Letter
  const rawCoverLetter = (app.coverLetter || "").trim();
  const isFallbackCoverLetter =
    isGeneral && rawCoverLetter.toLowerCase() === "general application";
  const coverLetter = rawCoverLetter && !isFallbackCoverLetter ? rawCoverLetter : "—";

  // Column Q: Resume (File name preferred as human-readable value, or "Not submitted")
  const hasResume = Boolean(
    (app.resume && (app.resume.fileName || app.resume.fileUrl || app.resume.publicId)) ||
    (typeof app.resume === "string" &&
      app.resume.trim() &&
      app.resume.trim() !== "—" &&
      app.resume.trim().toLowerCase() !== "not submitted") ||
    (app.resumeMetadata && (app.resumeMetadata.fileName || app.resumeMetadata.fileUrl))
  );

  const resumeFileName = hasResume
    ? (typeof app.resume === "string" ? app.resume.trim() : app.resume?.fileName?.trim()) ||
      app.resumeMetadata?.fileName?.trim() ||
      "Resume.pdf"
    : "Not submitted";

  // Column R: Status ("New" initially)
  const rawStatus = (app.status || "new").toLowerCase();
  const status = rawStatus === "new" ? "New" : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

  return [
    applicationId,      // A (integer number)
    submittedAt,        // B (DD/MM/YYYY hh:mm AM/PM)
    applicationType,    // C
    positionAppliedFor, // D
    teamDepartment,     // E
    firstName,          // F
    lastName,           // G
    email,              // H
    phone,              // I
    currentJobTitle,    // J
    experience,         // K
    linkedin,           // L
    portfolio,          // M
    opportunity,        // N
    about,              // O
    coverLetter,        // P
    resumeFileName,     // Q
    status,             // R
  ];
}

/**
 * Applies professional font and dashboard formatting to the target Google Sheet:
 * - Title Banner (Row 1): Merged A1:R1, Deep Forest Green #1D4B3C, compact height 44px
 * - Table Column Headers (Row 2): Bold white text, Primary Dark Green #245C4A, height 36px
 * - Frozen Rows: Top 2 rows frozen (banner + headers)
 * - Basic Filter: Enabled across columns A through R on Row 2
 * - Column Widths: Optimized widths for recruiter readability
 * - Alternating Rows: Subtle white & light green-tint zebra striping
 * - Data Rows (Row 3+): Normal / Regular font weight (NOT bold), color #17231D, font size 10
 * - Alignments: Centered for ID, Submitted At, Type, Status; Wrapped for long text; Left for details
 * - Column A (Application ID): Numeric format with normal font weight
 * 
 * @param {import("googleapis").sheets_v4.Sheets} sheets 
 * @param {string} spreadsheetId 
 * @param {string} [tabName="Applications"] 
 */
export async function applySheetFormatting(sheets, spreadsheetId, tabName = "Applications") {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const targetSheet = meta.data.sheets?.find(
      (s) => s.properties?.title?.toLowerCase() === tabName.toLowerCase()
    );
    if (!targetSheet) return;

    const sheetId = targetSheet.properties.sheetId;
    const requests = [];

    // 1. Remove any Google Sheets Tables and their automatic column types/data validations
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

    // 3. Clear existing banded ranges before applying fresh branding
    if (targetSheet.bandedRanges && targetSheet.bandedRanges.length > 0) {
      for (const b of targetSheet.bandedRanges) {
        requests.push({
          deleteBanding: {
            bandedRangeId: b.bandedRangeId,
          },
        });
      }
    }

    // 4. Clear all data validation rules across columns A through R (no people chips, dropdowns, etc.)
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

    // 8. Explicit column widths for recruiter readability
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

    // 9. Format Row 1: Title Banner (Deep Forest Green #1D4B3C)
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

    // Background styling for the remainder of merged Row 1
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

    // 10. Format Row 2: Table Column Headers (Primary Dark Green #245C4A)
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

    // 13. Default format for data rows (Row 3 onwards: index 2 to 2000)
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

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    // 14. Ensure existing application rows have clickable resume links in Column Q
    await syncExistingResumeLinks(sheets, spreadsheetId, tabName);
  } catch (fmtError) {
    // Non-fatal: Log styling warning without failing operation
    console.warn("Notice: Sheet font formatting adjustment skipped:", fmtError?.message);
  }
}

/**
 * Updates existing rows in the Google Sheet so Column Q (Resume) has clickable
 * rich-text hyperlinks pointing to /api/admin/applications/[id]/resume.
 * 
 * @param {import("googleapis").sheets_v4.Sheets} sheets 
 * @param {string} spreadsheetId 
 * @param {string} [tabName="Applications"] 
 * @returns {Promise<{ success: boolean, updatedCount?: number, error?: string }>}
 */
export async function syncExistingResumeLinks(sheets, spreadsheetId, tabName = "Applications") {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const targetSheet = meta.data.sheets?.find(
      (s) => s.properties?.title?.toLowerCase() === tabName.toLowerCase()
    );
    if (!targetSheet) return { success: false, error: "Target sheet not found." };

    const sheetId = targetSheet.properties.sheetId;

    const valuesRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A:R`,
    });

    const rows = valuesRes.data.values || [];
    if (rows.length <= 1) return { success: true, updatedCount: 0 };

    const baseUrl = getAppBaseUrl();
    const updateRequests = [];

    // Data rows begin after banner and column headers (row index 2+)
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const appNumber = (row[0] || "").toString().trim();
      // Skip non-numeric rows (such as Title Banner and Column Headers)
      if (!appNumber || isNaN(parseInt(appNumber, 10))) continue;

      const resumeVal = (row[16] || "").toString().trim();

      const hasResume =
        resumeVal &&
        resumeVal !== "—" &&
        resumeVal.toLowerCase() !== "not submitted" &&
        resumeVal.toLowerCase() !== "resume";

      if (hasResume) {
        const resumeUrl = `${baseUrl}/api/admin/applications/${appNumber}/resume`;
        updateRequests.push({
          updateCells: {
            range: {
              sheetId,
              startRowIndex: r,
              endRowIndex: r + 1,
              startColumnIndex: 16,
              endColumnIndex: 17,
            },
            rows: [
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: resumeVal,
                    },
                    textFormatRuns: [
                      {
                        startIndex: 0,
                        format: {
                          link: {
                            uri: resumeUrl,
                          },
                          bold: false,
                        },
                      },
                    ],
                    userEnteredFormat: {
                      textFormat: {
                        bold: false,
                        fontSize: 10,
                        foregroundColorStyle: {
                          rgbColor: { red: 0.090196, green: 0.137255, blue: 0.113725 },
                        },
                      },
                      verticalAlignment: "MIDDLE",
                      horizontalAlignment: "LEFT",
                    },
                  },
                ],
              },
            ],
            fields: "userEnteredValue,textFormatRuns,userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)",
          },
        });
      } else {
        updateRequests.push({
          updateCells: {
            range: {
              sheetId,
              startRowIndex: r,
              endRowIndex: r + 1,
              startColumnIndex: 16,
              endColumnIndex: 17,
            },
            rows: [
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: "Not submitted",
                    },
                    userEnteredFormat: {
                      textFormat: {
                        bold: false,
                        fontSize: 10,
                        foregroundColorStyle: {
                          rgbColor: { red: 0.090196, green: 0.137255, blue: 0.113725 },
                        },
                      },
                      verticalAlignment: "MIDDLE",
                      horizontalAlignment: "LEFT",
                    },
                  },
                ],
              },
            ],
            fields: "userEnteredValue,userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)",
          },
        });
      }
    }

    if (updateRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: updateRequests,
        },
      });
    }

    return { success: true, updatedCount: updateRequests.length };
  } catch (syncErr) {
    console.warn("Notice: syncExistingResumeLinks skipped:", syncErr?.message || syncErr);
    return { success: false, error: syncErr?.message || "Unknown error" };
  }
}

/**
 * Appends a new candidate application as a row in the configured Google Sheet.
 * 
 * DESIGN PRINCIPLE:
 * Fails safely and asynchronously. Never throws or halts the primary application flow.
 * MongoDB remains the source of truth.
 * 
 * @param {Object} application - The saved MongoDB Application document
 * @returns {Promise<{ success: boolean, updatedRange?: string, error?: string, skipped?: boolean }>}
 */
export async function appendApplicationToSheet(application) {
  if (!isGoogleSheetsConfigured()) {
    // Gracefully skip synchronization when credentials are not configured (e.g. local dev without keys)
    return {
      success: false,
      skipped: true,
      reason: "Google Sheets integration is not configured in this environment.",
    };
  }

  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID.trim();
    const tabName = (process.env.GOOGLE_SHEETS_TAB_NAME || "Applications").trim();

    const rowValues = formatApplicationForSheet(application);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:R`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    const updatedRange = response.data.updates?.updatedRange;

    // Apply explicit unbolding, number formatting, and remove any data validation from newly appended row
    if (updatedRange) {
      // Parse row index from range e.g. "Applications!A9:R9" or "'Applications'!A9:R9"
      const match = updatedRange.match(/!A(\d+):/i);
      if (match && match[1]) {
        const rowNum = parseInt(match[1], 10);
        const rowIndex = rowNum - 1; // 0-based index

        const meta = await sheets.spreadsheets.get({ spreadsheetId }).catch(() => null);
        const targetSheet = meta?.data.sheets?.find(
          (s) => s.properties?.title?.toLowerCase() === tabName.toLowerCase()
        );

        if (targetSheet) {
          const sheetId = targetSheet.properties.sheetId;
          const baseUrl = getAppBaseUrl();

          const hasResume = Boolean(
            (application.resume && (application.resume.fileName || application.resume.fileUrl || application.resume.publicId)) ||
            (typeof application.resume === "string" &&
              application.resume.trim() &&
              application.resume.trim() !== "—" &&
              application.resume.trim().toLowerCase() !== "not submitted") ||
            (application.resumeMetadata && (application.resumeMetadata.fileName || application.resumeMetadata.fileUrl))
          );

          const fileName = hasResume
            ? (typeof application.resume === "string" ? application.resume.trim() : application.resume?.fileName?.trim()) ||
              application.resumeMetadata?.fileName?.trim() ||
              "Resume.pdf"
            : "Not submitted";

          const appId =
            application._id?.toString() ||
            application.id?.toString() ||
            application.applicationNumber;

          const resumeUrl = `${baseUrl}/api/admin/applications/${appId}/resume`;

          const resumeCell = hasResume
            ? {
                userEnteredValue: { stringValue: fileName },
                textFormatRuns: [
                  {
                    startIndex: 0,
                    format: {
                      link: { uri: resumeUrl },
                      bold: false,
                    },
                  },
                ],
                userEnteredFormat: {
                  textFormat: { bold: false },
                },
              }
            : {
                userEnteredValue: { stringValue: "Not submitted" },
                userEnteredFormat: {
                  textFormat: { bold: false },
                },
              };

          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                // 1. Clear any data validation rules on the newly appended row
                {
                  setDataValidation: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 0,
                      endColumnIndex: 18,
                    },
                    rule: null,
                  },
                },
                // 2. Set entire appended row to regular typography & vertical middle
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
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
                    fields: "userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)",
                  },
                },
                // 3. Set Column A to plain number format & centered
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
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
                },
                // 4. Center alignment for Column B (Submitted At), Column C (Type), Column R (Status)
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 1,
                      endColumnIndex: 3,
                    },
                    cell: {
                      userEnteredFormat: {
                        horizontalAlignment: "CENTER",
                      },
                    },
                    fields: "userEnteredFormat.horizontalAlignment",
                  },
                },
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 17,
                      endColumnIndex: 18,
                    },
                    cell: {
                      userEnteredFormat: {
                        horizontalAlignment: "CENTER",
                      },
                    },
                    fields: "userEnteredFormat.horizontalAlignment",
                  },
                },
                // 5. Text wrap for Columns N, O, P (Opportunity, About, Cover Letter)
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 13,
                      endColumnIndex: 16,
                    },
                    cell: {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                      },
                    },
                    fields: "userEnteredFormat.wrapStrategy",
                  },
                },
                // 6. Set Column Q (Resume) to human-readable filename with secure resume link (or 'Not submitted')
                {
                  updateCells: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 16,
                      endColumnIndex: 17,
                    },
                    rows: [
                      {
                        values: [resumeCell],
                      },
                    ],
                    fields: hasResume
                      ? "userEnteredValue,textFormatRuns,userEnteredFormat.textFormat.bold"
                      : "userEnteredValue,userEnteredFormat.textFormat.bold",
                  },
                },
              ],
            },
          }).catch(() => {});
        }
      }
    }

    return {
      success: true,
      updatedRange,
    };
  } catch (error) {
    // Fail safely: Never let secondary Google Sheets synchronization disrupt primary candidate submission
    // NEVER log private keys or sensitive credentials
    console.error("Google Sheets sync failed safely:", error?.message || "Unknown error");
    return {
      success: false,
      error: error?.message || "Unknown Google Sheets API error",
    };
  }
}
