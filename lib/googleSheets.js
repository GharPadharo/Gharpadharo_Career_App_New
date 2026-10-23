import { google } from "googleapis";
import {
  getOrCreateResumeToken,
  hasAttachedResume,
  getPublicAppBaseUrl,
  CANONICAL_APP_URL,
} from "./resumeTokens.js";

/**
 * Canonical Google Sheet Header Row definition for GharPadharo Career Applications.
 * Exactly 17 columns, in this exact order (A through Q):
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
 * LinkedIn
 * M  Portfolio
 * N  Opportunity
 * O  About
 * P  Cover Letter
 * Q  Resume
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
 * Resolves the application base URL for generating external links (such as Google Sheets resume links).
 * Never uses 'localhost' or '127.0.0.1' so spreadsheet hyperlinks work seamlessly for recruiters across devices.
 * @returns {string}
 */
export function getAppBaseUrl() {
  return getPublicAppBaseUrl();
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
 * Sanitizes untrusted values before writing them into Google Sheets cells using valueInputOption: "USER_ENTERED".
 * Protects against Spreadsheet Formula Injection (CSV / Formula Injection / DDE) across all applicant-controlled fields.
 *
 * Formula Injection Triggers in spreadsheet software (Excel, Google Sheets, LibreOffice Calc):
 * - Formula prefix characters: '=', '+', '-', '@', '\t', '\r', '\n'
 * - Leading whitespace (spaces, tabs, newlines) followed by any of the above trigger characters
 *
 * Mitigation Mechanism:
 * Prepending an apostrophe / single quote (') forces spreadsheet parsers to interpret the cell contents
 * strictly as a plain text string literal rather than an executable formula or command expression.
 * The leading apostrophe is suppressed by Google Sheets in display view and preserves the exact text,
 * including legitimate international phone numbers (e.g. '+91 9876543210') and special characters.
 *
 * @param {any} val - Untrusted text value
 * @param {string} [fallback="—"] - Default value when the input is null, undefined, or empty
 * @returns {string|number} Sanitized value safe for Google Sheets
 */
export function sanitizeForGoogleSheets(val, fallback = "—") {
  if (val === null || val === undefined) {
    return fallback;
  }

  // Preserve numeric types (e.g. integer applicationNumber 1, 2, 3...)
  if (typeof val === "number") {
    return isNaN(val) ? fallback : val;
  }

  const raw = String(val);
  const trimmed = raw.trim();
  if (!trimmed) {
    return fallback;
  }

  // Formula trigger characters: =, +, -, @, \t, \r, \n (including any preceding whitespace)
  const FORMULA_TRIGGER_REGEX = /^[\s\t\r\n]*[=+\-@\t\r\n]/;

  if (FORMULA_TRIGGER_REGEX.test(raw)) {
    // If it doesn't already start with an apostrophe, prepend '
    if (!raw.startsWith("'")) {
      return `'${raw}`;
    }
  }

  return raw;
}

/**
 * Formats an application document into an array of 17 values matching `GOOGLE_SHEETS_HEADERS`.
 * Exactly 17 columns in order A through Q.
 * 
 * Key refinements:
 * - Column A (Application ID): Numeric integer from application.applicationNumber (1, 2, 3...)
 * - Column B (Submitted At): Human readable "DD/MM/YYYY hh:mm AM/PM" from createdAt
 * - Column Q (Resume): Human-readable resume document file name or "Not submitted"
 * 
 * @param {Object} app - Raw MongoDB Application document or serialized application object
 * @returns {Array<string|number>} Array of 17 cell values
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
  const rawPosition = isGeneral
    ? "—"
    : app.jobTitle?.trim() || app.jobSlug?.trim() || "—";
  const positionAppliedFor = sanitizeForGoogleSheets(rawPosition, "—");

  // Column E: Team / Department ("—" for General, Job team for Job)
  const rawTeam = isGeneral
    ? "—"
    : app.jobTeam?.trim() || "—";
  const teamDepartment = sanitizeForGoogleSheets(rawTeam, "—");

  // Column F & G: First Name & Last Name
  let rawFirstName = (app.firstName || "").trim();
  let rawLastName = (app.lastName || "").trim();
  if (!rawFirstName && app.candidate) {
    const parts = app.candidate.trim().split(/\s+/);
    rawFirstName = parts[0] || "";
    rawLastName = parts.slice(1).join(" ") || "";
  }
  const firstName = sanitizeForGoogleSheets(rawFirstName, "—");
  const lastName = sanitizeForGoogleSheets(rawLastName, "—");

  // Column H: Email
  const rawEmail = (app.email || "").toLowerCase().trim();
  const email = sanitizeForGoogleSheets(rawEmail, "—");

  // Column I: Phone (sanitized with formula protection for leading + and =)
  const rawPhone = (app.phone || "").trim();
  const phone = sanitizeForGoogleSheets(rawPhone, "—");

  // Column J: Job Title (Candidate's current designation)
  const rawCurrentJobTitle = (app.currentJobTitle || "").trim();
  const currentJobTitle = sanitizeForGoogleSheets(rawCurrentJobTitle, "—");

  // Column K: Experience
  const rawExperience = (app.experience || "").trim();
  const experience = sanitizeForGoogleSheets(rawExperience, "—");

  // Column L: LinkedIn
  const rawLinkedin = (app.linkedin || "").trim();
  const linkedin = sanitizeForGoogleSheets(rawLinkedin, "—");

  // Column M: Portfolio
  const rawPortfolio = (app.portfolio || "").trim();
  const portfolio = sanitizeForGoogleSheets(rawPortfolio, "—");

  // Column N: Opportunity (Candidate's general application answer, or "—" for Job)
  const rawOpportunity = isGeneral
    ? (app.opportunityLookingFor || "").trim()
    : "—";
  const opportunity = sanitizeForGoogleSheets(rawOpportunity, "—");

  // Column O: About (Candidate's general application answer, or "—" for Job)
  const rawAbout = isGeneral
    ? (app.aboutYourself || "").trim()
    : "—";
  const about = sanitizeForGoogleSheets(rawAbout, "—");

  // Column P: Cover Letter
  const rawCoverLetter = (app.coverLetter || "").trim();
  const isFallbackCoverLetter =
    isGeneral && rawCoverLetter.toLowerCase() === "general application";
  const coverLetter = sanitizeForGoogleSheets(
    rawCoverLetter && !isFallbackCoverLetter ? rawCoverLetter : "",
    "—"
  );

  // Column Q: Resume (File name preferred as human-readable value, or "Not submitted")
  const hasResume = Boolean(
    (app.resume && (app.resume.fileName || app.resume.fileUrl || app.resume.publicId)) ||
    (typeof app.resume === "string" &&
      app.resume.trim() &&
      app.resume.trim() !== "—" &&
      app.resume.trim().toLowerCase() !== "not submitted") ||
    (app.resumeMetadata && (app.resumeMetadata.fileName || app.resumeMetadata.fileUrl))
  );

  const rawResumeFileName = hasResume
    ? (typeof app.resume === "string" ? app.resume.trim() : app.resume?.fileName?.trim()) ||
      app.resumeMetadata?.fileName?.trim() ||
      "Resume.pdf"
    : "Not submitted";
  const resumeFileName = sanitizeForGoogleSheets(rawResumeFileName, "Not submitted");

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
  ];
}

/**
 * Applies professional font and dashboard formatting to the target Google Sheet:
 * - Title Banner (Row 1): Merged A1:Q1, Deep Forest Green #1D4B3C, compact height 44px
 * - Table Column Headers (Row 2): Bold white text, Primary Dark Green #245C4A, height 36px
 * - Frozen Rows: Top 2 rows frozen (banner + headers)
 * - Basic Filter: Enabled across columns A through Q on Row 2
 * - Column Widths: Optimized widths for recruiter readability
 * - Alternating Rows: Subtle white & light green-tint zebra striping
 * - Data Rows (Row 3+): Normal / Regular font weight (NOT bold), color #17231D, font size 10
 * - Alignments: Centered for ID, Submitted At, Type; Wrapped for long text; Left for details
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

    // 4. Clear all data validation rules across columns A through Q (no people chips, dropdowns, etc.)
    requests.push({
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 2000,
          startColumnIndex: 0,
          endColumnIndex: 17,
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

    // 6. Merge A1:Q1 for Title Banner (handle unmerging if bounds changed)
    const existingRow0Merge = targetSheet.merges?.find(
      (m) => m.startRowIndex === 0 && m.endRowIndex === 1
    );

    if (existingRow0Merge) {
      if (existingRow0Merge.startColumnIndex === 0 && existingRow0Merge.endColumnIndex === 17) {
        // Already accurately merged A1:Q1
      } else {
        // Old merge width (e.g. A1:R1 or A1:S1) -> unmerge first, then merge A1:Q1
        requests.push({
          unmergeCells: {
            range: {
              sheetId,
              startRowIndex: existingRow0Merge.startRowIndex,
              endRowIndex: existingRow0Merge.endRowIndex,
              startColumnIndex: existingRow0Merge.startColumnIndex,
              endColumnIndex: existingRow0Merge.endColumnIndex,
            },
          },
        });
        requests.push({
          mergeCells: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 17,
            },
            mergeType: "MERGE_ALL",
          },
        });
      }
    } else {
      requests.push({
        mergeCells: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 17,
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

    // 8. Explicit column widths for recruiter readability (Columns A through Q)
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
          endColumnIndex: 17,
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
      const isCenter = [0, 1, 2].includes(idx);
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
          endColumnIndex: 17,
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
            endColumnIndex: 17,
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
            endColumnIndex: 17,
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
          endColumnIndex: 17,
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

    // Center alignment for Column B (Submitted At) and Column C (Application Type)
    for (const cIdx of [1, 2]) {
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

    // Ensure any leftover content in Column R and beyond is cleared
    await sheets.spreadsheets.values
      .clear({
        spreadsheetId,
        range: `${tabName}!R1:Z2000`,
      })
      .catch(() => {});

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    // 14. Ensure existing application rows have clickable persistent resume links in Column Q
    await syncExistingResumeLinks(sheets, spreadsheetId, tabName);
  } catch (fmtError) {
    // Non-fatal: Log styling warning without failing operation
    console.warn("Notice: Sheet font formatting adjustment skipped:", fmtError?.message);
  }
}

/**
 * Updates existing rows in the Google Sheet so Column Q (Resume) has clickable
 * rich-text hyperlinks pointing to persistent token-based URLs (/api/resumes/[token]).
 * Visible text remains the original resume filename (e.g. "Ranjeet Resume .pdf").
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
      range: `${tabName}!A:Q`,
    });

    const rows = valuesRes.data.values || [];
    if (rows.length <= 1) return { success: true, updatedCount: 0 };

    // Connect to MongoDB to resolve candidate documents and persistent tokens
    const { connectDB } = await import("./mongodb.js");
    const Application = (await import("../models/Application.js")).default;
    await connectDB();

    const updateRequests = [];

    // Data rows begin after banner and column headers (row index 2+)
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const appNumber = (row[0] || "").toString().trim();
      // Skip non-numeric rows (such as Title Banner and Column Headers)
      if (!appNumber || isNaN(parseInt(appNumber, 10))) continue;

      const num = parseInt(appNumber, 10);
      const appDoc = await Application.findOne({ applicationNumber: num });

      const resumeVal = (row[16] || "").toString().trim();
      const hasResume = Boolean(
        appDoc
          ? hasAttachedResume(appDoc)
          : resumeVal &&
              resumeVal !== "—" &&
              resumeVal.toLowerCase() !== "not submitted" &&
              resumeVal.toLowerCase() !== "resume"
      );

      let persistentUrl = "";
      if (appDoc && hasAttachedResume(appDoc)) {
        const tokenResult = await getOrCreateResumeToken(appDoc);
        if (tokenResult?.url) {
          persistentUrl = tokenResult.url;
        }
      }

      const rawFileName =
        (appDoc?.resume?.fileName ||
          appDoc?.resumeMetadata?.fileName ||
          (resumeVal &&
          resumeVal !== "—" &&
          resumeVal.toLowerCase() !== "not submitted" &&
          resumeVal.toLowerCase() !== "resume"
            ? resumeVal
            : "") ||
          "Resume.pdf").trim();
      const fileName = sanitizeForGoogleSheets(rawFileName, "Resume.pdf");

      if (hasResume && persistentUrl) {
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
                      stringValue: fileName,
                    },
                    textFormatRuns: [
                      {
                        startIndex: 0,
                        format: {
                          link: {
                            uri: persistentUrl,
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
                      stringValue: hasResume ? fileName : "Not submitted",
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
                      horizontalAlignment: hasResume ? "LEFT" : "CENTER",
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

    let persistentResumeLink = "";
    if (hasAttachedResume(application)) {
      try {
        const tokenResult = await getOrCreateResumeToken(application);
        if (tokenResult?.url) {
          persistentResumeLink = tokenResult.url;
        }
      } catch (tokErr) {
        console.warn("Could not generate resume token for sheet append:", tokErr?.message || tokErr);
      }
    }

    const rowValues = formatApplicationForSheet(application);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:Q`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    const updatedRange = response.data.updates?.updatedRange;

    // Apply explicit unbolding, number formatting, and remove any data validation from newly appended row
    if (updatedRange) {
      // Parse row index from range e.g. "Applications!A9:Q9" or "'Applications'!A9:Q9"
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

          const hasResume = Boolean(
            (application.resume && (application.resume.fileName || application.resume.fileUrl || application.resume.publicId)) ||
            (typeof application.resume === "string" &&
              application.resume.trim() &&
              application.resume.trim() !== "—" &&
              application.resume.trim().toLowerCase() !== "not submitted") ||
            (application.resumeMetadata && (application.resumeMetadata.fileName || application.resumeMetadata.fileUrl))
          );

          const rawFileName = hasResume
            ? (typeof application.resume === "string" ? application.resume.trim() : application.resume?.fileName?.trim()) ||
              application.resumeMetadata?.fileName?.trim() ||
              "Resume.pdf"
            : "Not submitted";
          const fileName = sanitizeForGoogleSheets(rawFileName, "Not submitted");

          const resumeCell = hasResume && persistentResumeLink
            ? {
                userEnteredValue: { stringValue: fileName },
                textFormatRuns: [
                  {
                    startIndex: 0,
                    format: {
                      link: { uri: persistentResumeLink },
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
              }
            : {
                userEnteredValue: { stringValue: hasResume ? fileName : "Not submitted" },
                userEnteredFormat: {
                  textFormat: {
                    bold: false,
                    fontSize: 10,
                    foregroundColorStyle: {
                      rgbColor: { red: 0.090196, green: 0.137255, blue: 0.113725 },
                    },
                  },
                  verticalAlignment: "MIDDLE",
                  horizontalAlignment: hasResume ? "LEFT" : "CENTER",
                },
              };

          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                // 1. Clear any data validation rules on the newly appended row (Columns A through Q)
                {
                  setDataValidation: {
                    range: {
                      sheetId,
                      startRowIndex: rowIndex,
                      endRowIndex: rowIndex + 1,
                      startColumnIndex: 0,
                      endColumnIndex: 17,
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
                      endColumnIndex: 17,
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
                // 4. Center alignment for Column B (Submitted At) and Column C (Type)
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
                // 6. Set Column Q (Resume) to human-readable filename with persistent resume token link
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
                    fields: hasResume && persistentResumeLink
                      ? "userEnteredValue,textFormatRuns,userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)"
                      : "userEnteredValue,userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)",
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

/**
 * Exports the existing integrated Google Sheets spreadsheet as an Excel (.xlsx) file Buffer.
 * Uses the server-side Service Account JWT credentials to call Google's official spreadsheet export endpoint.
 *
 * @returns {Promise<{ success: true, buffer: Buffer, contentType: string, filename: string } | { success: false, error: string, status?: number }>}
 */
export async function exportSpreadsheetAsXlsx() {
  if (!isGoogleSheetsConfigured()) {
    return {
      success: false,
      error: "Google Sheets integration is not configured. Missing required environment variables.",
      status: 503,
    };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID.trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const { token } = await auth.getAccessToken();
    if (!token) {
      return {
        success: false,
        error: "Failed to generate Google service account access token.",
        status: 502,
      };
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
    const response = await fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Google Sheets export HTTP error:", response.status, errorText.slice(0, 200));
      return {
        success: false,
        error: `Google Sheets export failed with status ${response.status}: ${response.statusText}`,
        status: response.status >= 500 ? 502 : response.status,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      buffer,
      contentType:
        response.headers.get("content-type") ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filename: "GharPadharo_Applications.xlsx",
    };
  } catch (error) {
    console.error("Google Sheets export exception:", error?.message || error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred while exporting the spreadsheet.",
      status: 500,
    };
  }
}
