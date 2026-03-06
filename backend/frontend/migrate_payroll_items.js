const fs = require("fs");
const path = require("path");

const filesToMigrate = [
  { php: "payslip.php", jsx: "PayslipPage.jsx", component: "PayslipPage" },
  { php: "payroll.php", jsx: "PayrollPage.jsx", component: "PayrollPage" },
];

function cleanJSX(html) {
  if (!html) return "";
  let jsx = html.trim();
  jsx = jsx.replace(/<\?php[\s\S]*?\?>/g, ""); // Remove PHP tags

  // Fix image paths
  jsx = jsx.replace(/src="assets\//g, 'src="/assets/');

  jsx = jsx.replace(/class=/g, "className=");
  jsx = jsx.replace(/for=/g, "htmlFor=");
  jsx = jsx.replace(/value=/g, "defaultValue=");
  jsx = jsx.replace(/onclick=/g, "onClick=");
  jsx = jsx.replace(/selected/g, "defaultValue");
  jsx = jsx.replace(/checked=""/g, "defaultChecked");
  jsx = jsx.replace(/checked/g, "defaultChecked");

  // Fix self-closing tags
  const selfClosingTags = ["img", "input", "br", "hr", "link", "meta"];
  selfClosingTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!\/)>`, "gi");
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  });

  // Convert inline styles
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

  // Replace href with to
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

  // Extract content
  let mainContent = "";
  const startOfContentStr = '<div class="content">';
  const startOfContent = fullContent.indexOf(startOfContentStr);

  if (startOfContent !== -1) {
    let part = fullContent.substring(startOfContent + startOfContentStr.length);
    const footerMarkers = [
      '<div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">',
      '<div class="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">',
      "<?php include('inc/footer.php'); ?>",
      '<?php include_once("inc/footer.php"); ?>',
      "<!-- /Page Wrapper -->",
    ];

    let endBoundary = -1;
    for (const marker of footerMarkers) {
      endBoundary = part.indexOf(marker);
      if (endBoundary !== -1) break;
    }

    if (endBoundary !== -1) {
      mainContent = part.substring(0, endBoundary).trim();
      if (mainContent.endsWith("</div>")) {
        mainContent = mainContent
          .substring(0, mainContent.lastIndexOf("</div>"))
          .trim();
      }
    }
  }

  // Extract modals
  let modals = "";
  const footerMarkers = [
    '<div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">',
    '<div class="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">',
    "<?php include('inc/footer.php'); ?>",
    '<?php include_once("inc/footer.php"); ?>',
  ];
  let footerStart = -1;
  for (const marker of footerMarkers) {
    const pos = fullContent.indexOf(marker);
    if (pos !== -1) {
      footerStart = pos;
      break;
    }
  }

  const jsInclude = "<?php include('inc/js.php'); ?>";
  const jsPos = fullContent.indexOf(jsInclude);

  if (footerStart !== -1 && jsPos !== -1 && jsPos > footerStart) {
    modals = fullContent.substring(footerStart, jsPos).trim();
    // Clean up modals from footer part
    modals = modals.replace(/<div class="footer[\s\S]*?<\/div>/, "");
    modals = modals.replace(/<\/div>\s*<\/div>\s*<!-- \/Page Wrapper -->/g, "");
    modals = modals.replace(/<\/div>\s*<!-- end main wrapper-->/g, "");
    modals = modals.replace(/<\/div>\s*<!-- \/Main Wrapper -->/g, "");
  }

  const cleanedMainContent = cleanJSX(mainContent);
  const cleanedModals = cleanJSX(modals);

  const finalContent = `import React from "react";
import { Link } from "react-router-dom";

const ${file.component} = () => {
  return (
    <>
      <div className="content">
        ${cleanedMainContent}
      </div>

      ${cleanedModals}
    </>
  );
};

export default ${file.component};
`;

  const targetDir = path.join(__dirname, "src/pages/admin/");
  fs.writeFileSync(path.join(targetDir, file.jsx), finalContent);
  console.log(`${file.jsx} generated`);
});
