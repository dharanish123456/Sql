const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/DepartmentsPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Replace .php links with React Router's Link or #
// 16: 									<a href="admin-dashboard.php"><i className="ti ti-smart-home"></i></a>
content = content.replace(/href="([^"]+)\.php"/g, (match, p1) => {
  return `href="/${p1}"`;
});

// Update <a> to Link for internal routes if needed, but for now just fix the href
// Actually let's use Link for the breadcrumb at least
content = content.replace(
  /<a href="\/admin-dashboard">/g,
  '<Link to="/admin-dashboard">',
);
content = content.replace(
  /<\/a>(\s*)<\/li>(\s*)<\/ol>(\s*)<\/nav>/g,
  "</Link>$1</li>$2</ol>$3</nav>",
);
// Wait, the above might be too specific.

// Fix selected attribute
// <option selected>Active</option> -> <option defaultValue="Active">Active</option>
// Actually select should have defaultValue
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);
content = content.replace(
  /<option selected>([\s\S]*?)<\/option>/g,
  '<option selected defaultValue="$1">$1</option>',
);
// Most common React way is <select defaultValue="...">
content = content.replace(
  /<select className="([^"]*)"([^>]*)>([\s\S]*?)<option selected(?:|="selected")>([\s\S]*?)<\/option>/g,
  (match, cls, rest, options, selectedText) => {
    return `<select className="${cls}"${rest} defaultValue="${selectedText.trim()}">${options}<option value="${selectedText.trim()}">${selectedText}</option>`;
  },
);

// Fix value on inputs
content = content.replace(/value="([^"]*)"/g, 'defaultValue="$1"');

// Fix style object if any remains or was missed
// The migration script already handles it mostly.

// Remove any remaining <!-- comments -->
content = content.replace(/<!--[\s\S]*?-->/g, "");

fs.writeFileSync(jsxFile, content);
console.log("Fixed DepartmentsPage.jsx");
