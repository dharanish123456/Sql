const fs = require("fs");

const routesPath = "src/adminPhpRoutes.js";
let content = fs.readFileSync(routesPath, "utf8");

// The file contents look like:
// "path": "activity.php",
// "path": "admin/video-call.php",
// "path": "admin-dashboard", etc.

// We want to remove .php exactly, and maybe ensure it maps correctly if it had /admin/ prefix.
// Actually, earlier the user asked "If you want clean URLs (/admin-dashboard), I can migrate the route map and sidebar links in one pass.change it to react version"
// Let's strip '.php' from all paths.
content = content.replace(/"path":\s*"([^"]+)\.php"/g, '"path": "$1"');

// And if there are any duplicate paths created, the Map in App.jsx / Route mapping will just use the latest or we can leave them for now.
fs.writeFileSync(routesPath, content);
console.log("Fixed adminPhpRoutes.js to use clean URLs.");
