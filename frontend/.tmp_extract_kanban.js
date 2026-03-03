const fs = require("fs");

const phpFile = "C:/Users/rambo/Music/erp.svlprinters.in/kanban-view.php";
const jsxFile =
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/KanbanViewPage.jsx";

let phpContent = fs.readFileSync(phpFile, "utf8");

// Find start and end of content
const startIdx = phpContent.indexOf('<div class="content">');
const endIdx = phpContent.indexOf("<!-- /Page Wrapper -->");

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries");
  process.exit(1);
}

// Extract HTML
// Actually we only want until the end of the <div class="page-wrapper"> which ends right before <!-- /Page Wrapper -->
// But let's find the exact end of <div class="content">.
// Actually, it's easier to just extract everything between <div class="content"> and the end of the file, then remove the unwanted parts. Or we can just include the modal as well, since it's useful.
// Let's get everything inside page-wrapper.
const startPageWrapper = phpContent.indexOf("<!-- Page Wrapper -->");
const endPageWrapper = phpContent.indexOf("<!-- /Main Wrapper -->");
let htmlContent = phpContent.substring(
  phpContent.indexOf('<div class="content">'),
  endPageWrapper,
);

// We want to skip the footer and include the delete modal correctly.
// Also we need to wrap the whole thing in a <> fragment </>.

// basic conversions
let jsxContent = htmlContent
  .replace(/class=/g, "className=")
  .replace(/for=/g, "htmlFor=")
  .replace(/tabindex=/g, "tabIndex=")
  .replace(/<!--[\s\S]*?-->/g, "") // remove HTML comments
  // fix inputs
  .replace(/<input([^>]*?)>/g, (match, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<input${attrs} />`;
  })
  // fix imgs
  .replace(/<img([^>]*?)>/g, (match, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<img${attrs} />`;
  })
  // fix br, hr
  .replace(/<br([^>]*?)>/g, (match, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<br${attrs} />`;
  })
  .replace(/<hr([^>]*?)>/g, (match, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<hr${attrs} />`;
  })
  // fix inline styles
  .replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(";").forEach((rule) => {
      const [key, value] = rule.split(":");
      if (key && value) {
        const camelKey = key
          .trim()
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[camelKey] = value.trim();
      }
    });
    return `style={{${Object.entries(styleObj)
      .map(([k, v]) => `${k}: "${v}"`)
      .join(", ")}}}`;
  });

// Also remove <?php ... ?> tags
jsxContent = jsxContent.replace(/<\?php[\s\S]*?\?>/g, "");
// And Javascript:void(0) to #
jsxContent = jsxContent.replace(/javascript:void\(0\);/g, "#");

const componentStr = `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const KanbanViewPage = () => {
    return (
        <React.Fragment>
            ${jsxContent}
        </React.Fragment>
    );
};

export default KanbanViewPage;
`;

fs.writeFileSync(jsxFile, componentStr);
console.log("KanbanViewPage.jsx generated successfully.");
