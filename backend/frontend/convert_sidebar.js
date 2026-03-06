const fs = require("fs");

function migrateSidebarPaths() {
  const sidebarPath = "src/components/layout/Sidebar.jsx";
  let content = fs.readFileSync(sidebarPath, "utf8");

  // Replace links like "admin-dashboard.php" -> "/admin-dashboard"
  // Actually the PHP files are mostly like "admin-dashboard.php", "employee-dashboard.php"
  // Wait, let's see how they are defined in adminPhpRoutes.js

  content = content.replace(/href="([^"]+?)\.php"/g, 'href="/$1"');

  fs.writeFileSync(sidebarPath, content);
  console.log("Migrated Sidebar links");
}

migrateSidebarPaths();
