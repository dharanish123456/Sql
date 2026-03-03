const fs = require("fs");
const path = require("path");

const jsxFile = path.resolve(
  "C:/Users/rambo/Music/erp.svlprinters.in/frontend/src/pages/admin/TicketsPage.jsx",
);
let content = fs.readFileSync(jsxFile, "utf8");

// Fix breadcrumb link
content = content.replace(
  /<a href="\/dashboard">/g,
  '<Link to="/admin-dashboard">',
);
content = content.replace(
  /<Link to="\/admin-dashboard">([\s\S]*?)<\/a>/g,
  '<Link to="/admin-dashboard">$1</Link>',
);

// Fix ticket view toggle links
content = content.replace(/<a href="\/tickets">/g, '<Link to="/tickets">');
content = content.replace(
  /<a href="\/tickets-grid">/g,
  '<Link to="/tickets-grid">',
);
content = content.replace(
  /<Link to="\/tickets">([\s\S]*?)<\/a>/g,
  '<Link to="/tickets">$1</Link>',
);
content = content.replace(
  /<Link to="\/tickets-grid">([\s\S]*?)<\/a>/g,
  '<Link to="/tickets-grid">$1</Link>',
);

// Fix ticket details link
content = content.replace(
  /<a href="\/ticket-details">/g,
  '<Link to="/ticket-details">',
);
content = content.replace(
  /<Link to="\/ticket-details">([\s\S]*?)<\/a>/g,
  '<Link to="/ticket-details">$1</Link>',
);

// Fix select class and defaultValue
content = content.replace(
  /<select className="select">/g,
  '<select className="form-select">',
);

// Fix select defaultValue for modals
content = content.replace(
  /<select className="form-select"([^>]*)>([\s\S]*?)<option selected(?:|="selected")>([\s\S]*?)<\/option>/g,
  (match, rest, options, selectedText) => {
    return `<select className="form-select"${rest} defaultValue="${selectedText.trim()}">${options}<option value="${selectedText.trim()}">${selectedText}</option>`;
  },
);

// Fix value on inputs
content = content.replace(/value="([^"]*)"/g, 'defaultValue="$1"');

// Fix any unclosed input tags missed
content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
  if (attrs.trim().endsWith("/")) return match;
  return `<input${attrs} />`;
});

// Final check on Link tags that might still have </a>
content = content.replace(
  /<Link ([^>]*?)>([\s\S]*?)<\/a>/g,
  "<Link $1>$2</Link>",
);

fs.writeFileSync(jsxFile, content);
console.log("Fixed TicketsPage.jsx");
