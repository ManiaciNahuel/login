const log4js = require("log4js");

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      everything: { type: "file", filename: "all-the-logs.log" },
      emergencies: { type: "file", filename: "error.log" },
      "just-errors": {
        type: "logLevelFilter",
        appender: "emergencies",
        level: "error",
      },
      warns: { type: "file", filename: "warn.log" },
      "just-warns": {
        type: "logLevelFilter",
        appender: "warns",
        level: "warn",
        maxLevel: "warn",
      },
    },
    categories: {
      default: { appenders: ["just-errors", "everything", "miLoggerConsole", "just-warns"], level: "debug" },
    },
  });

let logger = log4js.getLogger()

module.exports = logger