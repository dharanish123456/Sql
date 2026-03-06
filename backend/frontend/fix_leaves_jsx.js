const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/LeavesPage.jsx",
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

// Convert all remaining .php hrefs to Link
content = content.replace(/<a href="\/([^"]+)">/g, (match, p1) => {
  if (p1.startsWith("javascript") || p1 === "#") return match;
  return `<Link to="/${p1}">`;
});
// Also handle </a> to </Link> for these
content = content.replace(
  /<Link to="\/([^"]+)">([\s\S]*?)<\/a>/g,
  '<Link to="/$1">$2</Link>',
);

// Fix select class
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);

// Fix unclosed input/img tags missed
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});
content = content.replace(/<img([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<img${attrs} />`;
});

// Final check on Link tags that might still have </a>
content = content.replace(
  /<Link ([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link $1>$2</Link>",
);

fs.writeFileSync(jsxFile, content);
console.log("Fixed LeavesPage.jsx");
