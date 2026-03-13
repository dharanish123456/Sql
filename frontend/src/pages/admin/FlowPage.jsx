import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import PageLoader from "../../components/common/PageLoader";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { getAssignableLeadGroups } from "../../api/leadsApi";
import { getLeadFlow, updateLeadFlow } from "../../api/flowApi";
import { useAuth } from "../../context/AuthContext";
import { LEAD_FLOW_STATUSES } from "../../constants/leadFlowStatuses";
import { useToast } from "../../components/system/ToastProvider";

const emptyRule = (status) => ({
  status,
  handledByGroupId: "",
  next: {},
});

export default function FlowPage() {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canEdit = role === "SUPER_ADMIN";
  const { showSuccess, showError } = useToast();

  const [groups, setGroups] = useState([]);
  const [rules, setRules] = useState(LEAD_FLOW_STATUSES.map(emptyRule));
  const [defaultGroupId, setDefaultGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusPickerRule, setStatusPickerRule] = useState(null);
  const [groupPickerRule, setGroupPickerRule] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState("");
  const [editingStatusName, setEditingStatusName] = useState("");

  const groupOptions = useMemo(
    () => groups.filter((g) => g?.id != null),
    [groups],
  );
  const allStatusOptions = useMemo(() => {
    const names = [
      ...LEAD_FLOW_STATUSES,
      "Rejected",
      ...rules.map((rule) => String(rule?.status || "").trim()),
      ...rules.flatMap((rule) =>
        rule?.next && typeof rule.next === "object"
          ? Object.keys(rule.next).map((item) => String(item || "").trim())
          : [],
      ),
    ].filter(Boolean);
    return Array.from(new Set(names));
  }, [rules]);

  const applyDefaultGroupToRules = (ruleList, groupId) => {
    if (!groupId) return ruleList;
    return ruleList.map((rule) => ({
      ...rule,
      handledByGroupId: rule.handledByGroupId || groupId,
    }));
  };

  const handleDefaultGroupChange = (nextGroupId) => {
    setDefaultGroupId(nextGroupId);
    if (nextGroupId) {
      setRules((prev) => applyDefaultGroupToRules(prev, nextGroupId));
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [flow, groupRows] = await Promise.all([
          getLeadFlow(),
          getAssignableLeadGroups(),
        ]);
        if (!active) return;
        setGroups(Array.isArray(groupRows) ? groupRows : []);
        const loadedRules = Array.isArray(flow?.rules) ? flow.rules : [];
        const knownStatuses = Array.from(
          new Set([
            ...LEAD_FLOW_STATUSES,
            ...loadedRules.map((rule) => String(rule?.status || "").trim()).filter(Boolean),
          ]),
        )
        // drop the old "Accounts" entry if it survives in stored rules
        .filter((s) => String(s || "").trim().toLowerCase() !== "accounts");
        const fallbackGroupId = flow?.defaultGroupId
          ? String(flow.defaultGroupId)
          : groupRows && groupRows.length
            ? String(groupRows[0].id)
            : "";
        setDefaultGroupId(fallbackGroupId);
        const merged = knownStatuses.map((status) => {
          const found = loadedRules.find(
            (rule) =>
              String(rule?.status || "").trim().toLowerCase() ===
              status.toLowerCase(),
          );
          return {
            ...emptyRule(status),
            ...found,
            status,
            handledByGroupId:
              found?.handledByGroupId != null
                ? String(found.handledByGroupId)
                : fallbackGroupId,
            next: found?.next && typeof found.next === "object" ? found.next : {},
          };
        });
        setRules(merged);
      } catch (e) {
        if (active) setError(extractApiErrorMessage(e, "Failed to load flow"));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const toggleNextStatus = (status, nextStatus) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.status !== status) return rule;
        const next = { ...(rule.next || {}) };
        if (next[nextStatus] !== undefined) {
          delete next[nextStatus];
        } else {
          next[nextStatus] = null;
        }
        return { ...rule, next };
      }),
    );
  };

  const updateNextGroup = (status, nextStatus, groupId) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.status !== status) return rule;
        const next = { ...(rule.next || {}) };
        if (next[nextStatus] === undefined) {
          next[nextStatus] = null;
        }
        next[nextStatus] = groupId ? Number(groupId) : null;
        return { ...rule, next };
      }),
    );
  };

  const selectedNextStatuses = (rule) =>
    rule?.next && typeof rule.next === "object" ? Object.keys(rule.next) : [];

  const handleAddStatus = () => {
    const trimmedName = newStatusName.trim();
    if (!trimmedName) {
      alert("Status name cannot be empty");
      return;
    }
    if (rules.some((r) => r.status.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Status already exists");
      return;
    }
    const newRule = {
      status: trimmedName,
      handledByGroupId: defaultGroupId || "",
      next: {},
    };
    setRules((prev) => [...prev, newRule]);
    setNewStatusName("");
    setShowAddModal(false);
    showSuccess("Status added", { title: "Flow" });
  };

  const handleEditStatus = () => {
    if (!editingStatus) return;
    const trimmedName = editingStatusName.trim();
    if (!trimmedName) {
      alert("Status name cannot be empty");
      return;
    }
    // Check if new name conflicts with existing statuses (excluding current)
    if (trimmedName.toLowerCase() !== editingStatus.toLowerCase() &&
        rules.some((r) => r.status.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Status name already exists");
      return;
    }
    setRules((prev) =>
      prev.map((rule) =>
        rule.status === editingStatus
          ? { 
              ...rule, 
              status: trimmedName
            }
          : rule,
      ),
    );
    setEditingStatus(null);
    setEditingGroupId("");
    setEditingStatusName("");
    setShowEditModal(false);
    showSuccess("Status updated", { title: "Flow" });
  };

  const handleDeleteStatus = () => {
    if (!editingStatus) return;
    setRules((prev) => prev.filter((rule) => rule.status !== editingStatus));
    setEditingStatus(null);
    setEditingStatusName("");
    setEditingGroupId("");
    setShowDeleteModal(false);
    showSuccess("Status deleted", { title: "Flow" });
  };

  const openEditModal = (status) => {
    const rule = rules.find((r) => r.status === status);
    if (rule) {
      setEditingStatus(status);
      setEditingStatusName(status);
      setEditingGroupId(rule.handledByGroupId || "");
      setShowEditModal(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        defaultGroupId: defaultGroupId ? Number(defaultGroupId) : null,
        rules: rules.map((rule) => ({
          status: rule.status,
          handledByGroupId: rule.handledByGroupId
            ? Number(rule.handledByGroupId)
            : null,
          next: rule.next || {},
        })),
      };
      await updateLeadFlow(payload);
      showSuccess("Flow saved", { title: "Flow" });
    } catch (e) {
      const message = extractApiErrorMessage(e, "Failed to save flow");
      setError(message);
      showError(message, { title: "Flow" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container-fluid">
      <PageHeader
        title="Flow"
        breadcrumb={[
          { label: "Dashboard", path: "/admin-dashboard" },
          { label: "Settings", path: "" },
          { label: "Flow", path: "" },
        ]}
      />

      {/* notifications handled via toast */}

      <div className="card">
        <div className="card-body">
          {canEdit && (
            <div className="row mb-4">
              <div className="col-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowAddModal(true)}
                  title="Add new status"
                >
                  Add Status
                </button>
              </div>
            </div>
          )}

          {canEdit ? (
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Default Group</label>
                <select
                  className="form-select"
                  value={defaultGroupId}
                  onChange={(e) => handleDefaultGroupChange(e.target.value)}
                >
                  <option value="">Select Default Group</option>
                  {groupOptions.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Default Group</label>
                <select
                  className="form-select"
                  value={defaultGroupId}
                  onChange={(e) => handleDefaultGroupChange(e.target.value)}
                  disabled
                >
                  <option value="">Select Default Group</option>
                  {groupOptions.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Status</th>
                  <th>Handled By Group</th>
                  <th>Allowed Next Status</th>
                  <th>Next Group (per status)</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.status}>
                    <td className="fw-medium">{rule.status}</td>
                    <td>
                      <select
                        className="form-select"
                        value={rule.handledByGroupId || ""}
                        onChange={(e) =>
                          setRules((prev) =>
                            prev.map((r) =>
                              r.status === rule.status
                                ? { ...r, handledByGroupId: e.target.value }
                                : r,
                            ),
                          )
                        }
                        disabled={!canEdit}
                      >
                        <option value="">Select Group</option>
                        {groupOptions.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setStatusPickerRule(rule.status)}
                        disabled={!canEdit}
                      >
                        {selectedNextStatuses(rule).length
                          ? `${selectedNextStatuses(rule).length} selected`
                          : "Select Status"}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setGroupPickerRule(rule.status)}
                        disabled={!canEdit || selectedNextStatuses(rule).length === 0}
                      >
                        {selectedNextStatuses(rule).length
                          ? "Set Next Group"
                          : "No next status"}
                      </button>
                    </td>
                    {canEdit && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm me-2"
                          onClick={() => openEditModal(rule.status)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            setEditingStatus(rule.status);
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {statusPickerRule ? (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
              <div className="card shadow-lg" style={{ width: "100%", maxWidth: "720px" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Allowed Next Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setStatusPickerRule(null)}
                  />
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    {allStatusOptions.filter((status) => status !== statusPickerRule).map((status) => {
                      const rule = rules.find((item) => item.status === statusPickerRule);
                      const checked = rule?.next?.[status] !== undefined;
                      return (
                        <div className="col-md-6" key={`${statusPickerRule}-${status}`}>
                          <label className="d-flex align-items-center gap-2 border rounded px-3 py-2 bg-white text-dark">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleNextStatus(statusPickerRule, status)}
                            />
                            <span className="text-dark fw-medium">{status}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {groupPickerRule ? (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
              <div className="card shadow-lg" style={{ width: "100%", maxWidth: "720px" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Next Group</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setGroupPickerRule(null)}
                  />
                </div>
                <div className="card-body">
                  <div className="d-flex flex-column gap-3">
                    {selectedNextStatuses(rules.find((item) => item.status === groupPickerRule)).map((status) => {
                      const rule = rules.find((item) => item.status === groupPickerRule);
                      return (
                        <div key={`${groupPickerRule}-${status}`} className="d-flex align-items-center gap-3">
                          <div style={{ minWidth: 160 }} className="fw-medium text-dark">{status}</div>
                          <select
                            className="form-select"
                            value={rule?.next?.[status] ?? ""}
                            onChange={(e) => updateNextGroup(groupPickerRule, status, e.target.value)}
                          >
                            <option value="">No Group Change</option>
                            {groupOptions.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                    {selectedNextStatuses(rules.find((item) => item.status === groupPickerRule)).length === 0 ? (
                      <div className="text-muted">No next status selected.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ADD MODAL */}
          {showAddModal && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
              <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Add New Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewStatusName("");
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Status Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter status name"
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddStatus();
                      }}
                    />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewStatusName("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddStatus}
                  >
                    Add Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {showEditModal && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
              <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Edit Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingStatus(null);
                      setEditingStatusName("");
                      setEditingGroupId("");
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Status Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingStatusName || ""}
                      onChange={(e) => setEditingStatusName(e.target.value)}
                      placeholder="Enter status name"
                    />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingStatus(null);
                      setEditingStatusName("");
                      setEditingGroupId("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEditStatus}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELETE MODAL */}
          {showDeleteModal && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
              <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
                <div className="card-header d-flex align-items-center justify-content-between bg-danger text-white">
                  <h5 className="mb-0">Delete Status</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEditingStatus(null);
                      setEditingStatusName("");
                    }}
                  />
                </div>
                <div className="card-body">
                  <p className="mb-0">
                    Are you sure you want to delete the status <strong>{editingStatus}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEditingStatus(null);
                      setEditingStatusName("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteStatus}
                  >
                    Delete Status
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!canEdit || saving}
            >
              {saving ? "Saving..." : "Save Flow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
