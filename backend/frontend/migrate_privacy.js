const fs = require("fs");
const path = require("path");

const fileBase = "privacy-policy";
const componentName = "PrivacyPolicyPage";

const phpFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/${fileBase}.php`,
);
const jsxFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/${componentName}.jsx`,
);

let content = fs.readFileSync(phpFile, "utf8");

let startMatch = content.match(/<div class="content(?:| [^"]*)">/);
if (!startMatch) process.exit(1);
const startIndex = startMatch.index;
let bodyHtml = content.slice(startIndex);

bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?(?:include|require)[\s\S]*?footer\.php[\s\S]*?\?>/g,
  "",
);
const endIndex = bodyHtml.indexOf("<!-- /Page Wrapper -->");
if (endIndex !== -1) bodyHtml = bodyHtml.slice(0, endIndex);

bodyHtml = bodyHtml.replace(/<\?php[\s\S]*?\?>/g, "");
bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, "");
bodyHtml = bodyHtml.replace(/class="/g, 'className="');
bodyHtml = bodyHtml.replace(/href="([^"]+)\.php"/g, 'href="/$1"');

const jsxContent = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst ${componentName} = () => {\n  return (\n    <>\n${bodyHtml}\n    </>\n  );\n};\n\nexport default ${componentName};`;

fs.writeFileSync(jsxFile, jsxContent);

// Fix links to Links
let fixed = fs.readFileSync(jsxFile, "utf8");
fixed = fixed.replace(/<a href="\/([^"]+)">/g, '<Link to="/$1">');
fixed = fixed.replace(/<\/a>/g, "</Link>");
// Fix dashboard to admin-dashboard
fixed = fixed.replace(/\/dashboard/g, "/admin-dashboard");

fs.writeFileSync(jsxFile, fixed);
console.log("Migrated PrivacyPolicyPage");
