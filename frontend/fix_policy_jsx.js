const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/PolicyPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Fix breadcrumb link
content = content.replace(
  /<a href="\/dashboard">/g,
  '<Link to="/admin-dashboard">',
);
content = content.replace(
  /<Link to="\/admin-dashboard">([\s\S]*?)<\/a>/g,
  '<Link to="/admin-dashboard">$1</Link>',
);

// Fix select class and defaultValue
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);

// Fix select defaultValue for modals
content = content.replace(
  /<select className="form-select"([^>]*)>([\s\S]*?)<option selected(?:|="selected")>([\s\S]*?)<\/option>/g,
  (match, rest, options, selectedText) => {
    return `<select className="form-select"${rest} defaultValue="${selectedText.trim()}">${options}<option value="${selectedText.trim()}">${selectedText}</option>`;
  },
);

// Fix value on inputs
content = content.replace(/value="([^"]*)"/g, 'defaultValue="$1"');

// Fix textarea value to defaultValue
content = content.replace(
  /<textarea className="form-control">([\s\S]*?)<\/textarea>/g,
  '<textarea className="form-control" defaultValue="$1" />',
);

// Fix any unclosed input tags missed
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});

// Remove trailing closing divs if they are unbalanced
// The migration script might have captured too many or too few.
// Looking at the end of the file:
// 		</div>
// 	</div>
//
//     </>
//   );
// };

fs.writeFileSync(jsxFile, content);
console.log("Fixed PolicyPage.jsx");
