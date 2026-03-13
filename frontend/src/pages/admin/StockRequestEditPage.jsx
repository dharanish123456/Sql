import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import PageLoader from "../../components/common/PageLoader";
import { getStockRequestById, updateStockRequest, getStockRequestLog, getStockItems } from "../../api/stocksApi";
import { getVendors } from "../../api/vendorsApi";
import { getLeadFlow } from "../../api/flowApi";
import { LEAD_FLOW_STATUSES } from "../../constants/leadFlowStatuses";
import { useAuth } from "../../context/AuthContext";

function parseStockRequestItems(items) {
  if (Array.isArray(items)) return items;
  if (typeof items !== "string" || !items.trim()) return [];
  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// build a human-readable label for a stock item row (same logic as StockRequestFormModal)
function formatStockItemLabel(item) {
  if (!item) return "";
  const parts = [item.name];
  if (item.categoryName) parts.push(item.categoryName);
  if (item.vendorName) parts.push(item.vendorName);
  const qty = Number(item.quantity);
  if (!Number.isNaN(qty)) parts.push(`Qty ${qty}`);
  const minTh = Number(item.minThreshold);
  if (!Number.isNaN(minTh)) parts.push(`Min ${minTh}`);
  const values = item.values || {};
  const valueParts = [];
  const seen = new Set();
  ["material", "manufacturer", "supplier", "size", "uom"].forEach((key) => {
    const entry = values[key];
    if (entry) {
      const part = `${key}: ${entry}`;
      valueParts.push(part);
      seen.add(part);
    }
  });
  if (valueParts.length < 3) {
    for (const [key, value] of Object.entries(values)) {
      if (value && valueParts.length < 3) {
        const part = `${key}: ${value}`;
        if (!seen.has(part)) {
          valueParts.push(part);
          seen.add(part);
        }
      }
    }
  }
  if (valueParts.length) {
    parts.push(valueParts.join(" · "));
  }
  return parts.filter(Boolean).join(" · ");
}

export default function StockRequestEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  // example budget threshold; ideally fetched from server/settings
  const BUDGET_THRESHOLD = 100000;

  const [request, setRequest] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [flowRules, setFlowRules] = useState([]); // rules fetched from backend
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [logs, setLogs] = useState([]); // stock request logs
  
  const stockRequestFlowStatuses = useMemo(() => {
    // fixed ordered list for stock workflow
    return ["Stock Requested", "Accounts Review", "Approval", "Rejected"];
  }, []);

  const currentTimelineIndex = useMemo(() => {
    if (!request?.status) return -1;
    const st = String(request.status).toLowerCase();
    return stockRequestFlowStatuses.findIndex(
      (ts) => String(ts).toLowerCase() === st,
    );
  }, [request?.status, stockRequestFlowStatuses]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [data, vendorRows, flow, itemRows] = await Promise.all([
          getStockRequestById(id),
          getVendors(),
          getLeadFlow(),
          getStockItems(),
        ]);
        setRequest(data);
        setFlowRules(Array.isArray(flow?.rules) ? flow.rules : []);
        // normalize status to lowercase for consistent dropdown matching
        const statusStr = data?.status ? String(data.status).trim().toLowerCase() : "";
        setStatusValue(statusStr);
        setPurchaseValue(data?.purchaseValue || "");
        setVendorId(data?.vendorId || "");
        setVendors(Array.isArray(vendorRows) ? vendorRows : []);
        setStockItems(Array.isArray(itemRows) ? itemRows : []);
        setPurchaseValue(data?.purchaseValue || "");
        setVendorId(data?.vendorId || "");
        // fetch logs separately (not parallel with above to simplify error handling)
        try {
          const logRows = await getStockRequestLog(id);
          setLogs(Array.isArray(logRows) ? logRows : []);
        } catch (err) {
          console.error("failed to load logs", err);
        }
      } catch (e) {
        setError("Failed to load request");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!statusValue) return;
    setSaving(true);
    setError("");
    try {
      let payload = { status: statusValue };
      if (role === "ACCOUNT") {
        payload.purchaseValue = purchaseValue ? Number(purchaseValue) : null;
        payload.vendorId = vendorId || null;
        // auto escalate if over budget
        if (payload.purchaseValue && payload.purchaseValue > BUDGET_THRESHOLD) {
          payload.status = "escalated";
        }
      }
      const updated = await updateStockRequest(id, payload);
      // backend patch often returns partial object (only changed fields)
      setRequest((prev) => ({ ...(prev || {}), ...(updated || {}) }));
      setStatusValue(updated?.status ? String(updated.status).toLowerCase() : "");
    } catch (e) {
      setError("Failed to save status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container-fluid">
      <PageHeader
        title={`Stock Request ${id}`}
        breadcrumb={[
          { label: "Dashboard", path: "/admin-dashboard" },
          { label: "Stock Requests", path: "/stock-requests" },
          { label: id, path: "" },
        ]}
      />
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => navigate(`/stock-requests/${id}/chat`)}
        >
          Chat
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* timeline section */}
      <div className="lead-status-timeline mb-3">
        {stockRequestFlowStatuses.map((item, index) => {
          const stateClass =
            currentTimelineIndex === -1
              ? ""
              : index < currentTimelineIndex
              ? "is-done"
              : index === currentTimelineIndex
              ? "is-current"
              : "";
          return (
            <div key={item} className={`lead-status-step ${stateClass}`}>
              <div className="lead-status-dot" />
              <div className="lead-status-label">{item}</div>
            </div>
          );
        })}
      </div>

      {request && (
        <>
          {role === "ACCOUNT" && request.assignedTo !== user?.id && (
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-sm btn-outline-primary mb-3"
                  onClick={async () => {
                    try {
                      setError("");
                      const updated = await updateStockRequest(id, { assignedTo: user?.id });
                      setRequest(updated);
                    } catch (err) {
                      console.error(err);
                      setError("Failed to assign request");
                    }
                  }}
                >
                  Assign to me
                </button>
              </div>
            </div>
          )}

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Name & Team</h5>
                  <div className="mb-3">
                    <strong>Lead:</strong> {request.leadName || request.leadId || "-"}
                  </div>
                  <div className="mb-3">
                    <strong>Requested By:</strong>{" "}
                    {request.requestedByName || request.requestedBy || "-"}
                  </div>
                  {role === "ACCOUNT" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Vendor</label>
                        <select
                          className="form-select"
                          value={vendorId}
                          onChange={(e) => setVendorId(e.target.value)}
                        >
                          <option value="">Select vendor</option>
                          {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Estimated Purchase Value</label>
                        <input
                          type="number"
                          className="form-control"
                          value={purchaseValue}
                          onChange={(e) => setPurchaseValue(e.target.value)}
                        />
                      </div>
                      {purchaseValue && Number(purchaseValue) > BUDGET_THRESHOLD && (
                        <div className="alert alert-warning">
                          Purchase value exceeds budget threshold of {BUDGET_THRESHOLD}.
                          This request will be escalated to admin/manager.
                        </div>
                      )}
                    </>
                  )}
                  <h5 className="mb-3">Items & Notes</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>Items</strong>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setNotesModalVisible(true)}
                      >
                        View Notes
                      </button>
                    </div>
                    <ul>
                      {parseStockRequestItems(request.items).map((it, idx) => {
                        const detail = stockItems.find((si) => String(si.id) === String(it.itemId));
                        const label = detail
                          ? formatStockItemLabel(detail)
                          : it.name || `Item ${it.itemId || ""}`;
                        // if detail exists the label already includes category
                        return (
                          <li key={idx}>
                            {label}, Qty: {it.qty}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card border">
                <div className="card-body">
                  <h5 className="mb-3">Request Status</h5>
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      {stockRequestFlowStatuses.map((item) => {
                        const stateClass =
                          currentTimelineIndex === -1
                            ? ""
                            : stockRequestFlowStatuses.findIndex((s) => s === item) <
                              currentTimelineIndex
                            ? "bg-success text-white"
                            : item.toLowerCase() === statusValue
                            ? "bg-primary text-white"
                            : "bg-light text-dark";
                        return (
                          <span key={item} className={`badge ${stateClass}`}>
                            {item}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select mb-3"
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    {stockRequestFlowStatuses.map((status) => (
                      <option key={status} value={status.toLowerCase()}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="mb-3">Log</h5>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {logs.length === 0 ? (
                      <div className="text-muted">No log entries.</div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {logs.map((l) => (
                          <div key={l.id || l.createdAt}>
                            <div className="fw-medium">{l.action}</div>
                            <div className="text-muted">by {l.actor || 'system'}</div>
                            <div className="text-muted">
                              on {new Date(l.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* notes modal */}
              {notesModalVisible && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Item Notes</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setNotesModalVisible(false)}
                        />
                      </div>
                      <div className="modal-body">
                        <ul>
                          {parseStockRequestItems(request.items)
                            .filter((it) => it.notes)
                            .map((it, idx) => {
                              const detail = stockItems.find((si) => String(si.id) === String(it.itemId));
                              const label = detail
                                ? formatStockItemLabel(detail)
                                : it.name || `Item ${it.itemId || ""}`;
                              return (
                                <li key={idx}>
                                  <strong>{label}: </strong>
                                  {it.notes}
                                </li>
                              );
                            })}
                        </ul>
                        {parseStockRequestItems(request.items).every((it) => !it.notes) && (
                          <div className="text-muted">No notes available.</div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setNotesModalVisible(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
