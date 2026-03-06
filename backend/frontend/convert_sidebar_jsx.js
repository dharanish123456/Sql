const fs = require("fs");

const sidebarPath = "src/components/layout/Sidebar.jsx";
let content = fs.readFileSync(sidebarPath, "utf8");

// Extract the HTML string inside sidebarHtml
const match = content.match(/const sidebarHtml = `([\s\S]+?)`;/);
if (!match) {
  console.log("Could not find sidebarHtml string");
  process.exit(1);
}

let html = match[1];

// Convert HTML to JSX
// 1. Remove comments
html = html.replace(/<!--[\s\S]*?-->/g, "");

// 2. class -> className
html = html.replace(/\bclass="/g, 'className="');

// 3. self-closing tags (img, input, hr, br)
html = html.replace(/<img([^>]+?)(?<!\/)>/g, "<img$1 />");
html = html.replace(/<input([^>]+?)(?<!\/)>/g, "<input$1 />");
html = html.replace(/<hr([^>]*?)(?<!\/)>/g, "<hr$1 />");
html = html.replace(/<br([^>]*?)(?<!\/)>/g, "<br$1 />");

// 4. for -> htmlFor (if any)
html = html.replace(/\bfor="/g, 'htmlFor="');

// 5. Build new component
const newComponent = `import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { attachAdminNavigationHandlers } from "../../utils/adminNavigation";

export default function Sidebar() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return attachAdminNavigationHandlers(containerRef.current, navigate);
  }, [navigate, location.pathname]);

  return (
    <div ref={containerRef}>
      ${html}
    </div>
  );
}
`;

fs.writeFileSync(sidebarPath, newComponent);
console.log("Converted Sidebar.jsx to full React component");
