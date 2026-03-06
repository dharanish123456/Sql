const fs = require("fs");
const path = require("path");

const phpFile = path.join(__dirname, "../domain.php");
let content = fs.readFileSync(phpFile, "utf8");

// Extract between <div className="content"> inside <!-- Page Wrapper --> and <!-- /Delete Modal -->
const startMarker = '<div class="content">';
const endMarker = "<!-- /Delete Modal -->";
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  let extracted = content.substring(startIndex, endIndex);

  // Remove PHP tags (if any remaining in that block)
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

  // Wrap in standard component structure
  const reactComponent = `import React from 'react';
import { Link } from 'react-router-dom';

const DomainPage = () => {
    return (
        <>
            ${extracted}
        </>
    );
};

export default DomainPage;
`;

  fs.writeFileSync(
    path.join(__dirname, "src/pages/admin/DomainPage.jsx"),
    reactComponent,
  );
  console.log("Successfully extracted and converted DomainPage!");
} else {
  console.log("Markers not found!");
}
