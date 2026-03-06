import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import PageLoader from "../../components/common/PageLoader";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { getAssignableLeadGroups } from "../../api/leadsApi";
import { getLeadFlow, updateLeadFlow } from "../../api/flowApi";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_STATUSES = [
  "New Lead",
  "Attempted",
  "Interested",
  "Boq",
  "Payment",
  "Allocate",
];

const emptyRule = (status) => ({
  status,
  handledByGroupId: "",
  next: {},
});

export default function FlowPage() {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canEdit = role === "SUPER_ADMIN";

  const [groups, setGroups] = useState([]);
  const [rules, setRules] = useState(DEFAULT_STATUSES.map(emptyRule));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const groupOptions = useMemo(
    () => groups.filter((g) => g?.id != null),
    [groups],
  );

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
        const merged = DEFAULT_STATUSES.map((status) => {
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
              found?.handledByGroupId != null ? String(found.handledByGroupId) : "",
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

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        rules: rules.map((rule) => ({
          status: rule.status,
          handledByGroupId: rule.handledByGroupId
            ? Number(rule.handledByGroupId)
            : null,
          next: rule.next || {},
        })),
      };
      await updateLeadFlow(payload);
      setNotice("Flow saved");
      setTimeout(() => setNotice(""), 2500);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to save flow"));
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

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Status</th>
                  <th>Handled By Group</th>
                  <th>Allowed Next Status</th>
                  <th>Next Group (per status)</th>
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
                      <div className="d-flex flex-wrap gap-2">
                        {DEFAULT_STATUSES.filter(
                          (status) => status !== rule.status,
                        ).map((status) => (
                          <label
                            key={`${rule.status}-${status}`}
                            className="d-flex align-items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              checked={rule.next?.[status] !== undefined}
                              onChange={() =>
                                toggleNextStatus(rule.status, status)
                              }
                              disabled={!canEdit}
                            />
                            <span className="fs-12">{status}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td>
                      {rule.next && Object.keys(rule.next).length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {Object.keys(rule.next).map((status) => (
                            <div
                              key={`${rule.status}-${status}`}
                              className="d-flex align-items-center gap-2"
                            >
                              <span className="fs-12">{status}</span>
                              <select
                                className="form-select"
                                value={rule.next?.[status] ?? ""}
                                onChange={(e) =>
                                  updateNextGroup(
                                    rule.status,
                                    status,
                                    e.target.value,
                                  )
                                }
                                disabled={!canEdit}
                              >
                                <option value="">No Group Change</option>
                                {groupOptions.map((group) => (
                                  <option key={group.id} value={group.id}>
                                    {group.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No next status</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
