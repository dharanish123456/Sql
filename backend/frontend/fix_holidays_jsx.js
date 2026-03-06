const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/HolidaysPage.jsx",
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

// Fix and remove javascript:void(0) from <a> if it's not needed or convert to button if appropriate
// Actually, it's often used for modals. Let's keep them as <a> for now but ensure they don't break.

// Convert all remaining .php hrefs to Link (though migrate script already did /page)
// But it didn't convert <a> to <Link>
content = content.replace(/<a href="\/([^"]+)">/g, (match, p1) => {
  if (p1.startsWith("javascript") || p1 === "#") return match;
  return `<Link to="/${p1}">`;
});
content = content.replace(
  /<Link to="\/([^"]+)">([\s\S]*?)<\/a>/g,
  '<Link to="/$1">$2</Link>',
);

// Fix select class and defaultValue
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);

// Fix select defaultValue for modals (if any selected option exists)
content = content.replace(
  /<select className="form-select"([^>]*)>([\s\S]*?)<option selected(?:|="selected")>([\s\S]*?)<\/option>/g,
  (match, rest, options, selectedText) => {
    return `<select className="form-select"${rest} defaultValue="${selectedText.trim()}">${options}<option value="${selectedText.trim()}">${selectedText}</option>`;
  },
);

// Fix unclosed input tags missed
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});

// Final check on Link tags that might still have </a>
content = content.replace(
  /<Link ([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link $1>$2</Link>",
);

fs.writeFileSync(jsxFile, content);
console.log("Fixed HolidaysPage.jsx");
