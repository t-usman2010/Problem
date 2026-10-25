const nodemailer = require('nodemailer')

let transporter = null

/**
 * Initializes and returns the Nodemailer transporter.
 * Supports production SMTP, Gmail service, or a safe dev/test fallback.
 */
const getTransporter = async () => {
  if (transporter) return transporter

  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST
  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587)
  const user = process.env.EMAIL_USER || process.env.SMTP_USER
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS
  const service = process.env.EMAIL_SERVICE

  if (service && user && pass) {
    // Configured with service (e.g. 'gmail')
    transporter = nodemailer.createTransport({
      service,
      auth: { user, pass }
    })
  } else if (host && user && pass) {
    // Configured with custom SMTP host
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    })
  } else {
    // Fallback: in development/exhibition without SMTP credentials,
    // use a test Ethereal transporter or JSON console transport
    if (process.env.NODE_ENV === 'test') {
      transporter = nodemailer.createTransport({
        jsonTransport: true
      })
    } else {
      try {
        const testAccount = await nodemailer.createTestAccount()
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        })
        console.log('📧 Email service: Initialized with Ethereal development mailer.')
      } catch (err) {
        // Fallback to console logger if Ethereal cannot be reached
        transporter = nodemailer.createTransport({
          jsonTransport: true
        })
        console.log('📧 Email service: Running in console preview mode.')
      }
    }
  }

  return transporter
}

/**
 * Core send mail helper
 */
const sendMail = async ({ to, subject, html, text }) => {
  if (!to) {
    console.warn('📧 [Email Warning] No recipient email specified.')
    return null
  }

  try {
    const mailer = await getTransporter()
    const from = process.env.EMAIL_FROM || '"CivicReport Smart City" <notifications@civicreport.org>'

    const info = await mailer.sendMail({
      from,
      to,
      subject,
      text,
      html
    })

    console.log(`📧 [Email Sent] To: ${to} | Subject: "${subject}" | MessageId: ${info.messageId || 'mock'}`)

    // If using Ethereal, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`🔗 [Email Preview URL]: ${previewUrl}`)
    }

    return info
  } catch (err) {
    console.error('❌ [Email Error] Failed to send email:', err.message)
    return null
  }
}

/**
 * Common HTML email wrapper with smart city civic branding
 */
const renderEmailTemplate = ({
  heading,
  badgeText,
  badgeBg,
  badgeColor,
  intro,
  issue,
  message,
  ctaText,
  ctaUrl
}) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
  const actionUrl = ctaUrl || `${clientUrl}/issue/${issue._id}`
  const dateFormatted = new Date(issue.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #06080d 0%, #161b22 100%); padding: 32px 30px; text-align: left; border-bottom: 3px solid #2563eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; width: 36px; height: 36px; border-radius: 10px; text-align: center; line-height: 36px; font-weight: bold; font-size: 16px; margin-right: 12px; vertical-align: middle;">
                      CR
                    </div>
                    <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; vertical-align: middle;">
                      CivicReport
                    </span>
                    <span style="display: block; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
                      Smart City Infrastructure Platform
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <!-- Status Badge -->
              <div style="margin-bottom: 20px;">
                <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  ${badgeText}
                </span>
              </div>

              <!-- Title -->
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 14px 0; line-height: 1.3;">
                ${heading}
              </h1>

              <!-- Intro Paragraph -->
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                ${intro}
              </p>

              <!-- Issue Information Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Report Title
                    </span>
                    <span style="color: #0f172a; font-size: 15px; font-weight: 700;">
                      ${issue.title}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Category
                    </span>
                    <span style="color: #334155; font-size: 14px; font-weight: 600; text-transform: capitalize;">
                      ${issue.category || 'General'}
                    </span>
                  </td>
                </tr>
                ${issue.location?.address ? `
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Location / Address
                    </span>
                    <span style="color: #334155; font-size: 14px;">
                      📍 ${issue.location.address}
                    </span>
                  </td>
                </tr>` : ''}
                ${issue.assignedDept ? `
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Assigned Municipal Department
                    </span>
                    <span style="color: #2563eb; font-size: 14px; font-weight: 600;">
                      🏛️ ${issue.assignedDept}
                    </span>
                  </td>
                </tr>` : ''}
                <tr>
                  <td>
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Report Reference ID
                    </span>
                    <span style="color: #64748b; font-size: 12px; font-family: monospace;">
                      #${issue._id}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Message / Status explanation -->
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0;">
                ${message}
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);">
                    <a href="${actionUrl}" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.2px;">
                      ${ctaText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 6px 0;">
                You are receiving this automatic update because you submitted an issue to CivicReport.
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                © 2026 CivicReport Smart City Platform • Powered by Real-Time Civic Technology
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 1. Email sent when report is initially submitted
 */
const sendReportSubmittedEmail = async (user, issue) => {
  const recipientEmail = user?.email || issue.reportedBy?.email
  const recipientName = user?.name || issue.reportedBy?.name || 'Citizen'

  if (!recipientEmail) return

  const subject = `Report Submitted: ${issue.title} (CivicReport #${issue._id.toString().slice(-6)})`
  const intro = `Hello ${recipientName}, thank you for helping make our city safer and better. Your civic hazard report has been received by the municipality and is queued for verification.`
  const message = `Our municipal response team has logged your submission. You will automatically receive email notifications as soon as repair crews begin processing and resolving your report.`

  const html = renderEmailTemplate({
    heading: 'Your Report Has Been Submitted',
    badgeText: 'Status: Pending Verification',
    badgeBg: '#fee2e2',
    badgeColor: '#b91c1c',
    intro,
    issue,
    message,
    ctaText: 'View Report on Map'
  })

  const text = `
Hello ${recipientName},

Your report "${issue.title}" has been successfully submitted to CivicReport.
Reference ID: #${issue._id}
Category: ${issue.category}
Location: ${issue.location?.address || 'GPS Coordinates'}

Our municipal dispatch team is reviewing your report. We will notify you via email as soon as processing begins.

View your report: ${process.env.CLIENT_URL || 'http://localhost:3000'}/issue/${issue._id}
  `

  return sendMail({ to: recipientEmail, subject, html, text })
}

/**
 * 2. Email sent when report status changes to "in-progress" (in processing)
 */
const sendReportProcessingEmail = async (user, issue) => {
  const recipientEmail = user?.email || issue.reportedBy?.email
  const recipientName = user?.name || issue.reportedBy?.name || 'Citizen'

  if (!recipientEmail) return

  const dept = issue.assignedDept ? `The ${issue.assignedDept} department` : 'Municipal response teams'
  const subject = `Update: Your Report is Now In Processing (CivicReport #${issue._id.toString().slice(-6)})`
  const intro = `Hello ${recipientName}, great news! Your reported issue "${issue.title}" is now actively being processed.`
  const message = `${dept} has reviewed your complaint and dispatched personnel to inspect and repair the hazard. We will send you another update once the work is finalized.`

  const html = renderEmailTemplate({
    heading: 'Work In Progress on Your Report',
    badgeText: 'Status: In Processing',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    intro,
    issue,
    message,
    ctaText: 'Track Live Progress'
  })

  const text = `
Hello ${recipientName},

Your report "${issue.title}" (ID: #${issue._id}) is now in processing!
${issue.assignedDept ? `Assigned Department: ${issue.assignedDept}` : ''}

Municipal personnel have been dispatched to inspect and resolve this issue.

Track your report: ${process.env.CLIENT_URL || 'http://localhost:3000'}/issue/${issue._id}
  `

  return sendMail({ to: recipientEmail, subject, html, text })
}

/**
 * 3. Email sent when report status changes to "resolved"
 */
const sendReportResolvedEmail = async (user, issue) => {
  const recipientEmail = user?.email || issue.reportedBy?.email
  const recipientName = user?.name || issue.reportedBy?.name || 'Citizen'

  if (!recipientEmail) return

  const subject = `Resolved: Your Report Has Been Fixed! (CivicReport #${issue._id.toString().slice(-6)})`
  const intro = `Hello ${recipientName}, we are pleased to inform you that your reported hazard "${issue.title}" has been successfully resolved!`
  const message = `Municipal crews have completed the repairs and verified the resolution. Thank you for being an active, proactive citizen in our smart city community!`

  const html = renderEmailTemplate({
    heading: 'Problem Resolved Successfully',
    badgeText: 'Status: Resolved & Verified',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    intro,
    issue,
    message,
    ctaText: 'Inspect Verified Report'
  })

  const text = `
Hello ${recipientName},

We are pleased to inform you that your reported issue "${issue.title}" (ID: #${issue._id}) has been marked as RESOLVED!

Thank you for contributing to a cleaner, safer, and more sustainable city!

View verified issue: ${process.env.CLIENT_URL || 'http://localhost:3000'}/issue/${issue._id}
  `

  return sendMail({ to: recipientEmail, subject, html, text })
}

module.exports = {
  sendMail,
  sendReportSubmittedEmail,
  sendReportProcessingEmail,
  sendReportResolvedEmail
}
