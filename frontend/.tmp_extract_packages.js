const fs = require("fs");
const path = require("path");

const phpFile = path.join(__dirname, "../packages.php");
let content = fs.readFileSync(phpFile, "utf8");

// Extract between <!-- Page Wrapper --> and <!-- /Delete Modal -->
const startMarker = "<!-- Page Wrapper -->";
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

  // Fix some potentially unclosed tags (if any) or missing closing slashes

  // Wrap in standard component structure
  const reactComponent = `import React from 'react';
import { Link } from 'react-router-dom';

const PackagesPage = () => {
    return (
        ${extracted}
    );
};

export default PackagesPage;
`;

  fs.writeFileSync(
    path.join(__dirname, "src/pages/admin/PackagesPage.jsx"),
    reactComponent,
  );
  console.log("Successfully extracted and converted PackagesPage!");
} else {
  console.log("Markers not found!");
}
