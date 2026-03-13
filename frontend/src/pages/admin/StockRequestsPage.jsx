import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import PageLoader from "../../components/common/PageLoader";
import {
  getStockRequests,
  createStockRequest,
  getStockItems,
  updateStockRequest,
  deleteStockRequest,
} from "../../api/stocksApi";
import { useToast } from "../../components/system/ToastProvider";
import StockRequestFormModal from "../../components/system/StockRequestFormModal";
import useConfirmDialog from "../../components/system/useConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { getLeads } from "../../api/leadsApi";
import { getLeadFlow } from "../../api/flowApi";
import { LEAD_FLOW_STATUSES } from "../../constants/leadFlowStatuses";

export default function StockRequestsPage() {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const isAccountUser = role === "ACCOUNT";
  const isAdminUser = role === "ADMIN" || role === "SUPER_ADMIN";
  const { showConfirm, confirmDialog } = useConfirmDialog();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [leadOptions, setLeadOptions] = useState([]);
  const [flowRules, setFlowRules] = useState([]);
  const [editStatus, setEditStatus] = useState("");

  const parseRequestItems = useCallback((items) => {
    if (!items) return [];
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const flowStatusNames = useMemo(() => {
    return new Set(
      (flowRules || [])
        .map((rule) => String(rule?.status || "").trim().toLowerCase())
        .filter(Boolean),
    );
  }, [flowRules]);

  const stockRequestFlowStatuses = useMemo(() => {
    // fixed sequence for stock workflow per spec
    return [
      "Stock Requested",
      "Accounts Review",
      "Approval",
      "Rejected",
    ];
    // previous dynamic logic retained for reference in comments
    /*
    const ordered = LEAD_FLOW_STATUSES;
    const startIndex = ordered.findIndex(
      (status) => String(status || "").trim().toLowerCase() === "stock requested",
    );
    const endIndex = ordered.findIndex(
      (status) => String(status || "").trim().toLowerCase() === "stock updated",
    );
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      return [];
    }
    const slice = ordered.slice(startIndex, endIndex + 1);
    if (flowStatusNames.size === 0) {
      return slice;
    }
    */
    const filtered = slice.filter((status) =>
      flowStatusNames.has(String(status || "").trim().toLowerCase()),
    );
    return filtered.length ? filtered : slice;
  }, [flowStatusNames]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (role === "PRODUCTION") {
        params.requestedBy = user?.id;
      } else if (role === "ACCOUNT") {
        // accounts should be able to see all requests in order to claim them;
      }
      const rows = await getStockRequests(params);
      setRequests(Array.isArray(rows) ? rows : []);
    } catch (e) {
      const message = extractApiErrorMessage(e, "Failed to load stock requests");
      console.error(e);
      setError(message);
      showError(message, { title: "Stock Requests" });
    } finally {
      setLoading(false);
    }
  }, [role, user?.id, showError]);

  useEffect(() => {
    let active = true;
    const loadFlow = async () => {
      try {
        const flow = await getLeadFlow();
        if (!active) return;
        setFlowRules(Array.isArray(flow?.rules) ? flow.rules : []);
      } catch (e) {
        console.error("failed to load flow", e);
        if (active) setFlowRules([]);
      }
    };
    loadFlow();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setEditStatus(editingRequest?.status || stockRequestFlowStatuses[0] || "");
  }, [editingRequest, stockRequestFlowStatuses]);

  const statusOptions = useMemo(() => {
    if (!isAccountUser) return [];
    const seen = new Set();
    const values = [];
    if (editingRequest?.status) {
      values.push(editingRequest.status);
      seen.add(editingRequest.status);
    }
    stockRequestFlowStatuses.forEach((status) => {
      if (status && !seen.has(status)) {
        values.push(status);
        seen.add(status);
      }
    });
    return values;
  }, [editingRequest?.status, isAccountUser, stockRequestFlowStatuses]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;
    const loadLeadOptions = async () => {
      try {
        // Filter parameters based on user role
        const params = { size: 1000 };
        // For Production users, show only their assigned leads
        if (role === "PRODUCTION") {
          params.owner = user?.id;
        }
        const rows = await getLeads(params);
        if (!active) return;
        setLeadOptions(
          Array.isArray(rows)
            ? rows
                .filter((row) => row?.id != null && (row?.name || row?.leadName || row?.leadId))
                .map((row) => {
                  const displayId = row.leadId || row.id;
                  const name = row.leadName || row.name || `Lead ${displayId}`;
                  return {
                    id: row.id,
                    name,
                    displayId,
                    label: `${displayId} · ${name}`,
                  };
                })
            : [],
        );
      } catch (e) {
        console.error("failed to load lead options", e);
      }
    };
    loadLeadOptions();
    return () => {
      active = false;
    };
  }, [role, user?.id]);

  useEffect(() => {
    let active = true;
    const loadItems = async () => {
      try {
        const rows = await getStockItems();
        if (!active) return;
        setStockItems(Array.isArray(rows) ? rows : []);
      } catch (e) {
        console.error("Failed to load stock items", e);
      }
    };
    loadItems();
    return () => {
      active = false;
    };
  }, []);

  const handleCreateSubmit = useCallback(
    async ({ leadId, leadName, items }) => {
      if (!leadId) return;
      setCreating(true);
      setError("");
      try {
        const resolvedLeadName =
          leadName || leadOptions.find((opt) => String(opt.id) === String(leadId))?.name || "";
        const payload = {
          leadId,
          leadName: resolvedLeadName,
          requestedBy: user?.id,
          items,
        };
        const req = await createStockRequest(payload);
        if (req?.id) {
          showSuccess("Stock request routed to Accounts", {
            title: "Stock Requests",
          });
          setShowCreateModal(false);
          await load();
        }
      } catch (e) {
        const message = extractApiErrorMessage(e, "Failed to create stock request");
        setError(message);
      } finally {
        setCreating(false);
      }
    },
    [leadOptions, load, showSuccess, user?.id],
  );

  const openChat = (req) => {
    navigate(`/stock-requests/${req.id}/chat`);
  };

  const openDetail = (req) => {
    navigate(`/stock-requests/${req.id}`);
  };


  const openEditModal = (req) => {
    if (!isAccountUser) return;
    setEditingRequest(req);
  };

  const closeEditModal = () => {
    setEditingRequest(null);
  };

  const editingRows = useMemo(
    () => (editingRequest ? parseRequestItems(editingRequest.items || "[]") : []),
    [editingRequest, parseRequestItems],
  );

  const handleEditSubmit = async ({ items, status }) => {
    if (!editingRequest?.id) return;
    setUpdating(true);
    try {
      const payload = { items };
      if (status) {
        payload.status = status;
      }
      await updateStockRequest(editingRequest.id, payload);
      showSuccess("Stock request updated", { title: "Stock Requests" });
      closeEditModal();
      await load();
    } catch (e) {
      const message = extractApiErrorMessage(e, "Failed to update stock request");
      showError(message, { title: "Stock Requests" });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = useCallback(
    (req) => {
      if (!isAdminUser) return;
      showConfirm({
        title: "Delete stock request",
        message: `Are you sure you want to delete request ${req.leadDisplayId || req.leadId || req.id}? This cannot be undone.`,
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          setDeletingRequestId(req.id);
          try {
            await deleteStockRequest(req.id);
            showSuccess("Stock request deleted", { title: "Stock Requests" });
            await load();
          } catch (e) {
            const message = extractApiErrorMessage(e, "Failed to delete stock request");
            showError(message, { title: "Stock Requests" });
          } finally {
            setDeletingRequestId(null);
          }
        },
      });
    },
    [isAdminUser, load, showError, showConfirm, showSuccess],
  );

  if (loading) return <PageLoader />;

  return (
    <div className="container-fluid">
      <PageHeader
        title="Stock Requests"
        breadcrumb={[
          { label: "Dashboard", path: "/admin-dashboard" },
          { label: "Stock Requests", path: "" },
        ]}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div />
            <button
              className="btn btn-sm btn-primary"
              type="button"
              disabled={creating}
              onClick={() => setShowCreateModal(true)}
            >
              + Create Stock Request
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name &amp; Team</th>
                  <th>Requested By</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/leads/${req.leadId}`);
                        }}
                      >
                        {req.leadDisplayId || req.leadId}
                      </a>
                      {req.leadName ? (
                        <div className="text-muted small">{req.leadName}</div>
                      ) : null}
                    </td>
                    <td>{req.requestedByName || req.requestedBy || ""}</td>
                    <td>{req.assignedToName || req.assignedTo || ""}</td>
                    <td>{req.status}</td>
                    <td>
                      {isAccountUser && (
                        <button
                          className="btn btn-sm btn-outline-warning me-1"
                          onClick={() => openEditModal(req)}
                        >
                          Edit
                        </button>
                      )}
                      {isAdminUser && (
                        <button
                          className="btn btn-sm btn-outline-danger me-1"
                          onClick={() => handleDelete(req)}
                          disabled={deletingRequestId === req.id}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => openDetail(req)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openChat(req)}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <StockRequestFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        submitting={creating}
        requireLeadId
        title="Create Stock Request"
        itemOptions={stockItems}
        leadOptions={leadOptions}
      />
      <StockRequestFormModal
        open={Boolean(editingRequest)}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        submitting={updating}
        title="Edit Stock Request"
        itemOptions={stockItems}
        initialRows={editingRows}
        initialLeadName={editingRequest?.leadName || editingRequest?.leadDisplayId}
      />
      {confirmDialog}
    </div>
  );
}
