import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { downloadLeadRequirementFile, getLeads, updateLeadDetails } from "../../api/leadsApi";
import { getUsers } from "../../api/userAdminApi";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { useToast } from "../../components/system/ToastProvider";

export default function BudgetVerificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const [pendingBudgets, setPendingBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [userNameMap, setUserNameMap] = useState({});

  const fetchPendingBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const leads = await getLeads({ limit: 1000, offset: 0 });
      const pending = (Array.isArray(leads) ? leads : []).filter((lead) => {
        const isPending = lead.budgetVerificationStatus === "PENDING";
        if (!isPending) return false;
        if (user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "MANAGER")) {
          return true;
        }
        if (!user?.id) return false;
        const isAssignedToUser = String(lead.budgetVerificationAssignedToUserId) === String(user.id);
        if (isAssignedToUser) {
          console.log("✓ Budget verification found for user");
        }
        return isAssignedToUser;
      });
      console.log("Total leads:", leads.length, "Pending for user:", pending.length, "User ID:", user?.id);
      setPendingBudgets(pending);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to load budget verifications"));
    } finally {
      setLoading(false);
    }
  };

  const loadUserNames = async () => {
    try {
      const usersData = await getUsers(0, 500);
      const map = {};
      if (Array.isArray(usersData?.items)) {
        usersData.items.forEach((u) => {
          const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
          if (fullName) {
            map[u.id] = fullName;
          }
        });
      }
      setUserNameMap(map);
    } catch (e) {
      console.error("Failed to load user names:", e);
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      fetchPendingBudgets();
      loadUserNames();
    }
  }, [user]);

  // Poll for new verifications every 5 seconds to catch real-time assignments
  useEffect(() => {
    if (user === undefined) return;
    const interval = setInterval(() => {
      fetchPendingBudgets();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleCalculate = (lead) => {
    navigate(`/budget-verifications/${lead.id}/calculate`);
  };

  const handleReject = async (leadId) => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    setRejecting(leadId);
    try {
      await updateLeadDetails(leadId, {
        budgetVerificationStatus: "REJECTED",
        budgetVerificationRejectionReason: rejectionReason,
      });
      showSuccess("Budget verification rejected");
      setPendingBudgets((prev) => prev.filter((item) => item.id !== leadId));
      setRejectingId(null);
      setRejectionReason("");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to reject budget verification"));
    } finally {
      setRejecting(null);
    }
  };

  const downloadRequirementFile = async (lead) => {
    try {
      const { blob, contentDisposition } = await downloadLeadRequirementFile(lead.id);
      if (!blob) return;
      const match = /filename\*?=(?:UTF-8''|\")?([^\";]+)/i.exec(contentDisposition || "");
      const fallback = lead.requirementFileName || `requirement-${lead.id}`;
      const fileName = decodeURIComponent((match?.[1] || fallback).replace(/\"/g, "").trim());
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to download requirement file"));
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h4>Budget Verifications</h4>
          <p className="text-muted">Calculate and approve budgets for requirements</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={fetchPendingBudgets}
          disabled={loading}
          style={{ height: "fit-content" }}
        >
          <i className="ti ti-refresh me-1"></i>Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : pendingBudgets.length === 0 ? (
        <div className="alert alert-info">No pending budget verifications at this time.</div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Lead Name</th>
                  <th>Requirement Type</th>
                  <th>Assigned To</th>
                  <th>Notes</th>
                  <th>Requirement File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBudgets.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate(`/leads/${lead.id}`); }}
                        className="text-primary"
                      >
                        #{lead.leadId || lead.id}
                      </a>
                    </td>
                    <td>{lead.name || "-"}</td>
                    <td>
                      {lead.requirementType ? (
                        <span className="badge bg-secondary">{lead.requirementType}</span>
                      ) : "-"}
                    </td>
                    <td>
                      {lead.budgetVerificationAssignedToUserId ? (
                        <span className="badge bg-info">
                          {userNameMap[lead.budgetVerificationAssignedToUserId] ||
                            (lead.budgetVerificationAssignedToUserId === user?.id ? "You" : "Assigned")}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Unassigned</span>
                      )}
                    </td>
                    <td><small>{lead.requirementNotes || "-"}</small></td>
                    <td>
                      {lead.requirementFileName ? (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => downloadRequirementFile(lead)}
                        >
                          <i className="ti ti-download me-1"></i>Download
                        </button>
                      ) : (
                        <span className="text-muted">No file</span>
                      )}
                    </td>
                    <td>
                      {rejectingId === lead.id ? (
                        <div className="d-flex gap-1 flex-column">
                          <textarea
                            className="form-control form-control-sm"
                            rows="2"
                            placeholder="Rejection reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleReject(lead.id)}
                              disabled={rejecting === lead.id}
                            >
                              {rejecting === lead.id ? "Rejecting..." : "Confirm Reject"}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleCalculate(lead)}
                          >
                            <i className="ti ti-calculator me-1"></i>Calculate Budget
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => { setRejectingId(lead.id); setRejectionReason(""); }}
                          >
                            <i className="ti ti-x me-1"></i>Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
