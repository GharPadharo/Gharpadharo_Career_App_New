import nodemailer from "nodemailer";
import { connectDB } from "./mongodb.js";
import User from "../models/User.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks whether the minimum required SMTP configuration environment variables are present.
 *
 * @returns {boolean} True if SMTP host, user, and password are configured
 */
export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

/**
 * Resolves the admin portal base URL for application review links.
 * Follows existing portal convention and works across both development and production.
 *
 * @param {string} applicationId - MongoDB _id of the Application
 * @returns {string} Fully qualified URL to the admin application detail page
 */
export function resolveAdminApplicationUrl(applicationId) {
  const base = (
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://career.gharpadharo.com"
  ).replace(/\/+$/, "");

  return `${base}/admin/dashboard/applications/${applicationId}`;
}

/**
 * Formats a submission timestamp into a readable date string with IST timezone.
 *
 * @param {Date|string|number} dateValue
 * @returns {string} Formatted date string (e.g., "05 Nov 2026, 01:15 PM IST")
 */
export function formatSubmissionDate(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
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
    const dayPeriod = (getPart("dayPeriod") || "").toUpperCase();

    return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod} IST`;
  } catch {
    return date.toUTCString();
  }
}

/**
 * Retrieves all active administrators and superadmins from the MongoDB User collection.
 *
 * Rules:
 * 1. MongoDB User collection is the single source of truth.
 * 2. Role must be "admin" or "superadmin".
 * 3. isActive must be strictly true.
 * 4. Email must be valid, normalized (trimmed, lowercase), and deduplicated.
 *
 * @returns {Promise<{ emails: string[], admins: Array<{ email: string, name: string, role: string }> }>}
 */
export async function getActiveAdminRecipients() {
  try {
    await connectDB();

    const adminDocs = await User.find({
      role: { $in: ["admin", "superadmin"] },
      isActive: true,
    })
      .select("email name role isActive")
      .lean();

    if (!Array.isArray(adminDocs) || adminDocs.length === 0) {
      return { emails: [], admins: [] };
    }

    const uniqueEmails = new Set();
    const validAdmins = [];

    for (const doc of adminDocs) {
      if (!doc || typeof doc.email !== "string") continue;
      const normalizedEmail = doc.email.trim().toLowerCase();

      if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
        console.warn(`[EmailService] Skipping administrator with invalid email: "${doc.email}"`);
        continue;
      }

      if (!uniqueEmails.has(normalizedEmail)) {
        uniqueEmails.add(normalizedEmail);
        validAdmins.push({
          email: normalizedEmail,
          name: typeof doc.name === "string" ? doc.name.trim() : "",
          role: doc.role,
        });
      }
    }

    return {
      emails: Array.from(uniqueEmails),
      admins: validAdmins,
    };
  } catch (error) {
    console.error("[EmailService] Failed to retrieve active admin recipients from database:", error?.message || error);
    return { emails: [], admins: [] };
  }
}

/**
 * Generates the responsive HTML and plain text email templates for new application notifications.
 *
 * @param {object} params
 * @param {object} params.application - The persisted application document
 * @param {string} params.viewUrl - Direct URL to review the application in the admin portal
 * @param {string} params.formattedDate - Pre-formatted submission timestamp
 * @returns {{ html: string, text: string, subject: string }}
 */
export function generateApplicationEmailTemplate({ application, viewUrl, formattedDate }) {
  const isGeneral = application.applicationType === "general";
  const jobTitle = isGeneral
    ? "General Application"
    : application.jobTitle || "Job Opening";
  const department = isGeneral
    ? (application.opportunityLookingFor ? `General (${application.opportunityLookingFor})` : "General / Open Pool")
    : (application.jobTeam || "Not Specified");

  const candidateName =
    application.candidate ||
    `${application.firstName || ""} ${application.lastName || ""}`.trim() ||
    "Applicant";

  const candidateEmail = (application.email || "").toLowerCase().trim();
  const subject = `New Application Received – ${jobTitle} | GharPadharo`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F8F6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #11152F; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F6FE; width: 100%; margin: 0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(95, 48, 222, 0.08); border: 1px solid #ECE7FC;">
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5929D6 0%, #6A3AE8 100%); padding: 32px 32px 28px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 6px 14px; background-color: rgba(255, 255, 255, 0.18); border-radius: 20px; color: #FFFFFF; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                      GharPadharo Careers
                    </span>
                    <h1 style="margin: 14px 0 6px 0; color: #FFFFFF; font-size: 22px; font-weight: 800; line-height: 1.25; letter-spacing: -0.02em;">
                      New Application Received
                    </h1>
                    <p style="margin: 0; color: #E0D7FE; font-size: 14px; line-height: 1.4;">
                      A new candidate has submitted an application for review.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Application Details Card -->
          <tr>
            <td style="padding: 28px 32px 20px 32px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #4B5565;">
                Hello Admin Team,<br><br>
                A new candidate submission has been recorded in the GharPadharo recruitment portal. Key details are summarized below:
              </p>

              <!-- Details Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FBF9FF; border-radius: 12px; border: 1px solid #EFEAFD; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 13px; font-weight: 600; color: #5B32D5; width: 36%;">
                    Candidate Name
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 14px; font-weight: 700; color: #11152F;">
                    ${escapeHtml(candidateName)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 13px; font-weight: 600; color: #5B32D5;">
                    Candidate Email
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 14px; color: #11152F;">
                    <a href="mailto:${escapeHtml(candidateEmail)}" style="color: #5929D6; text-decoration: none; font-weight: 600;">
                      ${escapeHtml(candidateEmail)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 13px; font-weight: 600; color: #5B32D5;">
                    Applied Position
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 14px; font-weight: 700; color: #11152F;">
                    ${escapeHtml(jobTitle)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 13px; font-weight: 600; color: #5B32D5;">
                    Department / Team
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 14px; color: #11152F;">
                    ${escapeHtml(department)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 13px; font-weight: 600; color: #5B32D5;">
                    Application Type
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EFEAFD; font-size: 14px; color: #11152F;">
                    ${isGeneral ? "General Application" : "Specific Job Application"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; font-weight: 600; color: #5B32D5;">
                    Submitted At
                  </td>
                  <td style="padding: 14px 18px; font-size: 13px; color: #4B5565;">
                    ${escapeHtml(formattedDate)}
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(viewUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #5929D6 0%, #6A3AE8 100%); color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 14px rgba(89, 41, 214, 0.35); letter-spacing: 0.02em;">
                      View Application in Admin Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security & Confidentiality Footer -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; background-color: #FAF9FD; border-top: 1px solid #EFEAFD; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #5B32D5;">
                GharPadharo Career Portal &bull; Confidential Recruitment Notice
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #8F9BB3;">
                This notification is automatically sent to active GharPadharo administrators upon candidate submission.
                Candidate resumes and data are protected under GharPadharo privacy guidelines. Do not forward this email outside the recruitment team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New Application Received – GharPadharo Career Portal
==================================================

A new candidate has submitted an application for review.

Candidate Details:
- Full Name: ${candidateName}
- Email: ${candidateEmail}
- Position: ${jobTitle}
- Department: ${department}
- Application Type: ${isGeneral ? "General Application" : "Specific Job Application"}
- Submitted: ${formattedDate}

View Application in Admin Dashboard:
${viewUrl}

--------------------------------------------------
Confidential: This notification is sent only to active GharPadharo administrators. Do not share outside the hiring team.
`;

  return { html, text, subject };
}

/**
 * Escapes HTML characters to prevent XSS injection in HTML email rendering.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates and returns a Nodemailer transporter.
 *
 * @param {object} [customTransporter]
 * @returns {import("nodemailer").Transporter}
 */
export function getMailTransporter(customTransporter) {
  if (customTransporter) {
    return customTransporter;
  }

  if (process.env.MOCK_EMAIL_TRANSPORT === "true") {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

  const rawUser = (process.env.SMTP_USER || "").trim();
  const rawPass = (process.env.SMTP_PASS || "").trim();
  const isGmail =
    (process.env.SMTP_HOST || "").toLowerCase().includes("gmail") ||
    rawUser.toLowerCase().endsWith("@gmail.com");
  // Google displays App Passwords with spaces (e.g. "xxxx xxxx xxxx xxxx"). Normalize by stripping spaces for SMTP.
  const pass = isGmail ? rawPass.replace(/\s+/g, "") : rawPass;

  return nodemailer.createTransport({
    host: (process.env.SMTP_HOST || "").trim(),
    port,
    secure: isSecure,
    auth: {
      user: rawUser,
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

/**
 * Dispatches automatic email notifications for newly persisted job applications.
 *
 * Safety & Reliability Guarantees:
 * - Fails safely: Never throws an uncaught error; cannot break candidate application submission.
 * - Recipient resolution: Strictly queries MongoDB User collection for active admins/superadmins.
 * - Privacy: Sends individual emails to avoid exposing administrator email lists to each other.
 * - Non-leaking: Logs errors safely without leaking credentials or candidate private info.
 *
 * @param {object} application - The persisted application document
 * @param {object} [options] - Optional overrides for testing
 * @param {import("nodemailer").Transporter} [options.transporter] - Optional custom transporter
 * @param {string[]} [options.recipients] - Optional recipient override for testing
 * @param {boolean} [options.silent] - Silence console logs
 * @returns {Promise<{ success: boolean, sentCount: number, recipients: string[], skipped?: boolean, reason?: string, error?: string }>}
 */
export async function sendNewApplicationNotification(application, options = {}) {
  try {
    if (!application || !application._id) {
      return {
        success: false,
        sentCount: 0,
        recipients: [],
        skipped: true,
        reason: "Invalid or missing application document",
      };
    }

    // 1. Resolve recipients
    let recipients = [];
    if (Array.isArray(options.recipients)) {
      recipients = Array.from(
        new Set(
          options.recipients
            .filter((e) => typeof e === "string" && EMAIL_REGEX.test(e.trim().toLowerCase()))
            .map((e) => e.trim().toLowerCase())
        )
      );
    } else {
      const adminData = await getActiveAdminRecipients();
      recipients = adminData.emails;
    }

    if (recipients.length === 0) {
      if (!options.silent) {
        console.warn("[EmailService] No active administrator recipients found to notify.");
      }
      return {
        success: true,
        sentCount: 0,
        recipients: [],
        reason: "No active administrator recipients found",
      };
    }

    // 2. Verify email transport readiness
    const hasCustomTransporter = Boolean(options.transporter);
    const isMock = process.env.MOCK_EMAIL_TRANSPORT === "true";
    const isConfigured = isEmailConfigured();

    if (!hasCustomTransporter && !isMock && !isConfigured) {
      if (!options.silent) {
        console.info(
          "[EmailService] SMTP credentials not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping admin notification email."
        );
      }
      return {
        success: false,
        sentCount: 0,
        recipients,
        skipped: true,
        reason: "SMTP credentials not configured",
      };
    }

    // 3. Prepare email content
    const applicationId = application._id.toString();
    const viewUrl = resolveAdminApplicationUrl(applicationId);
    const formattedDate = formatSubmissionDate(application.createdAt);

    const { html, text, subject } = generateApplicationEmailTemplate({
      application,
      viewUrl,
      formattedDate,
    });

    const transporter = getMailTransporter(options.transporter);
    const fromAddress =
      process.env.EMAIL_FROM ||
      (process.env.SMTP_USER
        ? `GharPadharo Careers <${process.env.SMTP_USER}>`
        : "GharPadharo Careers <careers@gharpadharo.com>");

    // 4. Send emails to each active administrator
    let sentCount = 0;
    const sendPromises = recipients.map(async (adminEmail) => {
      try {
        const sendResult = await transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          subject,
          text,
          html,
        });
        sentCount += 1;
        return { recipient: adminEmail, success: true, messageId: sendResult?.messageId };
      } catch (sendErr) {
        console.error(
          `[EmailService] Failed to deliver notification email to admin recipient:`,
          sendErr?.message || sendErr
        );
        return { recipient: adminEmail, success: false, error: sendErr?.message || "Delivery failed" };
      }
    });

    const deliveryResults = await Promise.all(sendPromises);

    if (!options.silent) {
      console.log(
        `[EmailService] Admin application notification dispatched for application ${applicationId}: ${sentCount}/${recipients.length} delivered.`
      );
    }

    return {
      success: sentCount > 0,
      sentCount,
      recipients,
      results: deliveryResults,
    };
  } catch (error) {
    console.error("[EmailService] Unexpected error during notification dispatch:", error?.message || error);
    return {
      success: false,
      sentCount: 0,
      recipients: [],
      error: error?.message || "Unknown error during notification dispatch",
    };
  }
}
