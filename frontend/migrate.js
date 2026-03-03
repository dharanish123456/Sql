const fs = require("fs");
const path = require("path");

const fileBase = "file-manager";
const componentName = "FileManagerPage";

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

bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?(?:include|require)[\s\S]*?footer\.php[\s\S]*?\?>/g,
  "",
);

const endIndex = bodyHtml.indexOf("<!-- end main wrapper-->");
if (endIndex !== -1) {
  bodyHtml = bodyHtml.slice(0, endIndex);
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

// Fix self-closing tags
bodyHtml = bodyHtml.replace(/<img([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<img${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<input([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<br([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<br${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<hr([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<hr${attrs} />`;
});

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

const jsxContent = [
  "import React from 'react';",
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
