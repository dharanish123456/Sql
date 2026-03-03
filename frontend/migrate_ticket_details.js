const fs = require("fs");
const path = require("path");

const fileBase = "ticket-details";
const componentName = "TicketDetailsPage";

const phpFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/${fileBase}.php`,
);
const jsxFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/${componentName}.jsx`,
);

let content = fs.readFileSync(phpFile, "utf8");

let startMatch = content.match(/<div class="content(?:| [^"]*)">/);
if (!startMatch) {
  console.error("Could not find .content div");
  process.exit(1);
}
const startIndex = startMatch.index;
let bodyHtml = content.slice(startIndex);

// Remove footer and script includes
bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?(?:include|require)[\s\S]*?(?:footer|js)\.php[\s\S]*?\?>/g,
  "",
);

// Find the last </div> before </body> or end of file
const lastDivIndex = bodyHtml.lastIndexOf("</div>");
if (lastDivIndex !== -1) {
  // We want to keep the closing divs of the content and any outer wrappers we captured
  // In these PHP files, usually it's <div class="content"> ... </div> (content)
  // </div> (page-wrapper)
  // </div> (main-wrapper)
  // So we need to be careful.

  // Instead of lastIndexOf, let's look for a marker or just slice until we see script tags
  const scriptIndex = bodyHtml.toLowerCase().indexOf("<script");
  if (scriptIndex !== -1) {
    bodyHtml = bodyHtml.slice(0, scriptIndex);
  }
}

// remove all php blocks
bodyHtml = bodyHtml.replace(/<\?php[\s\S]*?\?>/g, "");
// remove comment blocks
bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, "");
// remove tags like </body> </html>
bodyHtml = bodyHtml.replace(/<\/(body|html)>/gi, "");

// Convert common HTML attributes to JSX
bodyHtml = bodyHtml.replace(/class="/g, 'className="');
bodyHtml = bodyHtml.replace(/for="/g, 'htmlFor="');
bodyHtml = bodyHtml.replace(/colspan="/gi, 'colSpan="');
bodyHtml = bodyHtml.replace(/rowspan="/gi, 'rowSpan="');
bodyHtml = bodyHtml.replace(/tabindex="/gi, 'tabIndex="');
bodyHtml = bodyHtml.replace(/maxlength="/gi, 'maxLength="');
bodyHtml = bodyHtml.replace(/autocomplete="/gi, 'autoComplete="');
bodyHtml = bodyHtml.replace(/readonly="/gi, 'readOnly="');
bodyHtml = bodyHtml.replace(/value=""/g, 'defaultValue=""');
bodyHtml = bodyHtml.replace(/value="([^"]*)"/g, 'defaultValue="$1"');

// Fix self-closing tags
bodyHtml = bodyHtml.replace(
  /<(img|input|br|hr)([^>]*?)>/g,
  (match, tag, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<${tag}${attrs} />`;
  },
);

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

// Fix links
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
