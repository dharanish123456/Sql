const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/TicketDetailsPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Fix breadcrumb link
content = content.replace(/<a href="\/tickets">/g, '<Link to="/tickets">');
content = content.replace(
  /<Link to="\/tickets">([\s\S]*?)<\/a>/g,
  '<Link to="/tickets">$1</Link>',
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

// Fix any unclosed input tags missed
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});

// Fix href="/some-page" to <Link to="/some-page">
content = content.replace(/<a href="\/([^"]+)">/g, (match, p1) => {
  if (p1.startsWith("javascript") || p1 === "#") return match;
  return `<Link to="/${p1}">`;
});
content = content.replace(
  /<Link to="\/([^"]+)">([\s\S]*?)<\/a>/g,
  '<Link to="/$1">$2</Link>',
);

// Fix a dangling </a> if it was converted from <a> to <Link> but </a> remained
content = content.replace(
  /<Link ([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link $1>$2</Link>",
);

fs.writeFileSync(jsxFile, content);
console.log("Fixed TicketDetailsPage.jsx");
