import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

const { default: app } = await import("./server.js");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Rupantorii API running on port ${port}`);
});
