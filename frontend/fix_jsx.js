const fs = require("fs");

const jsxFile =
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/EmailPage.jsx";
let content = fs.readFileSync(jsxFile, "utf8");

// Replace HTML comments with JSX comments or remove them
content = content.replace(/<!--[\s\S]*?-->/g, "");

// Fix any unclosed input tags (especially those spanning multiple lines)
// We look for <input ... > and replace > with /> if not already />
content = content.replace(/<input([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});

// Same for img tags
content = content.replace(/<img([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<img${attrs} />`;
});

// And br, hr
content = content.replace(/<br([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<br${attrs} />`;
});
content = content.replace(/<hr([\s\S]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<hr${attrs} />`;
});

fs.writeFileSync(jsxFile, content);
console.log("Fixed tags and comments");
