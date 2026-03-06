import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getLeadById,
  updateLeadRowStatus,
  updateLeadDetails,
  getLeadLog,
  getAssignableAllocators,
  getAssignableLeadGroups,
  updateLeadAllocator,
  updateLeadBoq,
  downloadLeadBoqFile,
} from "../../api/leadsApi";
import { getLeadFlow } from "../../api/flowApi";
import { getLeadStatuses, DEFAULT_LEAD_STATUSES } from "../../api/leadStatusApi";
import { getLeadTypes } from "../../api/leadTypeApi";
import { COUNTRY_CODES } from "../../constants/countryCodes";
import { extractApiErrorMessage } from "../../utils/errorMessage";
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

function pickText(row, keys = []) {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value === "string" && value.trim()) {
      const trimmed = value.trim();
      if (/^select\s+allocat/i.test(trimmed)) {
        continue;
      }
      return trimmed;
    }
    if (typeof value === "number" && !Number.isNaN(value)) {
      return String(value);
    }
  }
  return "";
}

function toInputDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function LeadEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const [lead, setLead] = useState(null);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);
  const [leadTypeValue, setLeadTypeValue] = useState("");
  const [typeSaving, setTypeSaving] = useState(false);
  const [alternatePhone, setAlternatePhone] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [occupation, setOccupation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [flowRules, setFlowRules] = useState([]);
  const [showAttemptedModal, setShowAttemptedModal] = useState(false);
  const [attemptedOpenReason, setAttemptedOpenReason] = useState("");
  const [attemptedCallStatus, setAttemptedCallStatus] = useState("");
  const [attemptedCallRemarks, setAttemptedCallRemarks] = useState("");
  const [attemptedFollowUpDate, setAttemptedFollowUpDate] = useState("");
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [interestedFollowUpDate, setInterestedFollowUpDate] = useState("");
  const [interestedCallRemarks, setInterestedCallRemarks] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [rejectedReasonSubtype, setRejectedReasonSubtype] = useState("");
  const [leadLogs, setLeadLogs] = useState([]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateOptions, setAllocateOptions] = useState([]);
  const [allocateOwnerId, setAllocateOwnerId] = useState("");
  const [allocateGroupId, setAllocateGroupId] = useState(null);
  const [allocateGroupName, setAllocateGroupName] = useState("");
  const [autoStatusHandled, setAutoStatusHandled] = useState(false);
  const [showBoqModal, setShowBoqModal] = useState(false);
  const [boqAmount, setBoqAmount] = useState("");
  const [boqNotes, setBoqNotes] = useState("");
  const [boqFile, setBoqFile] = useState(null);
  const [boqFileName, setBoqFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadLead = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const [leadData, statusRows, typeRows, logRows] = await Promise.all([
          getLeadById(id),
          getLeadStatuses(),
          getLeadTypes(),
          getLeadLog(id),
        ]);
        if (!isMounted) return;
        setLead(leadData);
        setLeadLogs(Array.isArray(logRows) ? logRows : []);
        const normalizedStatuses = Array.isArray(statusRows)
          ? statusRows
              .map((item) => item?.leadStatus || item?.name || item?.status || "")
              .filter(Boolean)
              .filter((item) => !/site\s*visit/i.test(item))
          : [];
        setLeadStatuses(
          normalizedStatuses.length ? normalizedStatuses : DEFAULT_LEAD_STATUSES,
        );
        const normalizedTypes = Array.isArray(typeRows)
          ? typeRows
              .map((item) => item?.leadType || item?.name || item?.type || "")
              .filter(Boolean)
          : [];
        setLeadTypeOptions(normalizedTypes);
        setLeadTypeValue(
          pickText(leadData, ["leadType", "lead_type", "type", "leadTypeName"]) ||
            "",
        );
        setAlternatePhone(
          pickText(leadData, [
            "alternatePhone",
            "alternateMobile",
            "altPhone",
            "altMobile",
            "secondaryPhone",
          ]) || "",
        );
        setAlternateEmail(
          pickText(leadData, ["alternateEmail", "altEmail", "secondaryEmail"]) || "",
        );
        setCountryCode(
          pickText(leadData, ["countryCode", "country_code", "dialCode", "dial_code"]) || "",
        );
        setFollowUpDate(
          leadData?.followUpDate ? toInputDateTime(leadData.followUpDate) : "",
        );
        setAttemptedFollowUpDate(
          leadData?.followUpDate ? toInputDateTime(leadData.followUpDate) : "",
        );
        setOccupation(
          pickText(leadData, ["occupation", "jobTitle", "job_title"]) || "",
        );
        setCompanyName(
          pickText(leadData, ["companyName", "company", "organization", "organisation"]) || "",
        );
        setAttemptedOpenReason(
          pickText(leadData, ["attemptedOpenReason", "attempted_open_reason"]) || "",
        );
        setAttemptedCallStatus(
          pickText(leadData, ["attemptedCallStatus", "attempted_call_status"]) || "",
        );
        setAttemptedCallRemarks(
          pickText(leadData, ["attemptedCallRemarks", "attempted_call_remarks"]) || "",
        );
        setInterestedFollowUpDate(
          leadData?.interestedFollowUpDate
            ? toInputDateTime(leadData.interestedFollowUpDate)
            : "",
        );
        setInterestedCallRemarks(
          pickText(leadData, ["interestedCallRemarks", "interested_call_remarks"]) || "",
        );
        setRejectedReason(
          pickText(leadData, ["rejectedReason", "rejected_reason"]) || "",
        );
        setRejectedReasonSubtype(
          pickText(leadData, ["rejectedReasonSubtype", "rejected_reason_subtype"]) || "",
        );
        setBoqAmount(
          pickText(leadData, ["boqAmount", "boq_amount"]) || "",
        );
        setBoqNotes(
          pickText(leadData, ["boqNotes", "boq_notes"]) || "",
        );
        setBoqFileName(
          pickText(leadData, ["boqFileName", "boq_file_name"]) || "",
        );
        setStatusValue("");
      } catch (e) {
        if (!isMounted) return;
        setError(extractApiErrorMessage(e, "Failed to load lead"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadLead();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2300);
    return () => clearTimeout(timer);
  }, [notice]);


  useEffect(() => {
    if (!lead?.id || autoStatusHandled) return;
    const params = new URLSearchParams(location.search || "");
    const nextStatus = String(params.get("status") || "").trim();
    if (!nextStatus) return;
    const nextKey = nextStatus.toLowerCase();
    setStatusValue(nextStatus);
    if (nextKey === "attempted") {
      setShowAttemptedModal(true);
    } else if (nextKey === "interested") {
      setShowInterestedModal(true);
    } else if (nextKey === "rejected") {
      setShowRejectedModal(true);
    } else if (nextKey === "allocate") {
      setShowAllocateModal(true);
    } else if (nextKey === "boq") {
      setShowBoqModal(true);
    }
    setAutoStatusHandled(true);
  }, [lead?.id, location.search, autoStatusHandled]);


  useEffect(() => {
    let active = true;
    const loadFlow = async () => {
      try {
        const flow = await getLeadFlow();
        if (!active) return;
        setFlowRules(Array.isArray(flow?.rules) ? flow.rules : []);
      } catch (e) {
        if (!active) return;
        setFlowRules([]);
      }
    };
    loadFlow();
    return () => {
      active = false;
    };
  }, [role]);

  useEffect(() => {
    if (!showAllocateModal || !lead?.id) return;
    let active = true;
    const loadOptions = async () => {
      try {
        const currentStatus = String(lead?.status || "").trim().toLowerCase();
        const findRule = (status) =>
          Array.isArray(flowRules)
            ? flowRules.find(
                (r) =>
                  String(r?.status || "").trim().toLowerCase() ===
                  String(status || "").trim().toLowerCase(),
              )
            : null;
        const currentRule = findRule(currentStatus);
        let nextGroupId = null;
        if (currentRule?.next && typeof currentRule.next === "object") {
          const allocateKey = Object.keys(currentRule.next).find(
            (key) =>
              String(key || "").trim().toLowerCase() === "allocate",
          );
          if (allocateKey) {
            nextGroupId = currentRule.next[allocateKey] ?? null;
          }
        }
        if (nextGroupId == null) {
          const allocateRule = findRule("allocate");
          if (allocateRule?.handledByGroupId != null) {
            nextGroupId = allocateRule.handledByGroupId;
          }
        }
        setAllocateGroupId(nextGroupId);
        setAllocateGroupName("");
        if (nextGroupId != null) {
          try {
            const groups = await getAssignableLeadGroups();
            const match = groups.find(
              (group) => String(group.id) === String(nextGroupId),
            );
            if (match?.name) {
              setAllocateGroupName(match.name);
            }
          } catch (e) {
            setAllocateGroupName("");
          }
        }
        const rows = await getAssignableAllocators(
          lead.id,
          nextGroupId ? { groupId: nextGroupId } : {},
        );
        if (!active) return;
        setAllocateOptions(Array.isArray(rows) ? rows : []);
      } catch (e) {
        if (!active) return;
        setError(extractApiErrorMessage(e, "Failed to load employees"));
      }
    };
    loadOptions();
    return () => {
      active = false;
    };
  }, [showAllocateModal, lead?.id]);

  const orderedLeadStatuses = [
    ...DEFAULT_LEAD_STATUSES,
    ...leadStatuses,
  ].map((item) => String(item || "").trim()).filter(Boolean).filter((item, index, arr) => arr.indexOf(item) === index);

  const timelineStatuses = ["New Lead", "Attempted", "Interested", "Rejected", "Boq", "Payment"];
  const currentTimelineIndex = timelineStatuses.findIndex(
    (item) => item.toLowerCase() === String(statusValue || "").toLowerCase(),
  );
  const effectiveStatus = (statusValue || lead?.status || "").trim();
  const isNewLead = effectiveStatus.toLowerCase() === "new lead";
  const isAttempted = effectiveStatus.toLowerCase() === "attempted";
  const isInterested = effectiveStatus.toLowerCase() === "interested";
  const isRejected = effectiveStatus.toLowerCase() === "rejected";
  const isBoq = effectiveStatus.toLowerCase() === "boq";
  const lockAfterAttempted = isInterested || isRejected;
  const showAttemptedSummary = isAttempted || isInterested || isRejected;

  const allowedStatusOptions = (() => {
    const current = String(lead?.status || "").trim().toLowerCase();
    if (!current) {
      return orderedLeadStatuses;
    }
    const rule = Array.isArray(flowRules)
      ? flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() === current,
        )
      : null;
    const nextKeys = rule?.next ? Object.keys(rule.next) : [];
    if (rule) {
      if (!nextKeys || nextKeys.length === 0) {
        return [];
      }
      return nextKeys
        .map((item) => String(item || "").trim())
        .filter(Boolean);
    }
    return [];
  })();

  const saveStatus = async () => {
    if (!lead?.id) return;
    if (!statusValue) {
      setError("Please select a status");
      return;
    }
    if (String(statusValue || "").trim().toLowerCase() === "attempted") {
      setShowAttemptedModal(true);
      return;
    }
    if (String(statusValue || "").trim().toLowerCase() === "interested") {
      setShowInterestedModal(true);
      return;
    }
    if (String(statusValue || "").trim().toLowerCase() === "rejected") {
      setShowRejectedModal(true);
      return;
    }
    if (String(statusValue || "").trim().toLowerCase() === "allocate") {
      setShowAllocateModal(true);
      return;
    }
    if (String(statusValue || "").trim().toLowerCase() === "boq") {
      setShowBoqModal(true);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      setNotice("Lead status updated");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update status"));
    } finally {
      setSaving(false);
    }
  };

  const submitAttempted = async () => {
    if (!lead?.id) return;
    if (!attemptedOpenReason || !attemptedCallStatus) {
      setError("Please complete Open Reason and Call Status");
      return;
    }
    if (
      String(attemptedCallStatus || "").trim().toLowerCase() === "follow up" &&
      !attemptedFollowUpDate
    ) {
      setError("Please select Follow Up Date");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const detailsPayload = {
        attemptedOpenReason,
        attemptedCallStatus,
        attemptedCallRemarks,
        followUpDate: attemptedFollowUpDate
          ? new Date(attemptedFollowUpDate).toISOString()
          : null,
      };
      const detailsUpdated = await updateLeadDetails(lead.id, detailsPayload);
      if (attemptedFollowUpDate) {
        setFollowUpDate(attemptedFollowUpDate);
      }
      const updated = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...detailsUpdated, ...updated }));
      setNotice("Lead status updated");
      setShowAttemptedModal(false);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update status"));
    } finally {
      setSaving(false);
    }
  };

  const submitInterested = async () => {
    if (!lead?.id) return;
    if (!interestedFollowUpDate) {
      setError("Please select Follow Up Date");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const detailsPayload = {
        interestedFollowUpDate: new Date(interestedFollowUpDate).toISOString(),
        interestedCallRemarks,
      };
      const detailsUpdated = await updateLeadDetails(lead.id, detailsPayload);
      const updated = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...detailsUpdated, ...updated }));
      setNotice("Lead status updated");
      setShowInterestedModal(false);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update status"));
    } finally {
      setSaving(false);
    }
  };

  const submitRejected = async () => {
    if (!lead?.id) return;
    if (!rejectedReason) {
      setError("Please select Rejected Reason");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const detailsPayload = {
        rejectedReason,
        rejectedReasonSubtype: rejectedReasonSubtype || null,
      };
      const detailsUpdated = await updateLeadDetails(lead.id, detailsPayload);
      const updated = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...detailsUpdated, ...updated }));
      setNotice("Lead status updated");
      setShowRejectedModal(false);
      if (role === "EMPLOYEE") {
        navigate("/leads");
      } else {
        navigate("/rejected-leads");
      }
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update status"));
    } finally {
      setSaving(false);
    }
  };

  const submitAllocate = async () => {
    if (!lead?.id) return;
    if (!allocateOwnerId) {
      setError("Please select an employee");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const ownerUpdated = await updateLeadAllocator(
        lead.id,
        Number(allocateOwnerId),
        allocateGroupId,
      );
      const statusUpdated = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...ownerUpdated, ...statusUpdated }));
      setNotice("Lead allocated");
      setShowAllocateModal(false);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to allocate lead"));
    } finally {
      setSaving(false);
    }
  };

  const submitBoq = async () => {
    if (!lead?.id) return;
    if (!boqNotes && !boqFile) {
      setError("Please provide notes or file");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updatedBoq = await updateLeadBoq(lead.id, {
        amount: boqAmount,
        notes: boqNotes,
        file: boqFile,
      });
      setBoqAmount(
        pickText(updatedBoq, ["boqAmount", "boq_amount"]) || boqAmount || "",
      );
      setBoqNotes(
        pickText(updatedBoq, ["boqNotes", "boq_notes"]) || boqNotes || "",
      );
      setBoqFileName(
        pickText(updatedBoq, ["boqFileName", "boq_file_name"]) || boqFileName || "",
      );
      const updatedStatus = await updateLeadRowStatus(lead.id, statusValue);
      setLead((prev) => ({ ...(prev || {}), ...updatedBoq, ...updatedStatus }));
      setNotice("BOQ updated");
      setShowBoqModal(false);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update BOQ"));
    } finally {
      setSaving(false);
    }
  };

  const openChatPanel = () => {
    if (!lead?.id) return;
    navigate(`/leads/${lead.id}/chat`);
  };

  const handleViewBoqFile = async () => {
    if (!lead?.id) return;
    try {
      const blob = await downloadLeadBoqFile(lead.id);
      if (!blob) {
        setError("BOQ file not available");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to open BOQ file"));
    }
  };

  const saveLeadType = async (nextValue) => {
    if (!lead?.id) return;
    setTypeSaving(true);
    setError("");
    try {
      const updated = await updateLeadDetails(lead.id, { leadType: nextValue });
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      setNotice("Lead type updated");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update lead type"));
    } finally {
      setTypeSaving(false);
    }
  };

  const saveLeadDetails = async () => {
    if (!lead?.id) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        alternatePhone: alternatePhone || null,
        alternateEmail: alternateEmail || null,
        countryCode: countryCode || null,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null,
        occupation: occupation || null,
        companyName: companyName || null,
        attemptedOpenReason: isAttempted ? attemptedOpenReason || null : null,
        attemptedCallStatus: isAttempted ? attemptedCallStatus || null : null,
        attemptedCallRemarks: isAttempted ? attemptedCallRemarks || null : null,
        interestedFollowUpDate: isInterested
          ? interestedFollowUpDate
            ? new Date(interestedFollowUpDate).toISOString()
            : null
          : null,
        interestedCallRemarks: isInterested ? interestedCallRemarks || null : null,
        rejectedReason: isRejected ? rejectedReason || null : null,
        rejectedReasonSubtype: isRejected ? rejectedReasonSubtype || null : null,
      };
      const updated = await updateLeadDetails(lead.id, payload);
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      setNotice("Lead details updated");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update lead details"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-1">Edit Lead</h3>
          <p className="text-muted mb-0">View lead details and status</p>
        </div>
        <button className="btn btn-light" onClick={() => navigate("/leads")}>
          Back to Leads
        </button>
      </div>

      <div className="lead-status-timeline mb-3">
        {timelineStatuses.map((item, index) => {
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

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div>Loading...</div>
          ) : !lead ? (
            <div className="text-muted">Lead not found.</div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="mb-4">
                  <h5 className="mb-3">General Info</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Enquiry Id</label>
                      <input
                        className="form-control"
                        value={
                          pickText(lead, [
                            "enquiryId",
                            "enquiryID",
                            "leadId",
                            "leadID",
                            "lead_id",
                            "enquiryCode",
                            "enquiry_code",
                          ]) || "-"
                        }
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">EUID</label>
                      <input
                        className="form-control"
                        value={pickText(lead, ["euid"]) || "-"}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Enquiry Name</label>
                      <input className="form-control" value={lead.name || ""} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country Code</label>
                      <select
                        className="form-select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={lockAfterAttempted}
                      >
                        <option value="">Select Country Code</option>
                        {COUNTRY_CODES.map((item, index) => (
                          <option key={`${item.code}-${item.name}-${index}`} value={item.code}>
                            {item.name} ({item.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mobile Number</label>
                      <input className="form-control" value={lead.mobile || ""} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input className="form-control" value={lead.email || ""} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Enquiry Project</label>
                      <input className="form-control" value={lead.projectName || ""} readOnly />
                    </div>
                    {!isNewLead && (
                      <>
                        <div className="col-md-6">
                        <label className="form-label">Alternate No.</label>
                        <input
                          className="form-control"
                          value={alternatePhone}
                          onChange={(e) => setAlternatePhone(e.target.value)}
                          readOnly={lockAfterAttempted}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Alternate Email</label>
                        <input
                          className="form-control"
                          value={alternateEmail}
                          onChange={(e) => setAlternateEmail(e.target.value)}
                          readOnly={lockAfterAttempted}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Occupation</label>
                        <input
                          className="form-control"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          readOnly={lockAfterAttempted}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Company Name</label>
                        <input
                          className="form-control"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          readOnly={lockAfterAttempted}
                        />
                      </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="mb-3">Lead Info</h5>
                  <div className="row g-3">
                    {isNewLead && (
                      <div className="col-md-6">
                        <label className="form-label">Lead Group</label>
                        <input
                          className="form-control"
                          value={pickText(lead, ["leadGroupName", "groupName"]) || "-"}
                          readOnly
                        />
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="form-label">Rating</label>
                      <select
                        className="form-select"
                        value={leadTypeValue}
                        onChange={(e) => {
                          const next = e.target.value;
                          setLeadTypeValue(next);
                          saveLeadType(next);
                        }}
                        disabled={typeSaving}
                      >
                        <option value="">Select Rating</option>
                        {leadTypeOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Allocator</label>
                      <input
                        className="form-control"
                        value={
                          pickText(lead, [
                            "Allocator",
                            "allocator",
                            "allocatorName",
                            "createdByName",
                            "createdBy",
                            "createdByUsername",
                            "creator",
                          ]) || "-"
                        }
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Lead Owner</label>
                      <input
                        className="form-control"
                        value={
                          pickText(lead, [
                            "ownerName",
                            "owner",
                            "ownerUsername",
                            "ownerUserName",
                          ]) || "-"
                        }
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Enquiry Status</label>
                      <input className="form-control" value={lead.status || ""} readOnly />
                    </div>
                    {showAttemptedSummary &&
                      String(attemptedCallStatus || "")
                        .trim()
                        .toLowerCase() === "follow up" && (
                        <div className="col-md-6">
                          <label className="form-label">Follow Up Date</label>
                          <input
                            className="form-control"
                            type="datetime-local"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            readOnly={!isAttempted}
                          />
                        </div>
                      )}
                    {showAttemptedSummary && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">Open Reason</label>
                          {isAttempted ? (
                            <select
                              className="form-select"
                              value={attemptedOpenReason}
                              onChange={(e) => setAttemptedOpenReason(e.target.value)}
                            >
                              <option value="">Select Open Reason</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Shared Details">Shared Details</option>
                              <option value="Retry">Retry</option>
                            </select>
                          ) : (
                            <input
                              className="form-control"
                              value={attemptedOpenReason || "-"}
                              readOnly
                            />
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Call Status</label>
                          {isAttempted ? (
                            <select
                              className="form-select"
                              value={attemptedCallStatus}
                              onChange={(e) => {
                                const next = e.target.value;
                                setAttemptedCallStatus(next);
                                if (String(next || "").trim().toLowerCase() !== "follow up") {
                                  setAttemptedFollowUpDate("");
                                }
                              }}
                            >
                              <option value="">Select Call Status</option>
                              <option value="RNR">RNR</option>
                              <option value="Call Connected">Call Connected</option>
                              <option value="Follow Up">Follow Up</option>
                              <option value="Number Busy">Number Busy</option>
                              <option value="Not Reachable">Not Reachable</option>
                              <option value="Switched Off">Switched Off</option>
                              <option value="Number Not In Use">Number Not In Use</option>
                              <option value="Wrong Number">Wrong Number</option>
                            </select>
                          ) : (
                            <input
                              className="form-control"
                              value={attemptedCallStatus || "-"}
                              readOnly
                            />
                          )}
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Call Remarks</label>
                          {isAttempted ? (
                            <textarea
                              className="form-control"
                              rows={3}
                              value={attemptedCallRemarks}
                              onChange={(e) => setAttemptedCallRemarks(e.target.value)}
                              placeholder="Call Remarks"
                            />
                          ) : (
                            <textarea
                              className="form-control"
                              rows={3}
                              value={attemptedCallRemarks || "-"}
                              readOnly
                            />
                          )}
                        </div>
                      </>
                    )}
                    {isInterested && (
                      <>
                        <div className="col-12">
                          <h6 className="mb-1">Interested Info</h6>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Follow Up Date</label>
                          <input
                            className="form-control"
                            type="datetime-local"
                            value={interestedFollowUpDate}
                            onChange={(e) => setInterestedFollowUpDate(e.target.value)}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Call Remarks</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={interestedCallRemarks}
                            onChange={(e) => setInterestedCallRemarks(e.target.value)}
                            placeholder="Call Remarks"
                          />
                        </div>
                      </>
                    )}
                    {isRejected && (
                      <>
                        <div className="col-12">
                          <h6 className="mb-1">Rejected Info</h6>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Rejected Reason</label>
                          <select
                            className="form-select"
                            value={rejectedReason}
                            onChange={(e) => setRejectedReason(e.target.value)}
                          >
                            <option value="">Reject Reason</option>
                            <option value="Budget Too High">Budget Too High</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Already Purchased">Already Purchased</option>
                            <option value="Chose Competitor">Chose Competitor</option>
                            <option value="Decision Postponed">Decision Postponed</option>
                            <option value="No Requirement Now">No Requirement Now</option>
                            <option value="Not Reachable">Not Reachable</option>
                            <option value="Wrong Contact">Wrong Contact</option>
                            <option value="Invalid/Incomplete Details">Invalid/Incomplete Details</option>
                            <option value="Location Not Serviceable">Location Not Serviceable</option>
                            <option value="Timeline Mismatch">Timeline Mismatch</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Rejected Reason Subtype</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={rejectedReasonSubtype}
                            onChange={(e) => setRejectedReasonSubtype(e.target.value)}
                            placeholder="Rejected Reason Subtype"
                          />
                        </div>
                      </>
                    )}
                    {isBoq && (
                      <>
                        <div className="col-12">
                          <h6 className="mb-1">BOQ Info</h6>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Notes</label>
                          <input className="form-control" value={boqNotes || "-"} readOnly />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">File</label>
                          <div className="d-flex gap-2">
                            <input className="form-control" value={boqFileName || "-"} readOnly />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleViewBoqFile}
                              disabled={!boqFileName}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={openChatPanel}
                            >
                              Chat
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card border">
                  <div className="card-body">
                    <h5 className="mb-3">Lead Status</h5>
                  {allowedStatusOptions.length > 0 && (
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        {allowedStatusOptions.map((item) => (
                          <span
                            key={item}
                            className={`badge ${item === statusValue ? "bg-primary" : "bg-light text-dark"}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <label className="form-label">Status</label>
                    <select
                      className="form-select mb-3"
                      value={statusValue}
                      onChange={(e) => {
                      const next = e.target.value;
                      setStatusValue(next);
                      if (String(next || "").trim().toLowerCase() === "attempted") {
                        if (!attemptedFollowUpDate && followUpDate) {
                          setAttemptedFollowUpDate(followUpDate);
                        }
                        setShowAttemptedModal(true);
                      }
                      if (String(next || "").trim().toLowerCase() === "interested") {
                        setShowInterestedModal(true);
                      }
                      if (String(next || "").trim().toLowerCase() === "rejected") {
                        setShowRejectedModal(true);
                      }
                      if (String(next || "").trim().toLowerCase() === "allocate") {
                        setShowAllocateModal(true);
                      }
                      if (String(next || "").trim().toLowerCase() === "boq") {
                        setShowBoqModal(true);
                      }
                    }}
                    >
                      <option value="">Select Status</option>
                    {allowedStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                    <button
                      className="btn btn-primary w-100"
                      onClick={saveStatus}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Status"}
                    </button>
                  </div>
                </div>

                <div className="card border mt-3">
                  <div className="card-body">
                    <h5 className="mb-3">Save Lead Details</h5>
                    <button
                      className="btn btn-primary w-100"
                      onClick={saveLeadDetails}
                      disabled={saving || typeSaving}
                    >
                      {saving ? "Saving..." : "Save Details"}
                    </button>
                  </div>
                </div>

                <div className="card border mt-3">
                  <div className="card-body">
                    <ul className="nav nav-tabs mb-3" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="lead-log-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#lead-log"
                          type="button"
                          role="tab"
                          aria-controls="lead-log"
                          aria-selected="true"
                        >
                          Lead Log
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="call-history-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#call-history"
                          type="button"
                          role="tab"
                          aria-controls="call-history"
                          aria-selected="false"
                        >
                          Call History
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="lead-log"
                        role="tabpanel"
                        aria-labelledby="lead-log-tab"
                      >
                        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                          {leadLogs.length === 0 ? (
                            <div className="text-muted">No lead log yet.</div>
                          ) : (
                            <div className="d-flex flex-column gap-3">
                              {leadLogs.map((item) => (
                                <div key={item.id || `${item.action}-${item.createdAt}`}>
                                  <div className="d-flex align-items-start gap-3">
                                    <div
                                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                      style={{ width: "48px", height: "48px", fontWeight: 600 }}
                                    >
                                      {(item.actor || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="fw-medium">{item.action || "Log Entry"}</div>
                                      <div className="text-muted">by {item.actor || "user"}</div>
                                      <div className="text-muted">
                                        on {formatDateTime(item.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="call-history"
                        role="tabpanel"
                        aria-labelledby="call-history-tab"
                      >
                        <div className="text-muted">No call history yet.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {showAttemptedModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Attempted</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowAttemptedModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Open Reason</label>
                <select
                  className="form-select"
                  value={attemptedOpenReason}
                  onChange={(e) => setAttemptedOpenReason(e.target.value)}
                >
                  <option value="">Select Open Reason</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Shared Details">Shared Details</option>
                  <option value="Retry">Retry</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Call Status</label>
                <select
                  className="form-select"
                  value={attemptedCallStatus}
                  onChange={(e) => {
                    const next = e.target.value;
                    setAttemptedCallStatus(next);
                    if (String(next || "").trim().toLowerCase() !== "follow up") {
                      setAttemptedFollowUpDate("");
                    }
                  }}
                >
                  <option value="">Select Call Status</option>
                  <option value="RNR">RNR</option>
                  <option value="Call Connected">Call Connected</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Number Busy">Number Busy</option>
                  <option value="Not Reachable">Not Reachable</option>
                  <option value="Switched Off">Switched Off</option>
                  <option value="Number Not In Use">Number Not In Use</option>
                  <option value="Wrong Number">Wrong Number</option>
                </select>
              </div>
              {String(attemptedCallStatus || "").trim().toLowerCase() === "follow up" && (
                <div className="mb-3">
                  <label className="form-label">Follow Up Date</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    value={attemptedFollowUpDate}
                    onChange={(e) => setAttemptedFollowUpDate(e.target.value)}
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Call Remarks</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={attemptedCallRemarks}
                  onChange={(e) => setAttemptedCallRemarks(e.target.value)}
                  placeholder="Call Remarks"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitAttempted} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInterestedModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Interested</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowInterestedModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Follow Up Date</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={interestedFollowUpDate}
                  onChange={(e) => setInterestedFollowUpDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Call Remarks</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={interestedCallRemarks}
                  onChange={(e) => setInterestedCallRemarks(e.target.value)}
                  placeholder="Call Remarks"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitInterested} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectedModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Rejected Reason</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowRejectedModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Rejected Reason</label>
                <select
                  className="form-select"
                  value={rejectedReason}
                  onChange={(e) => setRejectedReason(e.target.value)}
                >
                  <option value="">Reject Reason</option>
                  <option value="Budget Too High">Budget Too High</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Already Purchased">Already Purchased</option>
                  <option value="Chose Competitor">Chose Competitor</option>
                  <option value="Decision Postponed">Decision Postponed</option>
                  <option value="No Requirement Now">No Requirement Now</option>
                  <option value="Not Reachable">Not Reachable</option>
                  <option value="Wrong Contact">Wrong Contact</option>
                  <option value="Invalid/Incomplete Details">Invalid/Incomplete Details</option>
                  <option value="Location Not Serviceable">Location Not Serviceable</option>
                  <option value="Timeline Mismatch">Timeline Mismatch</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Rejected Reason Subtype</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectedReasonSubtype}
                  onChange={(e) => setRejectedReasonSubtype(e.target.value)}
                  placeholder="Rejected Reason Subtype"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitRejected} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAllocateModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Allocate Lead</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowAllocateModal(false)}
              />
            </div>
            <div className="card-body">
              {allocateGroupId && (
                <div className="mb-3">
                  <label className="form-label">Allocate Group</label>
                  <div className="form-control bg-light">
                    {allocateGroupName || `Group #${allocateGroupId}`}
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <select
                  className="form-select"
                  value={allocateOwnerId}
                  onChange={(e) => setAllocateOwnerId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {allocateOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.username} {item.role ? `(${item.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitAllocate} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBoqModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">BOQ</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowBoqModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">BOQ Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={boqNotes}
                  onChange={(e) => setBoqNotes(e.target.value)}
                  placeholder="Add notes"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File</label>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setBoqFile(file);
                    setBoqFileName(file?.name || "");
                  }}
                />
                {boqFileName && (
                  <div className="text-muted mt-1">{boqFileName}</div>
                )}
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitBoq} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
