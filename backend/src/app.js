const express = require("express");
const cors = require("cors");

const config = require("./config/index.js");
const routes = require("./routes/index.js");
const requestLogger = require("./middleware/requestLogger.js");
const notFound = require("./middleware/notFound.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

app.use("/api", routes);

app.use(notFound);      // no route matched
app.use(errorHandler);  // must be last (4 args)

module.exports = app;