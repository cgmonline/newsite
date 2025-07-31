const fs = require("fs");
const path = require("path");

module.exports = {
  onPostBuild: ({ constants }) => {
    const envData = {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    };

    const content = `window._env_ = ${JSON.stringify(envData, null, 2)};`;

    const outputPath = path.join(constants.PUBLISH_DIR, "env.js");
    fs.writeFileSync(outputPath, content);
    console.log("✅ Injected env.js into public/");
  }
};


