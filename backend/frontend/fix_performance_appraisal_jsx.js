const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/PerformanceAppraisalPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Fix breadcrumb link
content = content.replace(
  /<Link to="\/dashboard">/g,
  '<Link to="/admin-dashboard">',
);

// Convert all remaining .php hrefs to Link
content = content.replace(/<a href="\/([^"]+)">/g, (match, p1) => {
  if (p1.startsWith("javascript") || p1 === "#") return match;
  return `<Link to="/${p1}">`;
});

// Update closing tags for Link
content = content.replace(
  /<Link ([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link $1>$2</Link>",
);

// Fix select class
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);

// Fix unclosed tags
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});
content = content.replace(/<img([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<img${attrs} />`;
});

// Fix special characters
content = content.replace(/&times;/g, "×");

fs.writeFileSync(jsxFile, content);
console.log("Fixed PerformanceAppraisalPage.jsx");
