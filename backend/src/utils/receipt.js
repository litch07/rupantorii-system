import PDFDocument from "pdfkit";

function formatMoney(value) {
  const amount = typeof value === "string" ? Number(value) : value;
  const formatted = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount || 0);
  return `BDT ${formatted}`;
}

export async function buildOrderReceipt(order) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  const done = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.fontSize(20).text("Rupantorii - Order Receipt");
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#444444");
  doc.text(`Order Number: ${order.orderNumber}`);
  doc.text(`Order ID: ${order.id}`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(12).fillColor("#222222").text("Customer Details", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(11).fillColor("#444444");
  doc.text(order.customerName);
  doc.text(order.customerPhone);
  doc.text(order.address);
  doc.text(order.city);
  if (order.notes) {
    doc.text(`Notes: ${order.notes}`);
  }
  if (order.cancelReason) {
    doc.text(`Cancel Reason: ${order.cancelReason}`);
  }
  doc.moveDown();

  doc.fontSize(12).fillColor("#222222").text("Order Items", { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 300;
  const col3 = 380;
  const col4 = 470;

  doc.fontSize(10).fillColor("#444444");
  doc.text("Item", col1, tableTop);
  doc.text("SKU", col2, tableTop);
  doc.text("Qty", col3, tableTop, { width: 40, align: "right" });
  doc.text("Line Total", col4, tableTop, { width: 90, align: "right" });

  let rowY = tableTop + 18;

  order.items?.forEach((item) => {
    const sku = item.variant?.sku || "-";
    const lineTotal = formatMoney(Number(item.price) * item.quantity);
    doc.text(item.product.name, col1, rowY, { width: 230 });
    doc.text(sku, col2, rowY);
    doc.text(String(item.quantity), col3, rowY, { width: 40, align: "right" });
    doc.text(lineTotal, col4, rowY, { width: 90, align: "right" });
    rowY += 18;
  });

  doc.moveDown(2);
  doc.fontSize(12).fillColor("#222222");
  doc.text(`Total: ${formatMoney(order.totalAmount)}`, { align: "right" });

  doc.end();
  return done;
}
