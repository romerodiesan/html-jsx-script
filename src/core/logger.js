const { OUTPUT_CHANNEL_NAME } = require("./constants");

/**
 * @param {typeof import("vscode")} vscode
 */
function createLogger(vscode) {
  const channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);

  /**
   * @param {string} level
   * @param {string} message
   */
  function write(level, message) {
    channel.appendLine(`[${new Date().toISOString()}] [${level}] ${message}`);
  }

  return {
    channel,
    info(message) {
      write("INFO", message);
    },
    error(message) {
      write("ERROR", message);
    }
  };
}

module.exports = {
  createLogger
};
