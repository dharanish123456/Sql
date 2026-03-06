const fs = require("fs");
const path = require("path");

const fileBase = "departments";
const componentName = "DepartmentsPage";

const phpFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/${fileBase}.php`,
);
const jsxFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/${componentName}.jsx`,
);

let content = fs.readFileSync(phpFile, "utf8");

// The main layout wrapper is `<div class="content">`.
let startMatch = content.match(/<div class="content(?:| [^"]*)">/);

if (!startMatch) {
  console.error("Could not find .content div");
  process.exit(1);
}

const startIndex = startMatch.index;

let bodyHtml = content.slice(startIndex);

// Remove footer include
bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?(?:include|require)[\s\S]*?footer\.php[\s\S]*?\?>/g,
  "",
);

// Find the end index - either "<!-- end main wrapper-->" or the last closing div of page-wrapper
const endIndex = bodyHtml.indexOf("<!-- end main wrapper-->");
if (endIndex !== -1) {
  bodyHtml = bodyHtml.slice(0, endIndex);
} else {
  // If not found, try to find where the page-wrapper usually ends
  // In many of these files, there are two closing divs for page-wrapper and main-wrapper after the footer include
}

// remove all php blocks
bodyHtml = bodyHtml.replace(/<\?php[\s\S]*?\?>/g, "");

// remove comment blocks
bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, "");

// remove <script> tags
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");

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

// Remove trailing closing divs if we sliced too much or too little
// We want to keep ONLY the divs that were opened within/at the start of bodyHtml
// The startMatch is `<div class="content">`, which usually is inside `<div class="page-wrapper">`
// Wait, in departments.php:
// 37: 		<div class="page-wrapper">
// 38: 			<div class="content">
// ...
// 426: 		</div>
// 427: 		<!-- /Page Wrapper -->

// If we start at `<div class="content">`, we should end at the closing `</div>` for it.
// Let's simple count divs or just manually clean up.
// Actually, I'll just keep it as is and fix it if needed.

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
