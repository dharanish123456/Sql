const fs = require("fs");
const path = require("path");

const filesToMigrate = [
  { php: "invoices.php", jsx: "InvoicesPage.jsx", component: "InvoicesPage" },
  {
    php: "invoice-settings.php",
    jsx: "InvoiceSettingsPage.jsx",
    component: "InvoiceSettingsPage",
  },
  {
    php: "invoice-report.php",
    jsx: "InvoiceReportPage.jsx",
    component: "InvoiceReportPage",
  },
  {
    php: "invoice-details.php",
    jsx: "InvoiceDetailsPage.jsx",
    component: "InvoiceDetailsPage",
  },
  { php: "invoice.php", jsx: "InvoicePage.jsx", component: "InvoicePage" },
];

function cleanJSX(html) {
  if (!html) return "";
  let jsx = html.trim();
  jsx = jsx.replace(/<\?php[\s\S]*?\?>/g, ""); // Remove PHP tags

  // Fix image paths first
  jsx = jsx.replace(/src="assets\//g, 'src="/assets/');

  jsx = jsx.replace(/class=/g, "className=");
  jsx = jsx.replace(/for=/g, "htmlFor=");
  jsx = jsx.replace(/value=/g, "defaultValue="); // Basic fix for value attribute
  jsx = jsx.replace(/onclick=/g, "onClick=");
  jsx = jsx.replace(/selected/g, "defaultValue"); // Fix select option selected

  // Fix self-closing tags
  const selfClosingTags = ["img", "input", "br", "hr", "link", "meta"];
  selfClosingTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!\/)>`, "gi");
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  });

  // Convert inline styles to React style objects
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleStr) => {
    const styleObj = styleStr
      .split(";")
      .filter((s) => s.trim())
      .reduce((acc, style) => {
        const separatorIndex = style.indexOf(":");
        if (separatorIndex === -1) return acc;
        const key = style.substring(0, separatorIndex).trim();
        const value = style.substring(separatorIndex + 1).trim();
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = value;
        return acc;
      }, {});
    return `style={${JSON.stringify(styleObj)}}`;
  });

  // Replace <a> with <Link>
  jsx = jsx.replace(/<a /g, "<Link ");
  jsx = jsx.replace(/<\/a>/g, "<\/Link>");

  // Replace href with to in Link tags
  jsx = jsx.replace(/<Link ([^>]*?)href="([^"]*)"/g, (match, before, href) => {
    let toValue = href;
    if (href.endsWith(".php")) {
      toValue = "/" + href.replace(".php", "");
    } else if (
      href === "#" ||
      href === "javascript:void(0);" ||
      href.startsWith("#")
    ) {
      toValue = "#";
    }
    return `<Link ${before}to="${toValue}"`;
  });

  // Fix comments
  jsx = jsx.replace(/<!--/g, "{/*").replace(/-->/g, "*/}");

  return jsx;
}

filesToMigrate.forEach((file) => {
  const filePath = path.join(__dirname, "../", file.php);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file.php}`);
    return;
  }
  let fullContent = fs.readFileSync(filePath, "utf8");

  // Extract the content inside <div class="content">
  let mainContent = "";
  const startOfContentStr = '<div class="content">';
  const startOfContent = fullContent.indexOf(startOfContentStr);

  if (startOfContent !== -1) {
    let part = fullContent.substring(startOfContent + startOfContentStr.length);

    // Find the END of the content div. We'll look for the first </div> that is followed by a footer or the end of page-wrapper.
    // Or simply, we'll look for the footer boundary and then backtrack one </div>.

    const footerMarkers = [
      "<?php include('inc/footer.php'); ?>",
      '<?php include_once("inc/footer.php"); ?>',
      "<!-- Footer -->",
      '<div class="footer',
    ];

    let endBoundary = -1;
    for (const marker of footerMarkers) {
      endBoundary = part.indexOf(marker);
      if (endBoundary !== -1) break;
    }

    if (endBoundary === -1) {
      endBoundary = part.indexOf("<!-- /Page Wrapper -->");
    }

    if (endBoundary !== -1) {
      mainContent = part.substring(0, endBoundary).trim();
      // The content div closing tag is almost certainly the last </div> in mainContent now.
      if (mainContent.endsWith("</div>")) {
        mainContent = mainContent
          .substring(0, mainContent.lastIndexOf("</div>"))
          .trim();
      }
    } else {
      // If no footer found, grab until the end but try to remove wrapper closings
      mainContent = part.trim();
      // This is risky, but let's try to remove up to 3 trailing </div>s if they seem to be wrapper closings
      for (let i = 0; i < 3; i++) {
        if (mainContent.endsWith("</div>")) {
          mainContent = mainContent
            .substring(0, mainContent.lastIndexOf("</div>"))
            .trim();
        }
      }
    }
  }

  // Extract modals - everything between footer and js include
  let modals = "";
  const footerMarkers = [
    "<?php include('inc/footer.php'); ?>",
    '<?php include_once("inc/footer.php"); ?>',
    "<!-- /Footer -->",
    "</div>\n\t\t\t<!-- /Footer -->", // Specific for inline footer
  ];

  let footerEnd = -1;
  for (const marker of footerMarkers) {
    const pos = fullContent.indexOf(marker);
    if (pos !== -1) {
      footerEnd = pos + marker.length;
      break;
    }
  }

  const jsInclude = "<?php include('inc/js.php'); ?>";
  const jsPos = fullContent.indexOf(jsInclude);

  if (footerEnd !== -1 && jsPos !== -1 && jsPos > footerEnd) {
    modals = fullContent.substring(footerEnd, jsPos).trim();
    // Remove wrapper closing tags
    modals = modals.replace(/<\/div>\s*<\/div>\s*<!-- \/Page Wrapper -->/g, "");
    modals = modals.replace(/<\/div>\s*<!-- \/Main Wrapper -->/g, "");
    modals = modals.replace(/<\/div>\s*<\/div>\s*<\/body>/g, "");
    // Remove trailing divs and comments
    while (modals.endsWith("</div>") || modals.match(/\{?\/\*.*?\*\/\}?$/)) {
      modals = modals.trim();
      if (modals.endsWith("</div>"))
        modals = modals.substring(0, modals.lastIndexOf("</div>")).trim();
      else break;
    }
  } else if (jsPos !== -1) {
    // Fallback for files with lots of trailing wrapper divs
    // We'll look for common modal patterns like <div class="modal ...
  }

  const cleanedMainContent = cleanJSX(mainContent);
  const cleanedModals = cleanJSX(modals);

  const finalContent = `import React from "react";
import { Link } from "react-router-dom";

const ${file.component} = () => {
  return (
    <>
      <div className="content">
        ${cleanedMainContent.trim()}
      </div>

      ${cleanedModals.trim()}
    </>
  );
};

export default ${file.component};
`;

  fs.writeFileSync(
    path.join(__dirname, "src/pages/admin/", file.jsx),
    finalContent,
  );
  console.log(`${file.jsx} generated`);
});
