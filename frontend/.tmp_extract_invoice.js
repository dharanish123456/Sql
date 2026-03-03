const fs = require("fs");

const phpFile = "C:/Users/rambo/Music/erp.svlprinters.in/invoice.php";
const jsxFile =
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/InvoicesPage.jsx";

let phpContent = fs.readFileSync(phpFile, "utf8");

const startPageWrapper = phpContent.indexOf("<!-- Page Wrapper -->");
const endPageWrapper = phpContent.indexOf("<!-- /Main Wrapper -->");
let htmlContent = phpContent.substring(
  phpContent.indexOf('<div class="content">'),
  endPageWrapper,
);

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

// Remove extra closing div since we only replaced up to <div class="content"> instead of page-wrapper
jsxContent = jsxContent.replace(
  /<\/div>\s*<\/div>\s*<div className="modal fade" id="delete_modal">/g,
  '</div>\n\t\t<div className="modal fade" id="delete_modal">',
);

const componentStr = `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvoicesPage = () => {
    return (
        <React.Fragment>
            ${jsxContent}
        </React.Fragment>
    );
};

export default InvoicesPage;
`;

fs.writeFileSync(jsxFile, componentStr);
console.log("InvoicesPage.jsx generated successfully.");
