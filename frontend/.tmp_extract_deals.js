const fs = require("fs");
const path = require("path");

function extractHtml(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const startMarker = '<div class="page-wrapper">';
  const endMarker = "<!-- /Page Wrapper -->";

  let startIndex = content.indexOf(startMarker);
  let endIndex = content.lastIndexOf(endMarker);

  if (startIndex === -1) {
    startIndex = content.indexOf('<div class="page-wrapper"');
  }

  if (startIndex !== -1 && endIndex !== -1) {
    let html = content.substring(startIndex, endIndex + endMarker.length);

    // Remove page-wrapper div wrapper as per user's preference in recent edits
    html = html.replace('<div class="page-wrapper">', "");
    html = html.replace("<!-- /Page Wrapper -->", "");
    // Find the last closing div of page-wrapper
    const lastDivIndex = html.lastIndexOf("</div>");
    if (lastDivIndex !== -1) {
      html = html.substring(0, lastDivIndex);
    }

    // Basic cleanup of PHP tags
    html = html.replace(/<\?php[\s\S]*?\?>/g, "");

    // HTML to JSX conversions
    html = html.replace(/class=/g, "className=");
    html = html.replace(/for=/g, "htmlFor=");
    html = html.replace(/tabindex=/g, "tabIndex=");
    html = html.replace(/onclick=/g, "onClick=");
    html = html.replace(/onchange=/g, "onChange=");
    html = html.replace(/autocomplete=/g, "autoComplete=");
    html = html.replace(/readonly=/g, "readOnly=");
    html = html.replace(/value=/g, "defaultValue=");
    html = html.replace(/checked/g, "defaultChecked");
    html = html.replace(/selected/g, "defaultSelected");

    // Self-closing tags
    const tags = ["img", "input", "br", "hr", "link", "meta"];
    tags.forEach((tag) => {
      const regex = new RegExp(`<${tag}([^>]*[^/])>`, "g");
      html = html.replace(regex, `<${tag}$1 />`);
    });

    // Add imports and component wrapper
    const componentName = "DealsPage";
    const fullComponent = `import React from "react";

const ${componentName} = () => {
    return (
        <>
            ${html}
        </>
    );
};

export default ${componentName};
`;
    return fullComponent;
  }
  return null;
}

const result = extractHtml(
  "c:\\Users\\rambo\\Music\\erp.svlprinters.in\\deals.php",
);
if (result) {
  fs.writeFileSync(
    "c:\\Users\\rambo\\Music\\erp.svlprinters.in\\frontend\\src\\pages\\admin\\DealsPage.jsx",
    result,
  );
  console.log("Migration successful: DealsPage.jsx created");
} else {
  console.log("Migration failed: could not find markers");
}
