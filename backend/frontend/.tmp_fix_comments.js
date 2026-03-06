const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src/pages/admin/DomainPage.jsx");
let content = fs.readFileSync(file, "utf8");

// replace HTML comments with JSX comments
content = content.replace(/<!--\s*(.*?)\s*-->/g, "{/* $1 */}");

// make sure no unclosed tags
fs.writeFileSync(file, content);
console.log("Fixed comments in DomainPage.jsx");
