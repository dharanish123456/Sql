const fs = require("fs");
const path = require("path");

const fileBase = "leave-settings";
const componentName = "LeaveSettingsPage";

const phpFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/${fileBase}.php`,
);
const jsxFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/${componentName}.jsx`,
);

let content = fs.readFileSync(phpFile, "utf8");

// Extract content from .content div
let startMatch = content.match(/<div class="content(?:| [^"]*)">/);
if (!startMatch) {
  console.error("Could not find .content div");
  process.exit(1);
}
const startIndex = startMatch.index;
let bodyHtml = content.slice(startIndex);

// Remove footer
bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?(?:include|require)[\s\S]*?footer\.php[\s\S]*?\?>/g,
  "",
);

// Remove all PHP blocks
bodyHtml = bodyHtml.replace(/<\?php[\s\S]*?\?>/g, "");

// Remove comments
bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, "");

// Remove script tags
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");

// Stop at body/html end
const bodyEnd = bodyHtml.toLowerCase().indexOf("</body>");
if (bodyEnd !== -1) {
  bodyHtml = bodyHtml.slice(0, bodyEnd);
}

// HTML to JSX conversions
bodyHtml = bodyHtml.replace(/class="/g, 'className="');
bodyHtml = bodyHtml.replace(/for="/g, 'htmlFor="');
bodyHtml = bodyHtml.replace(/colspan="/gi, 'colSpan="');
bodyHtml = bodyHtml.replace(/rowspan="/gi, 'rowSpan="');
bodyHtml = bodyHtml.replace(/value="([^"]*)"/g, 'defaultValue="$1"');

// Fix self-closing tags
bodyHtml = bodyHtml.replace(
  /<(img|input|br|hr)([^>]*?)>/g,
  (match, tag, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<${tag}${attrs} />`;
  },
);

// Style conversion
bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
  const stylesObj = {};
  styleString.split(";").forEach((style) => {
    const parts = style.split(":");
    if (parts.length >= 2) {
      let key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const value = parts.slice(1).join(":").trim();
      stylesObj[key] = value;
    }
  });
  return `style={${JSON.stringify(stylesObj)}}`;
});

// Update links
bodyHtml = bodyHtml.replace(/href="([^"]+)\.php"/g, (match, p1) => {
  return `href="/${p1}"`;
});

const jsxContent = [
  "import React from 'react';",
  "import { Link } from 'react-router-dom';",
  "",
  `const ${componentName} = () => {`,
  "  return (",
  "    <>",
  bodyHtml,
  "    </>",
  "  );",
  "};",
  "",
  `export default ${componentName};`,
].join("\n");

fs.writeFileSync(jsxFile, jsxContent);
console.log(`✅ Generated ${componentName}.jsx successfully!`);
