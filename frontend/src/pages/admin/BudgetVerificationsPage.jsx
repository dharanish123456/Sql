import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { downloadLeadRequirementFile, getLeads, updateLeadDetails } from "../../api/leadsApi";
import { getProductionRequirements } from "../../api/productionRequirementApi";
import { getDesignRequirement } from "../../api/designRequirementApi";
import { getUsers } from "../../api/userAdminApi";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { useToast } from "../../components/system/ToastProvider";
import api from "../../utils/api";

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

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
  const [detailLead, setDetailLead] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailDesignRequirement, setDetailDesignRequirement] = useState(null);
  const [detailProductionRequirements, setDetailProductionRequirements] = useState([]);

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

  const openRequirementDetails = async (lead) => {
    setDetailLead(lead);
    setDetailLoading(true);
    setDetailDesignRequirement(null);
    setDetailProductionRequirements([]);
    try {
      const [designReq, productionReqs] = await Promise.all([
        getDesignRequirement(lead.id),
        getProductionRequirements(lead.id),
      ]);
      setDetailDesignRequirement(designReq || null);
      setDetailProductionRequirements(Array.isArray(productionReqs) ? productionReqs : []);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to load requirement details"));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeRequirementDetails = () => {
    setDetailLead(null);
    setDetailDesignRequirement(null);
    setDetailProductionRequirements([]);
    setDetailLoading(false);
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

  const downloadProtectedFile = async (filePath, fileName) => {
    try {
      const response = await api.get(filePath, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to download file"));
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
                        <div className="d-flex flex-column gap-2">
                          <span className="badge bg-secondary align-self-start">{lead.requirementType}</span>
                          <button
                            className="btn btn-sm btn-outline-primary align-self-start"
                            onClick={() => openRequirementDetails(lead)}
                          >
                            <i className="ti ti-eye me-1"></i>View
                          </button>
                        </div>
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

      {detailLead && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Requirement Details for #{detailLead.leadId || detailLead.id}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeRequirementDetails} />
                </div>
                <div className="modal-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="text-muted small mb-1">Lead Name</div>
                      <div className="fw-semibold">{detailLead.name || "-"}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small mb-1">Selected Category</div>
                      <span className="badge bg-secondary fs-6">{detailLead.requirementType || "-"}</span>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small mb-1">Notes</div>
                      <div className="fw-semibold">{detailLead.requirementNotes || "-"}</div>
                    </div>
                  </div>

                  {detailLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {detailDesignRequirement && (
                        <div className="card mb-4">
                          <div className="card-header">
                            <h6 className="mb-0"><i className="ti ti-palette me-2"></i>Design Requirement Details</h6>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Requirement Type</div>
                                <div className="fw-semibold">{detailDesignRequirement.requirementType || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Product Type</div>
                                <div className="fw-semibold">{detailDesignRequirement.designProductType || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Size</div>
                                <div className="fw-semibold">{detailDesignRequirement.designSize || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Orientation</div>
                                <div className="fw-semibold">{detailDesignRequirement.designOrientation || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Pages</div>
                                <div className="fw-semibold">{detailDesignRequirement.designNumPages || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Purpose</div>
                                <div className="fw-semibold">{detailDesignRequirement.designPurpose || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small mb-1">Priority</div>
                                <div className="fw-semibold">{detailDesignRequirement.designPriority || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Brand Colors</div>
                                <div className="fw-semibold">{detailDesignRequirement.designBrandColors || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Fonts</div>
                                <div className="fw-semibold">{detailDesignRequirement.designFonts || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Target Audience</div>
                                <div className="fw-semibold">{detailDesignRequirement.designTargetAudience || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Style Preference</div>
                                <div className="fw-semibold">{detailDesignRequirement.designStylePref || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Deadline</div>
                                <div className="fw-semibold">{detailDesignRequirement.designDeadline ? formatDateTime(detailDesignRequirement.designDeadline) : "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="text-muted small mb-1">Reference Links</div>
                                <div className="fw-semibold">{detailDesignRequirement.designReferenceLinks || "-"}</div>
                              </div>
                              <div className="col-md-12">
                                <div className="text-muted small mb-1">Description</div>
                                <div className="fw-semibold">{detailDesignRequirement.designDescription || "-"}</div>
                              </div>
                              <div className="col-md-12">
                                <div className="text-muted small mb-1">Additional Notes</div>
                                <div className="fw-semibold">{detailDesignRequirement.designAdditionalNotes || detailDesignRequirement.requirementNotes || "-"}</div>
                              </div>
                              {detailDesignRequirement.designBrandGuidelinesFileName && (
                                <div className="col-md-6">
                                  <div className="text-muted small mb-1">Brand Guidelines</div>
                                  <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <div className="fw-semibold text-break">{detailDesignRequirement.designBrandGuidelinesFileName}</div>
                                    {detailDesignRequirement.designBrandGuidelinesFilePath && (
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => downloadProtectedFile(detailDesignRequirement.designBrandGuidelinesFilePath, detailDesignRequirement.designBrandGuidelinesFileName)}
                                      >
                                        <i className="ti ti-download me-1"></i>Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              {detailDesignRequirement.designLogoFileName && (
                                <div className="col-md-6">
                                  <div className="text-muted small mb-1">Logo File</div>
                                  <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <div className="fw-semibold text-break">{detailDesignRequirement.designLogoFileName}</div>
                                    {detailDesignRequirement.designLogoFilePath && (
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => downloadProtectedFile(detailDesignRequirement.designLogoFilePath, detailDesignRequirement.designLogoFileName)}
                                      >
                                        <i className="ti ti-download me-1"></i>Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              {detailDesignRequirement.designImagesFileName && (
                                <div className="col-md-6">
                                  <div className="text-muted small mb-1">Client Images</div>
                                  <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <div className="fw-semibold text-break">{detailDesignRequirement.designImagesFileName}</div>
                                    {detailDesignRequirement.designImagesFilePath && (
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => downloadProtectedFile(detailDesignRequirement.designImagesFilePath, detailDesignRequirement.designImagesFileName)}
                                      >
                                        <i className="ti ti-download me-1"></i>Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              {detailDesignRequirement.designReferenceImagesFileName && (
                                <div className="col-md-6">
                                  <div className="text-muted small mb-1">Reference Images</div>
                                  <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <div className="fw-semibold text-break">{detailDesignRequirement.designReferenceImagesFileName}</div>
                                    {detailDesignRequirement.designReferenceImagesFilePath && (
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => downloadProtectedFile(detailDesignRequirement.designReferenceImagesFilePath, detailDesignRequirement.designReferenceImagesFileName)}
                                      >
                                        <i className="ti ti-download me-1"></i>Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              {detailDesignRequirement.designPreviousDesignsFileName && (
                                <div className="col-md-6">
                                  <div className="text-muted small mb-1">Previous Designs</div>
                                  <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <div className="fw-semibold text-break">{detailDesignRequirement.designPreviousDesignsFileName}</div>
                                    {detailDesignRequirement.designPreviousDesignsFilePath && (
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => downloadProtectedFile(detailDesignRequirement.designPreviousDesignsFilePath, detailDesignRequirement.designPreviousDesignsFileName)}
                                      >
                                        <i className="ti ti-download me-1"></i>Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {detailProductionRequirements.length > 0 && (
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0"><i className="ti ti-box me-2"></i>Production Requirement Details</h6>
                          </div>
                          <div className="card-body">
                            {detailProductionRequirements.map((req, idx) => (
                              <div key={req.id || idx} className={idx > 0 ? "border-top pt-3 mt-3" : ""}>
                                <div className="row g-3">
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Requirement Type</div>
                                    <div className="fw-semibold">{req.requirementType || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Product Type</div>
                                    <div className="fw-semibold">{req.productType || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Quantity</div>
                                    <div className="fw-semibold">{req.quantity || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Paper Size</div>
                                    <div className="fw-semibold">{req.paperSize || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Paper Type</div>
                                    <div className="fw-semibold">{req.paperType || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">GSM</div>
                                    <div className="fw-semibold">{req.paperGsm || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Color Type</div>
                                    <div className="fw-semibold">{req.colorType || "-"}</div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="text-muted small mb-1">Print Sides</div>
                                    <div className="fw-semibold">{req.printSides || "-"}</div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="text-muted small mb-1">Printing Method</div>
                                    <div className="fw-semibold">{req.printingMethod || "-"}</div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="text-muted small mb-1">Finishing Options</div>
                                    <div className="fw-semibold">{req.finishingOptions || "-"}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="text-muted small mb-1">Priority</div>
                                    <div className="fw-semibold">{req.priority || "-"}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="text-muted small mb-1">Print Deadline</div>
                                    <div className="fw-semibold">{req.printDeadline ? formatDateTime(req.printDeadline) : "-"}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="text-muted small mb-1">Delivery Date</div>
                                    <div className="fw-semibold">{req.deliveryDate ? formatDateTime(req.deliveryDate) : "-"}</div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="text-muted small mb-1">Additional Notes</div>
                                    <div className="fw-semibold">{req.additionalNotes || "-"}</div>
                                  </div>
                                  {req.artworkFileName && (
                                    <div className="col-md-12">
                                      <div className="text-muted small mb-1">Artwork File</div>
                                      <div className="d-flex flex-wrap gap-2 align-items-center">
                                        <div className="fw-semibold text-break">{req.artworkFileName}</div>
                                        {req.artworkFilePath && (
                                          <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => downloadProtectedFile(req.artworkFilePath, req.artworkFileName)}
                                          >
                                            <i className="ti ti-download me-1"></i>Download
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!detailDesignRequirement && detailProductionRequirements.length === 0 && (
                        <div className="text-muted">No submitted requirement details found for this lead.</div>
                      )}
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeRequirementDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}
