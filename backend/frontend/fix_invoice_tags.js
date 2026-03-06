const fs = require("fs");

const jsxFile =
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/InvoicesPage.jsx";
let content = fs.readFileSync(jsxFile, "utf8");

// remove the extra </div> closing page-wrapper and main-wrapper
// Let's just find them by index at the end of the file.

content = content.replace(
  /<\/div>\s*<div className="modal fade" id="delete_modal">/,
  '<div className="modal fade" id="delete_modal">',
);
content = content.replace(/<\/div>\s*<\/React\.Fragment>/, "</React.Fragment>");

// Also remove footer if desired
content = content.replace(/<div className="footer[\s\S]*?<\/div>/g, "");

fs.writeFileSync(jsxFile, content);
console.log("Fixed InvoicesPage.jsx tags");
