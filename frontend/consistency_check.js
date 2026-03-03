const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/EmployeeDetailsPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Fix mismatched tags like <a>...</Link>
content = content.replace(/<a([^>]*?)>([\s\S]*?)<\/Link>/g, "<a$1>$2</a>");
content = content.replace(
  /<Link([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link$1>$2</Link>",
);

// Fix form-select defaultValue for select tags that have options with selected attribute
content = content.replace(
  /<select className="form-select"([^>]*)>([\s\S]*?)<option selected(?:|="selected")>([\s\S]*?)<\/option>/g,
  (match, rest, options, selectedText) => {
    return `<select className="form-select"${rest} defaultValue="${selectedText.trim()}">${options}<option value="${selectedText.trim()}">${selectedText}</option>`;
  },
);

// Final check on Link tags
content = content.replace(
  /<Link to="\/([^"]+)">([\s\S]*?)<\/a>/g,
  '<Link to="/$1">$2</Link>',
);

fs.writeFileSync(jsxFile, content);
console.log("Consistency check done on EmployeeDetailsPage.jsx");
