import { useEffect, useRef, useState } from "react";
import {
  getCustomerChatMessages,
  sendCustomerChatAttachment,
  sendCustomerChatMessage,
  downloadCustomerChatAttachment,
} from "../../api/customerChatApi";
import { getCustomerLead, updateCustomerLeadStatus } from "../../api/customerApi";

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

export default function CustomerChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [leadName, setLeadName] = useState("Support");
  const [replyTo, setReplyTo] = useState(null);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, message: null });
  const [notice, setNotice] = useState("");
  const [respondedChoices, setRespondedChoices] = useState(() => new Set());
  const lastSeenRef = useRef(null);
  const didInitRef = useRef(false);

  useEffect(() => {
    let active = true;
    const loadLead = async () => {
      try {
        const lead = await getCustomerLead();
        if (!active) return;
        setLeadName(lead?.name || lead?.projectName || "Support");
      } catch {
        if (active) setLeadName("Support");
      }
    };
    loadLead();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadMessages = async () => {
      setLoading(true);
      try {
        const rows = await getCustomerChatMessages();
        if (!active) return;
        const list = Array.isArray(rows) ? rows : [];
        setMessages(list);
        const latest = list[list.length - 1];
        const latestId = latest?.id || latest?.createdAt || null;
        if (latestId && didInitRef.current) {
          const isIncoming = latest?.senderRole && latest.senderRole !== "CUSTOMER";
          if (isIncoming && latestId !== lastSeenRef.current) {
            setNotice("New message received");
            setTimeout(() => setNotice(""), 3000);
          }
        }
        if (latestId) {
          lastSeenRef.current = latestId;
        }
        if (!didInitRef.current) {
          didInitRef.current = true;
        }
      } catch {
        if (active) setMessages([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed && !file) return;
    const replyPrefix = buildReplyPrefix(replyTo);
    const finalMessage = `${replyPrefix}${trimmed}`.trim();
    if (file) {
      await sendCustomerChatAttachment({ message: finalMessage, file });
    } else {
      await sendCustomerChatMessage(finalMessage);
    }
    setText("");
    setFile(null);
    setReplyTo(null);
    const rows = await getCustomerChatMessages();
    setMessages(Array.isArray(rows) ? rows : []);
  };

  const respondToChoice = async (messageId, choice) => {
    if (!choice || respondedChoices.has(messageId)) return;
    const normalized = String(choice).trim().toLowerCase();
    const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    setRespondedChoices((prev) => new Set(prev).add(messageId));
    if (normalized === "accept") {
      await updateCustomerLeadStatus("Payment");
      await sendCustomerChatMessage(`Customer selected: ${label}`);
      return;
    }
    if (normalized === "reject") {
      await updateCustomerLeadStatus("Rejected");
      await sendCustomerChatMessage(`Customer selected: ${label}`);
      return;
    }
    await sendCustomerChatMessage(`Customer selected: ${label}`);
  };

  const downloadAttachment = async (item) => {
    if (!item?.id) return;
    const blob = await downloadCustomerChatAttachment(item.id);
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

  const supportTitle = "SVL Support";
  const supportSubtitle = leadName ? `Project: ${leadName}` : "Customer Care";

  return (
    <div className="customer-chat" onClick={closeMenu}>
      {notice ? <div className="chat-notice">{notice}</div> : null}
      <div className="customer-chat__grid">
        <aside className="customer-chat__list">
          <div className="customer-chat__list-header">
            <div>
              <h4>Chats</h4>
              <p className="text-muted">Quick access to support</p>
            </div>
            <button className="btn btn-sm btn-outline-secondary" type="button" disabled>
              <i className="ti ti-search" />
            </button>
          </div>
          <div className="customer-chat__search">
            <i className="ti ti-search" />
            <input type="text" placeholder="Search chats" disabled />
          </div>
          <div className="customer-chat__contact">
            <div className="customer-chat__avatar">
              <img src="/assets/img/profiles/avatar-02.jpg" alt="Support" />
              <span className="customer-chat__status-dot" />
            </div>
            <div className="customer-chat__contact-info">
              <h6>{supportTitle}</h6>
              <span>{supportSubtitle}</span>
            </div>
            <div className="customer-chat__contact-state">Online</div>
          </div>
        </aside>

        <section className="customer-chat__panel">
          <div className="customer-chat__panel-header">
            <div className="customer-chat__panel-title">
              <div className="customer-chat__avatar customer-chat__avatar--lg">
                <img src="/assets/img/profiles/avatar-02.jpg" alt="Support" />
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
            {loading ? (
              <div className="customer-chat__empty">Loading chat...</div>
            ) : messages.length === 0 ? (
              <div className="customer-chat__empty">
                No messages yet. Say hello to start the conversation.
              </div>
            ) : (
              <div className="customer-chat__messages">
                {messages.map((item) => {
                  const isMine = item.senderRole === "CUSTOMER";
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
                          {parsedChoice.text || parsedReply.text}
                        </div>
                        {!isMine && parsedChoice.choices?.length ? (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {parsedChoice.choices.map((choice) => (
                              <button
                                key={`${item.id}-${choice}`}
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => respondToChoice(item.id, choice)}
                                disabled={respondedChoices.has(item.id)}
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        ) : null}
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
              <input
                type="text"
                placeholder="Type your message"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <label className="customer-chat__attach">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <i className="ti ti-paperclip" />
              </label>
              <button className="btn btn-primary" type="button" onClick={sendMessage}>
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
