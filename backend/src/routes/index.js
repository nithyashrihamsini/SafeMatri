const express = require("express");

const metaRoutes = require("./meta.routes.js");
const assessRoutes = require("./assess.routes.js");
const casesRoutes = require("./cases.routes.js");
const smsRoutes = require("./sms.routes.js");
const demoRoutes = require("./demo.routes.js");

const router = express.Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/meta", metaRoutes);
router.use("/assess", assessRoutes);
router.use("/cases", casesRoutes);
router.use("/sms-log", smsRoutes);
router.use("/demo", demoRoutes);

module.exports = router;