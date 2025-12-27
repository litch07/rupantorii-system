import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./server.js");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Rupantorii API running on port ${port}`);
});
