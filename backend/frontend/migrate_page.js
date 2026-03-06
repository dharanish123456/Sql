const fs = require("fs");
const path = require("path");

const fileBase = process.argv[2] || "subscription";
const componentName = process.argv[3] || "SubscriptionPage";

const phpFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/${fileBase}.php`,
);
const jsxFile = path.resolve(
  `C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/${componentName}.jsx`,
);

let content = fs.readFileSync(phpFile, "utf8");

// The main layout wrapper is `<div class="content">`.
const startMatch = content.match(/<div class="content(?:| [^"]*)">/);
if (!startMatch) {
  console.error("Could not find .content div");
  process.exit(1);
}

const startIndex = startMatch.index;
let bodyHtml = content.slice(startIndex);

const endIndex = bodyHtml.indexOf("<!-- end main wrapper-->");
if (endIndex !== -1) {
  bodyHtml = bodyHtml.slice(0, endIndex);
}

// remove php
bodyHtml = bodyHtml.replace(/<\?php[\s\S]*?\?>/g, "");

// remove comments
bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, "");

// Convert common HTML attributes to JSX
bodyHtml = bodyHtml.replace(/class="/g, 'className="');
bodyHtml = bodyHtml.replace(/for="/g, 'htmlFor="');
bodyHtml = bodyHtml.replace(/colspan="/gi, 'colSpan="');
bodyHtml = bodyHtml.replace(/rowspan="/gi, 'rowSpan="');
bodyHtml = bodyHtml.replace(/tabindex="/gi, 'tabIndex="');
bodyHtml = bodyHtml.replace(/maxlength="/gi, 'maxLength="');
bodyHtml = bodyHtml.replace(/autocomplete="/gi, 'autoComplete="');

// Fix self closing tags
["img", "input", "br", "hr", "link", "meta"].forEach((tag) => {
  const regex = new RegExp(`<${tag}([^>]*?)>`, "g");
  bodyHtml = bodyHtml.replace(regex, (match, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<${tag}${attrs} />`;
  });
});

bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
  const stylesObj = {};
  styleString.split(";").forEach((style) => {
    if (!style.trim()) return;
    const parts = style.split(":");
    if (parts.length >= 2) {
      const key = parts[0]
        .trim()
        .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const value = parts.slice(1).join(":").trim();
      stylesObj[key] = value;
    }
  });
  return `style={${JSON.stringify(stylesObj)}}`;
});

const jsxContent = `import React from 'react';\n\nconst ${componentName} = () => {\n  return (\n    <>\n${bodyHtml}\n    </>\n  );\n};\n\nexport default ${componentName};\n`;

fs.writeFileSync(jsxFile, jsxContent);
console.log(`✅ Generated ${componentName}.jsx successfully!`);
