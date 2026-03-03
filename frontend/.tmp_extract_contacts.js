const fs = require("fs");
const path = require("path");

const phpFile = path.join(__dirname, "..", "contacts.php");
const outputFile = path.join(
  __dirname,
  "src",
  "pages",
  "admin",
  "ContactsPage.jsx",
);

let content = fs.readFileSync(phpFile, "utf8");

// Extract content between <div class="content"> and <!-- end main wrapper-->
const startMatch = content.match(/<div class="content">/);
const endMatch = content.lastIndexOf("<!-- end main wrapper-->");

if (startMatch && endMatch !== -1) {
  let extracted = content.substring(startMatch.index, endMatch);

  // Basic transformations
  extracted = extracted.replace(/class=/g, "className=");
  extracted = extracted.replace(/for=/g, "htmlFor=");

  // Self-closing tags
  const selfClosingTags = ["img", "input", "br", "hr", "link", "meta"];
  selfClosingTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}([^>]*[^/])>`, "gi");
    extracted = extracted.replace(regex, `<${tag}$1 />`);
  });

  // Replace HTML comments with JSX comments
  extracted = extracted.replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}");

  // Handle inline styles
  extracted = extracted.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1
      .split(";")
      .filter((s) => s.trim())
      .reduce((acc, curr) => {
        const [prop, val] = curr.split(":");
        if (prop && val) {
          const camelProp = prop
            .trim()
            .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          acc[camelProp] = val.trim();
        }
        return acc;
      }, {});
    return `style={${JSON.stringify(styleObj)}}`;
  });

  const component = `import React from 'react';

const ContactsPage = () => {
    return (
        <>
            ${extracted}
        </>
    );
};

export default ContactsPage;
`;

  fs.writeFileSync(outputFile, component);
  console.log("Successfully migrated contacts.php to ContactsPage.jsx");
} else {
  // Try other end match
  const altEndMatch = content.lastIndexOf("<!-- /Page Wrapper -->");
  if (startMatch && altEndMatch !== -1) {
    // ... same logic if needed, but usually one works.
    // Let's just use a more robust end match if first one fails.
  }
  console.error("Could not find start or end of content");
}
