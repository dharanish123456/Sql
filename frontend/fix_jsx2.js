const fs = require("fs");

const jsxFile =
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/TodoPage.jsx";
let content = fs.readFileSync(jsxFile, "utf8");

// Replace footer
content = content.replace(/<div className="footer[\s\S]*?<\/div>/g, "");

// The error was an extra </div> after the footer (which closed page-wrapper)
// Let's find exactly the spot around line 997.
content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="modal fade" id="add_todo">/g,
  '</div>\n\t\t<div className="modal fade" id="add_todo">',
);

// The bottom of the file has extra closing tags
content = content.replace(/<\/div>\s*<\/body>\s*<\/html>/g, "");

// Also clean up any loose </div> right before export
content = content.replace(
  /<\/div>\s*<\/>\s*\);\s*};\s*export default TodoPage;/g,
  "</>\n  );\n};\nexport default TodoPage;",
);

fs.writeFileSync(jsxFile, content);
console.log("Fixed tags");
