const fs = require("fs");
const path = require("path");

const phpFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/email.php",
);
const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/EmailPage.jsx",
);

let content = fs.readFileSync(phpFile, "utf8");

// Extract everything inside <div class="page-wrapper"> ... </div>
// But we should stop before <!-- /Page Wrapper --> and the compose mail might be outside or inside?
// Let's just find the start: <div class="content p-0">
// and the end: everything before <!-- /Main Wrapper --> except the footer.

const startIndex = content.indexOf('<div class="content p-0">');
// we need to include Compose mail which starts with <!-- Compose Mail -->
// Let's find <!-- /Compose Mail -->
const endIndex =
  content.indexOf("<!-- /Compose Mail -->") + "<!-- /Compose Mail -->".length;

let bodyHtml = content.slice(startIndex, endIndex);

// Remove the <?php include('inc/footer.php'); ?>
bodyHtml = bodyHtml.replace(
  /<\?php[\s\S]*?include\('inc\/footer\.php'\);[\s\S]*?\?>/g,
  "",
);

// Convert common HTML attributes to JSX
bodyHtml = bodyHtml.replace(/class="/g, 'className="');
bodyHtml = bodyHtml.replace(/for="/g, 'htmlFor="');
bodyHtml = bodyHtml.replace(/colspan="/gi, 'colSpan="');
bodyHtml = bodyHtml.replace(/rowspan="/gi, 'rowSpan="');
bodyHtml = bodyHtml.replace(/tabindex="/gi, 'tabIndex="');
bodyHtml = bodyHtml.replace(/maxlength="/gi, 'maxLength="');
bodyHtml = bodyHtml.replace(/autocomplete="/gi, 'autoComplete="');

// Fix self-closing tags
bodyHtml = bodyHtml.replace(/<img(.*?)>/g, (match, attrs) => {
  if (attrs.endsWith("/")) return match;
  return `<img${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<input(.*?)>/g, (match, attrs) => {
  if (attrs.endsWith("/")) return match;
  return `<input${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<br(.*?)>/g, (match, attrs) => {
  if (attrs.endsWith("/")) return match;
  return `<br${attrs} />`;
});
bodyHtml = bodyHtml.replace(/<hr(.*?)>/g, (match, attrs) => {
  if (attrs.endsWith("/")) return match;
  return `<hr${attrs} />`;
});

// data-bs-target and data-bs-toggle are fine.
// style attributes if any (inline strings -> objects... this might be hard, hope there's none or we can manually fix it).
// wait, style="width: 100%" -> style={{width: '100%'}}
bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
  const stylesObj = {};
  styleString.split(";").forEach((style) => {
    const parts = style.split(":");
    if (parts.length === 2) {
      let key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const value = parts[1].trim();
      stylesObj[key] = value;
    }
  });
  return `style={${JSON.stringify(stylesObj)}}`;
});

const jsxContent = `import React from 'react';

const EmailPage = () => {
  return (
    <>
      ${bodyHtml}
    </>
  );
};

export default EmailPage;
`;

fs.writeFileSync(jsxFile, jsxContent);
console.log("✅ Generated EmailPage.jsx successfully!");
