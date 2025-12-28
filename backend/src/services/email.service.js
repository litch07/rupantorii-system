import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
}

function formatStatus(status) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function sendOrderConfirmationEmail(order, receiptBuffer) {
  const transporter = getTransporter();
  if (!transporter || !order.customerEmail) {
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Thank you for your order, ${order.customerName}.</h2>
      <p>Your Rupantorii order <strong>${order.orderNumber}</strong> has been placed.</p>
      <p>We will notify you as soon as the status changes.</p>
      <p>Delivery address: ${order.address}, ${order.city}</p>
      <p style="margin-top: 20px;">Warm regards,<br/>Rupantorii Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
    attachments: receiptBuffer
      ? [{ filename: `order-${order.orderNumber}.pdf`, content: receiptBuffer }]
      : []
  });
}

export async function sendOrderStatusEmail(order) {
  const transporter = getTransporter();
  if (!transporter || !order.customerEmail) {
    return;
  }

  const statusLabel = formatStatus(order.status);
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Order Update: ${order.orderNumber}</h2>
      <p>Your order status is now <strong>${statusLabel}</strong>.</p>
      ${order.cancelReason ? `<p>Reason: ${order.cancelReason}</p>` : ""}
      <p style="margin-top: 20px;">Thank you for shopping with Rupantorii.</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: order.customerEmail,
    subject: `Order ${statusLabel} - ${order.orderNumber}`,
    html
  });
}
