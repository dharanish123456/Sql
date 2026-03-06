import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLeadChatMessages,
  sendLeadChatAttachment,
  sendLeadChatMessage,
  downloadLeadChatAttachment,
} from "../../api/leadsApi";
import { useAuth } from "../../context/AuthContext";

function formatDateTime(value) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

function buildReplyPrefix(reply) {
  if (!reply) return "";
  const isFile = !!reply.attachmentName;
  const snippet = (reply.message || "").replace(/\s+/g, " ").trim().slice(0, 120);
  const meta = isFile
    ? `type=file|name=${reply.attachmentName}`
    : `type=text|text=${encodeURIComponent(snippet)}`;
  return `[[reply]]${meta}[[/reply]]\n`;
}

function parseReplyMessage(value) {
  const raw = value || "";
  if (!raw.startsWith("[[reply]]")) {
    return { reply: null, text: raw };
  }
  const end = raw.indexOf("[[/reply]]");
  if (end === -1) {
    return { reply: null, text: raw };
  }
  const meta = raw.slice(9, end);
  const text = raw.slice(end + 10).trimStart();
  const parts = {};
  meta.split("|").forEach((entry) => {
    const [key, ...rest] = entry.split("=");
    if (!key) return;
    parts[key] = rest.join("=");
  });
  const reply =
    parts.type === "file"
      ? { type: "file", name: parts.name || "File" }
      : { type: "text", text: decodeURIComponent(parts.text || "") };
  return { reply, text };
}

function buildChoiceMessage() {
  return "[[choice]]accept|reject|continue[[/choice]] Please choose: Accept / Reject / Continue.";
}

function parseChoiceMessage(value) {
  const raw = value || "";
  const start = raw.indexOf("[[choice]]");
  const end = raw.indexOf("[[/choice]]");
  if (start === -1 || end === -1 || end < start) {
    return { choices: null, text: raw };
  }
  const choiceText = raw.slice(start + 10, end).trim();
  const choices = choiceText
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  const text = (raw.slice(0, start) + raw.slice(end + 11)).trim();
  return { choices, text };
}

export default function LeadChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatTab, setChatTab] = useState("INTERNAL");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatFile, setChatFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, message: null });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const lastSeenRef = useRef({});
  const didInitRef = useRef({});

  useEffect(() => {
    if (!id) return;
    let active = true;
    const loadMessages = async () => {
      setChatLoading(true);
      try {
        const rows = await getLeadChatMessages(id, chatTab);
        if (!active) return;
        const list = Array.isArray(rows) ? rows : [];
        setChatMessages(list);
        const latest = list[list.length - 1];
        const latestId = latest?.id || latest?.createdAt || null;
        const key = chatTab;
        if (latestId && didInitRef.current[key]) {
          const isIncoming = latest?.senderUserId
            ? String(latest.senderUserId) !== String(user?.id || "")
            : false;
          if (isIncoming && latestId !== lastSeenRef.current[key]) {
            setNotice("New message received");
            setTimeout(() => setNotice(""), 3000);
          }
        }
        if (latestId) {
          lastSeenRef.current[key] = latestId;
        }
        if (!didInitRef.current[key]) {
          didInitRef.current[key] = true;
        }
      } catch {
        if (active) setChatMessages([]);
      } finally {
        if (active) setChatLoading(false);
      }
    };
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id, chatTab]);

  const submitChatMessage = async () => {
    if (!id || (!chatText.trim() && !chatFile)) return;
    setSaving(true);
    try {
      const replyPrefix = buildReplyPrefix(replyTo);
      const finalMessage = `${replyPrefix}${chatText.trim()}`.trim();
      if (chatFile) {
        await sendLeadChatAttachment(id, {
          threadType: chatTab,
          message: finalMessage,
          file: chatFile,
        });
      } else {
        await sendLeadChatMessage(id, {
          threadType: chatTab,
          message: finalMessage,
        });
      }
      setChatText("");
      setChatFile(null);
      setReplyTo(null);
      const rows = await getLeadChatMessages(id, chatTab);
      setChatMessages(Array.isArray(rows) ? rows : []);
    } finally {
      setSaving(false);
    }
  };

  const sendChoiceRequest = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await sendLeadChatMessage(id, {
        threadType: "CUSTOMER",
        message: buildChoiceMessage(),
      });
      const rows = await getLeadChatMessages(id, chatTab);
      setChatMessages(Array.isArray(rows) ? rows : []);
    } finally {
      setSaving(false);
    }
  };

  const downloadAttachment = async (item) => {
    if (!id || !item?.id) return;
    const blob = await downloadLeadChatAttachment(id, item.id);
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.attachmentName || "attachment";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const openMenu = (event, item) => {
    event.preventDefault();
    setMenu({ visible: true, x: event.clientX, y: event.clientY, message: item });
  };

  const closeMenu = () => {
    setMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const handleReply = () => {
    if (menu.message) {
      setReplyTo(menu.message);
    }
    closeMenu();
  };

  const supportTitle = `Lead #${id}`;
  const supportSubtitle = chatTab === "INTERNAL" ? "Internal Team" : "Customer";

  return (
    <div className="customer-chat" onClick={closeMenu}>
      {notice ? <div className="chat-notice">{notice}</div> : null}
      <div className="customer-chat__grid">
        <aside className="customer-chat__list">
          <div className="customer-chat__list-header">
            <div>
              <h4>Lead Chat</h4>
              <p className="text-muted">Lead ID: {id}</p>
            </div>
            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate(`/leads/${id}`)}>
              Back
            </button>
          </div>
          <div className="btn-group w-100">
            <button
              type="button"
              className={`btn ${chatTab === "INTERNAL" ? "btn-primary" : "btn-light"}`}
              onClick={() => setChatTab("INTERNAL")}
            >
              Internal
            </button>
            <button
              type="button"
              className={`btn ${chatTab === "CUSTOMER" ? "btn-primary" : "btn-light"}`}
              onClick={() => setChatTab("CUSTOMER")}
            >
              Customer
            </button>
          </div>
          <div className="customer-chat__contact">
            <div className="customer-chat__avatar">
              <img src="/assets/img/profiles/avatar-02.jpg" alt="Lead" />
              <span className="customer-chat__status-dot" />
            </div>
            <div className="customer-chat__contact-info">
              <h6>{supportTitle}</h6>
              <span>{supportSubtitle}</span>
            </div>
            <div className="customer-chat__contact-state">Active</div>
          </div>
        </aside>

        <section className="customer-chat__panel">
          <div className="customer-chat__panel-header">
            <div className="customer-chat__panel-title">
              <div className="customer-chat__avatar customer-chat__avatar--lg">
                <img src="/assets/img/profiles/avatar-02.jpg" alt="Lead" />
                <span className="customer-chat__status-dot" />
              </div>
              <div>
                <h5>{supportTitle}</h5>
                <p>{supportSubtitle}</p>
              </div>
            </div>
            <div className="customer-chat__panel-actions">
              <button className="btn btn-icon btn-light" type="button" disabled>
                <i className="ti ti-dots-vertical" />
              </button>
            </div>
          </div>

          <div className="customer-chat__panel-body">
            {chatLoading ? (
              <div className="customer-chat__empty">Loading chat...</div>
            ) : chatMessages.length === 0 ? (
              <div className="customer-chat__empty">No messages yet.</div>
            ) : (
              <div className="customer-chat__messages">
                {chatMessages.map((item) => {
                  const isMine = item.senderUserId && user?.id
                    ? String(item.senderUserId) === String(user.id)
                    : false;
                  const parsedReply = parseReplyMessage(item.message || "");
                  const parsedChoice = parseChoiceMessage(parsedReply.text);
                  return (
                    <div
                      key={item.id || `${item.message}-${item.createdAt}`}
                      className={`customer-msg ${isMine ? "customer-msg--mine" : "customer-msg--theirs"}`}
                    >
                      <div className="customer-msg__bubble" onContextMenu={(e) => openMenu(e, item)}>
                        {parsedReply.reply ? (
                          <div className="customer-msg__reply">
                            <span>Replying to</span>
                            <p>
                              {parsedReply.reply.type === "file"
                                ? `File: ${parsedReply.reply.name}`
                                : parsedReply.reply.text}
                            </p>
                          </div>
                        ) : null}
                        <div className="customer-msg__text">
                          {parsedChoice.text || "Status options sent."}
                        </div>
                        {item.attachmentName ? (
                          <button
                            type="button"
                            className="customer-msg__file"
                            onClick={() => downloadAttachment(item)}
                          >
                            <i className="ti ti-paperclip" />
                            <span>{item.attachmentName}</span>
                          </button>
                        ) : null}
                        <div className="customer-msg__time">{formatDateTime(item.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="customer-chat__panel-footer">
            <div className="customer-chat__composer">
              {replyTo ? (
                <div className="customer-chat__reply">
                  <div>
                    <strong>Replying to</strong>
                    <p>{(replyTo.message || "").slice(0, 120)}</p>
                  </div>
                  <button type="button" onClick={() => setReplyTo(null)}>
                    <i className="ti ti-x" />
                  </button>
                </div>
              ) : null}
              {chatTab === "CUSTOMER" &&
              /EMPLOYEE$/i.test(String(user?.role || "")) ? (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm me-2"
                  disabled={saving}
                  onClick={sendChoiceRequest}
                >
                  Status
                </button>
              ) : null}
              <input
                type="text"
                placeholder="Type your message"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
              />
              <label className="customer-chat__attach">
                <input
                  type="file"
                  onChange={(e) => setChatFile(e.target.files?.[0] || null)}
                />
                <i className="ti ti-paperclip" />
              </label>
              <button
                className="btn btn-primary"
                type="button"
                onClick={submitChatMessage}
                disabled={saving || (!chatText.trim() && !chatFile)}
              >
                <i className="ti ti-send" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {menu.visible ? (
        <div
          className="chat-context-menu"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={handleReply}>
            Reply
          </button>
          {menu.message?.attachmentName ? (
            <button type="button" onClick={() => downloadAttachment(menu.message)}>
              Download
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
