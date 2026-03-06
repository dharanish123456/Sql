const fs = require("fs");
const path = require("path");

const phpFile = path.join(__dirname, "../clients.php");
let content = fs.readFileSync(phpFile, "utf8");

// Extract between <div class="content"> and <!-- /Delete Modal -->
// Note: In clients.php, the end of the content bit is usually before the last modal or script tag.
const startMarker = '<div class="content">';
const endMarker = "<!-- /Delete Modal -->";
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  let extracted = content.substring(startIndex, endIndex);

  // Remove PHP tags
  extracted = extracted.replace(/<\?php[\s\S]*?\?>/g, "");

  // Replace class= with className=
  extracted = extracted.replace(/class="/g, 'className="');
  extracted = extracted.replace(/for="/g, 'htmlFor="');

  // Make inputs self-closing
  extracted = extracted.replace(/<input([^>]*?[^\/])>/g, "<input$1 />");

  // Make img self-closing
  extracted = extracted.replace(/<img([^>]*?[^\/])>/g, "<img$1 />");

  // Fix <br> tags
  extracted = extracted.replace(/<br>/g, "<br />");

  // Fix <hr> tags
  extracted = extracted.replace(/<hr>/g, "<hr />");

  // Replace HTML comments with JSX comments
  extracted = extracted.replace(/<!--\s*(.*?)\s*-->/g, "{/* $1 */}");

  // Wrap in standard component structure
  const reactComponent = `import React from 'react';
import { Link } from 'react-router-dom';

const ClientsPage = () => {
    return (
        <>
            ${extracted}
        </>
    );
};

export default ClientsPage;
`;

  const targetPath = path.join(__dirname, "src/pages/admin/ClientsPage.jsx");
  fs.writeFileSync(targetPath, reactComponent);
  console.log("Successfully extracted and converted ClientsPage!");
} else {
  console.log("Markers not found!");
}
