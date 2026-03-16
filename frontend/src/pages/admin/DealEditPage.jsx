import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDealById } from "../../api/dealsApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getLeadById,
  updateLeadRowStatus,
  updateLeadDetails,
  getLeadLog,
  getAssignableAllocators,
  getAssignableLeadGroups,
  updateLeadAllocator,
  getLeadChatMessages,
  sendLeadChatAttachment,
  downloadLeadChatAttachment,
  uploadLeadPaymentProof,
} from "../../api/leadsApi";
import { getAddressesbyLeadId, createAddress, getAddressesByLeadIdAndType } from "../../api/addressApi";
import { createStockRequest, getStockItems } from "../../api/stocksApi";
import { getDealFlow } from "../../api/flowApi";
import { getLeadStatuses, DEFAULT_LEAD_STATUSES } from "../../api/leadStatusApi";
import { getLeadTypes } from "../../api/leadTypeApi";
import { COUNTRY_CODES } from "../../constants/countryCodes";
import { extractApiErrorMessage } from "../../utils/errorMessage";
import { COUNTRY_CODE_OPTIONS, getCountryAllowedLengths, getCountryOptionByValue, sanitizePhoneDigits, validatePhoneNumber } from "../../utils/phoneUtils";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/system/ToastProvider";
import StockRequestFormModal from "../../components/system/StockRequestFormModal";

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

function formatDateOnly(value) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString();
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

function normalizeCountryCode(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.startsWith("+") ? raw : `+${raw}`;
}

const DEFAULT_CUSTOMER_LOGIN_PASSWORD = "Customer@123";

export default function DealEditPage() {
  const params = useParams();
  const dealId = params.id;
  const [id, setId] = useState(null);
  const [dealData, setDealData] = useState(null);
  const [dealLoadError, setDealLoadError] = useState("");

  useEffect(() => {
    if (!dealId) return;
    getDealById(dealId)
      .then((d) => {
        if (d?.sourceLeadId) {
          setDealData(d);
          setId(String(d.sourceLeadId));
        } else setDealLoadError("Deal not found");
      })
      .catch(() => setDealLoadError("Failed to load deal"));
  }, [dealId]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const { showSuccess } = useToast();
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
  const [showDesignDurationModal, setShowDesignDurationModal] = useState(false);
  const [designMessages, setDesignMessages] = useState([]);
  const [showStockRequestModal, setShowStockRequestModal] = useState(false);
  const [stockRequestSubmitting, setStockRequestSubmitting] = useState(false);
  const [stockRequestError, setStockRequestError] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [designUploadFile, setDesignUploadFile] = useState(null);
  const [finalDesignMessage, setFinalDesignMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [requirementType, setRequirementType] = useState("");
  const [requirementFile, setRequirementFile] = useState(null);
  const [requirementFileName, setRequirementFileName] = useState("");
  const [requirementNotes, setRequirementNotes] = useState("");
  const [requirementSaving, setRequirementSaving] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPaidAmount, setVerifyPaidAmount] = useState("");
  const [verifyNotes, setVerifyNotes] = useState("");
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyFileName, setVerifyFileName] = useState("");
  
  // Address-related state for payment verification
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(null);
  const [shipSame, setShipSame] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [newAddressType, setNewAddressType] = useState("BILLING");
  const [newAddressContactName, setNewAddressContactName] = useState("");
  const [newAddressCompanyName, setNewAddressCompanyName] = useState("");
  const [newAddressGstin, setNewAddressGstin] = useState("");
  const [newAddressCountryCode, setNewAddressCountryCode] = useState("+91");
  const [newAddressPhone, setNewAddressPhone] = useState("");
  const [newAddressPhoneError, setNewAddressPhoneError] = useState("");
  const [newAddressEmail, setNewAddressEmail] = useState("");
  const [newAddressLine1, setNewAddressLine1] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressState, setNewAddressState] = useState("");
  const [newAddressPincode, setNewAddressPincode] = useState("");
  const [newAddressCountry, setNewAddressCountry] = useState("India");
  const [newAddressPrimary, setNewAddressPrimary] = useState(false);

  const DESIGN_THREAD_MARKER = "[[design-thread]]";
  function hasDesignThreadMarker(value) {
    return String(value || "").trimStart().startsWith(DESIGN_THREAD_MARKER);
  }
  function stripDesignThreadMarker(value) {
    const raw = String(value || "");
    if (!hasDesignThreadMarker(raw)) return raw;
    const startTrimmed = raw.trimStart();
    const withoutMarker = startTrimmed.slice(DESIGN_THREAD_MARKER.length);
    return withoutMarker.replace(/^\s+/, "");
  }

  function parseDesignMessageSummary(message) {
    const text = stripDesignThreadMarker(message || "").trim();
    const lower = text.toLowerCase();

    if (lower.startsWith("customer selected: accept")) {
      return { heading: "Design Accepted", type: "accept" };
    }

    if (lower.startsWith("customer selected: reject")) {
      const match = text.match(/\(([^)]+)\)\s*$/);
      return {
        heading: "Design Rejected",
        type: "reject",
        value: match?.[1]?.trim() || "",
      };
    }

    if (lower.startsWith("customer requested change:")) {
      return {
        heading: "Design Change",
        type: "change",
        value: text.slice("Customer requested change:".length).trim(),
      };
    }

    return null;
  }

  function isFinalDesignUploadMessage(row) {
    const text = stripDesignThreadMarker(row?.message || "").trim().toLowerCase();
    return text === "final design uploaded" && !!row?.attachmentName;
  }

  function getDesignDurationDays(startValue, endValue) {
    if (!startValue || !endValue) return "";
    const start = new Date(startValue);
    const end = new Date(endValue);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "";
    return String(Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [designStartAt, setDesignStartAt] = useState("");
  const [designEndAt, setDesignEndAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        
        // Overlay deal data over lead data BEFORE setting state
        if (dealData?.status != null) leadData.status = dealData.status;
        if (dealData?.totalAmount != null) leadData.totalAmount = dealData.totalAmount;
        if (dealData?.paidAmount != null) leadData.paidAmount = dealData.paidAmount;
        if (dealData?.remainingAmount != null) leadData.remainingAmount = dealData.remainingAmount;
        // NOTE: do NOT overlay invoiceData/invoiceCgstPercent/invoiceSgstPercent from deal —
        // the lead is always the source of truth for invoice (all saves go to the lead via updateLeadDetails).
        // The deal's invoiceData is a stale snapshot that diverges after every payment approval.
        
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
          normalizeCountryCode(
            pickText(leadData, ["countryCode", "country_code", "dialCode", "dial_code"]),
          ),
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
        setTotalAmount(
          pickText(leadData, ["totalAmount", "total_amount"]) || (dealData?.totalAmount != null ? String(dealData.totalAmount) : ""),
        );
        const loadedTotal = pickText(leadData, ["totalAmount", "total_amount"]) || (dealData?.totalAmount != null ? String(dealData.totalAmount) : "");
        const loadedPaid = pickText(leadData, ["paidAmount", "paid_amount"]) || (dealData?.paidAmount != null ? String(dealData.paidAmount) : "0");
        const loadedRemaining = pickText(leadData, ["remainingAmount", "remaining_amount"]) || (dealData?.remainingAmount != null ? String(dealData.remainingAmount) : "");

        setTotalAmount(loadedTotal);
        setPaidAmount(loadedPaid);
        setRemainingAmount(
          loadedRemaining || String(Math.max(0, Number(loadedTotal || 0) - Number(loadedPaid || 0))),
        );
        // design timing fields may be added during payment chat
        setDesignStartAt(
          leadData?.designStartAt ? toInputDateTime(leadData.designStartAt) : "",
        );
        setDesignEndAt(
          leadData?.designEndAt ? toInputDateTime(leadData.designEndAt) : "",
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
  }, [id, dealData]);


  useEffect(() => {
    if (!lead?.id || autoStatusHandled) return;
    const params = new URLSearchParams(location.search || "");
    const nextStatus = String(params.get("status") || "").trim();
    if (!nextStatus) return;
    const nextKey = nextStatus.toLowerCase();
    setStatusValue(nextStatus);
    if (nextKey === "attempted" && statusNeedsModal(nextKey)) {
      setShowAttemptedModal(true);
    } else if (nextKey === "interested" && statusNeedsModal(nextKey)) {
      setShowInterestedModal(true);
    } else if (nextKey === "rejected" && statusNeedsModal(nextKey)) {
      setShowRejectedModal(true);
    } else if (nextKey === "requirement" && statusNeedsModal(nextKey)) {
      setShowRequirementModal(true);
    } else if (nextKey === "allocate") {
      setShowAllocateModal(true);
    }
    setAutoStatusHandled(true);
  }, [lead?.id, location.search, autoStatusHandled]);

  // Fetch addresses whenverify modal opens
  useEffect(() => {
    if (!showVerifyModal || !lead?.id || addressLoading) return;
    
    const fetchAddresses = async () => {
      setAddressLoading(true);
      try {
        const billingList = await getAddressesByLeadIdAndType(lead.id, "BILLING");
        const shippingList = await getAddressesByLeadIdAndType(lead.id, "SHIPPING");
        setBillingAddresses(billingList || []);
        setShippingAddresses(shippingList || []);
        
        // Auto-select primary billing address
        const primaryBilling = billingList?.find(a => a.isPrimary);
        if (primaryBilling) {
          setSelectedBillingAddressId(primaryBilling.id);
        } else if (billingList?.length > 0) {
          setSelectedBillingAddressId(billingList[0].id);
        }
      } catch (e) {
        console.error("Failed to fetch addresses:", e);
      } finally {
        setAddressLoading(false);
      }
    };
    
    fetchAddresses();
  }, [showVerifyModal, lead?.id]);

  const effectiveStatus = String(lead?.status || "").trim();
  const statusLower = effectiveStatus.toLowerCase();

  const normalizeKey = (s) => String(s || "").trim().toLowerCase();
  // include the new "requirement" stage so that when a lead is in
  // requirement status all earlier tabs (attempted/interested/etc.) keep
  // appearing.  the stage order reflects progression through the flow.
  const leadStageOrder = [
    "new lead",
    "attempted",
    "interested",
    "requirement",
    "design",
    "payment",
    "production",
  ];
  const currentStageIndex = leadStageOrder.indexOf(statusLower);
  const hasReachedStage = (stage) => {
    const targetIndex = leadStageOrder.indexOf(String(stage || "").toLowerCase());
    if (targetIndex === -1 || currentStageIndex === -1) return false;
    return currentStageIndex >= targetIndex;
  };

  // determine if the modal for a given status should be shown based on existing lead data
  const statusNeedsModal = (status) => {
    if (!lead) return true;
    const key = String(status || "").trim().toLowerCase();
    switch (key) {
      case "attempted":
        return !lead.attemptedOpenReason || !lead.attemptedCallStatus;
      case "interested":
        return !lead.interestedFollowUpDate;
      case "rejected":
        return !lead.rejectedReason;
      case "requirement":
      case "budget":
        // Only show requirement modal when requirement details are missing.
        return !(
          (lead.requirementType && String(lead.requirementType).trim()) ||
          (lead.requirementNotes && String(lead.requirementNotes).trim()) ||
          (lead.requirementFileName && String(lead.requirementFileName).trim())
        );
      case "design":
        return !lead.designStartAt || !lead.designEndAt;
      default:
        return true;
    }
  };

  // Computed status flags
  const isNewLead = statusLower === "new lead";
  const isAttempted = statusLower === "attempted";
  const isInterested = statusLower === "interested";
  const isRejected = statusLower === "rejected";
  const isDesign = statusLower === "design";
  const isPayment = statusLower === "payment";
  const isProduction = statusLower === "production";
  const isEmployeeDesignView = role === "EMPLOYEE" && statusLower === "design";
  const lockAfterAttempted = hasReachedStage("interested") || isRejected;
  const hasAttemptedData = Boolean(
    lead?.attemptedOpenReason || lead?.attemptedCallStatus || lead?.attemptedCallRemarks,
  );
  const hasInterestedData = Boolean(
    lead?.interestedFollowUpDate || lead?.interestedCallRemarks,
  );
  const hasRequirementData = Boolean(
    lead?.requirementType || lead?.requirementNotes || lead?.requirementFileName,
  );
  const hasDesignData = Boolean(
    lead?.designStartAt || lead?.designEndAt || finalDesignMessage?.id,
  );
  const hasPaymentData = Boolean(
    lead?.totalAmount != null ||
      lead?.paidAmount != null ||
      lead?.remainingAmount != null ||
      lead?.paymentOwnerId != null,
  );

  const showAttemptedSummary = hasAttemptedData || isAttempted;
  const showInterestedSummary = hasInterestedData || isInterested;
  const showRequirementSummary = hasRequirementData || statusLower === "requirement" || statusLower === "budget";
  const showDesignSummary = hasDesignData || isDesign;
  const showPaymentSummary =
    hasPaymentData ||
    isPayment ||
    isProduction ||
    role === "EMPLOYEE" ||
    statusLower === "budget";

  const parsedInvoice = (() => {
    if (!lead?.invoiceData) return null;
    try { return JSON.parse(lead.invoiceData); } catch { return null; }
  })();

  const handleDownloadInvoice = () => {
    if (!parsedInvoice) return;
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageMargin = 10;
      const invoiceNumber = `INV-${lead.leadId || lead.id}`;
      doc.setFontSize(18);
      doc.text("INVOICE", pageMargin, 15);
      doc.setFontSize(10);
      doc.text("SVL Printing and Packaging", pageMargin, 25);
      doc.text("GSTIN: 07AABCS1234H1Z0", pageMargin, 30);
      doc.text("103-A, Industrial Complex, SVL Business Park", pageMargin, 35);
      doc.text("Bangalore, Karnataka, 560001, India", pageMargin, 40);
      doc.setFontSize(9);
      doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - pageMargin - 60, 25);
      doc.text(`Date: ${parsedInvoice.createdAt ? new Date(parsedInvoice.createdAt).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}`, pageWidth - pageMargin - 60, 30);
      doc.text(`Lead: ${lead.name}`, pageWidth - pageMargin - 60, 35);
      const itemsWithTotals = (parsedInvoice.items || []).map(item => ({
        ...item,
        subtotal: item.subtotal ?? (Number(item.quantity) * Number(item.unitPrice)),
      }));
      autoTable(doc, {
        startY: 55,
        head: [["#", "Description", "HSN", "Qty", "Unit Price", "Amount"]],
        body: itemsWithTotals.map((item, idx) => [
          String(idx + 1),
          item.description,
          item.hsn || "",
          Number(item.quantity).toFixed(2),
          Number(item.unitPrice).toFixed(2),
          Number(item.subtotal).toFixed(2),
        ]),
        margin: { left: pageMargin, right: pageMargin },
        styles: { fontSize: 7.8, cellPadding: 1.5 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: { 0: { halign: "center", cellWidth: 10 }, 3: { halign: "right", cellWidth: 18 }, 4: { halign: "right", cellWidth: 28 }, 5: { halign: "right", cellWidth: 28 } },
      });
      const t = parsedInvoice.totals || {};
      const finalY = (doc.lastAutoTable?.finalY || 55) + 5;
      const sx = pageWidth - 72;
      const sv = pageWidth - pageMargin;
      const gap = 4.2;
      doc.setFontSize(8.5);
      doc.text("Subtotal:", sx, finalY);
      doc.text(`Rs ${Number(t.subtotal || 0).toFixed(2)}`, sv, finalY, { align: "right" });
      doc.text(`CGST (${Number(t.cgstPercent || 0).toFixed(2)}%):`, sx, finalY + gap);
      doc.text(`Rs ${Number(t.cgst || 0).toFixed(2)}`, sv, finalY + gap, { align: "right" });
      doc.text(`SGST (${Number(t.sgstPercent || 0).toFixed(2)}%):`, sx, finalY + gap * 2);
      doc.text(`Rs ${Number(t.sgst || 0).toFixed(2)}`, sv, finalY + gap * 2, { align: "right" });
      doc.setFontSize(9);
      doc.text("Grand Total:", sx, finalY + gap * 3);
      doc.text(`Rs ${Number(t.grandTotal || 0).toFixed(2)}`, sv, finalY + gap * 3, { align: "right" });
      doc.save(`Invoice-${invoiceNumber}.pdf`);
    } catch (err) {
      console.error("Failed to generate invoice PDF:", err);
    }
  };

  // Set active tab based on current lead status
  useEffect(() => {
    if (!lead?.id) return;

    let tabToActivate = "general";

    if (statusLower === "attempted") {
      tabToActivate = "attempted";
    } else if (statusLower === "interested") {
      tabToActivate = "interested";
    } else if (statusLower === "design") {
      tabToActivate = "design";
    } else if (statusLower === "payment" || statusLower === "production") {
      tabToActivate = "payment";
    } else if (statusLower === "budget") {
      tabToActivate = "budget";
    } else if (statusLower === "requirement") {
      tabToActivate = "requirement";
    } else if (statusLower === "rejected") {
      tabToActivate = "rejected";
    }
    
    setActiveTab(tabToActivate);
  }, [lead?.id, effectiveStatus]);

  useEffect(() => {
    if (!lead?.id) return;
    const statusKey = effectiveStatus.toLowerCase();
    if (statusKey !== "design" && statusKey !== "payment" && statusKey !== "production") return;
    getLeadChatMessages(lead.id, "CUSTOMER")
      .then((rows) => {
        const source = Array.isArray(rows) ? rows : [];
        const list = source.filter((m) => {
          if (m.senderRole !== "CUSTOMER") return false;
          const msg = String(m?.message || "");
          const lower = msg.trim().toLowerCase();
          const isCustomerChoice =
            lower.startsWith("customer selected:") ||
            lower.startsWith("customer requested change");
          return hasDesignThreadMarker(msg) || isCustomerChoice;
        });
        const finalUpload = [...source].reverse().find((m) => isFinalDesignUploadMessage(m)) || null;
        setDesignMessages(list);
        setFinalDesignMessage(finalUpload);
      })
      .catch((err) => {
        console.error("failed to load design messages", err);
        setDesignMessages([]);
        setFinalDesignMessage(null);
      });
  }, [lead?.id, effectiveStatus]);


  useEffect(() => {
    let active = true;
    const loadFlow = async () => {
      try {
        const flow = await getDealFlow();
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
    let active = true;
    const loadItems = async () => {
      try {
        const rows = await getStockItems();
        if (!active) return;
        setStockItems(Array.isArray(rows) ? rows : []);
      } catch (e) {
        console.error("failed to load stock items", e);
      }
    };
    loadItems();
    return () => {
      active = false;
    };
  }, []);

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

  const flowStatuses = Array.isArray(flowRules)
    ? flowRules
        .flatMap((rule) => {
          const base = String(rule?.status || "").trim();
          const next =
            rule?.next && typeof rule.next === "object"
              ? Object.keys(rule.next).map((k) => String(k || "").trim())
              : [];
          return [base, ...next];
        })
        .filter(Boolean)
    : [];

  const orderedLeadStatuses = [
    ...DEFAULT_LEAD_STATUSES,
    ...leadStatuses,
    ...flowStatuses,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  // build timeline based on the user's actual progression (not just the full flow list)
  const timelineStatuses = (() => {
    const base = leadStageOrder.filter((stage) => {
      // always show the initial "New Lead" stage
      if (stage === "new lead") return true;
      // only show stages that have been reached or have data filled
      if (stage === "attempted") return showAttemptedSummary || isAttempted;
      if (stage === "interested") return showInterestedSummary || isInterested;
      if (stage === "requirement") return showRequirementSummary || statusLower === "requirement";
      if (stage === "design") return showDesignSummary || isDesign;
      if (stage === "payment") return showPaymentSummary || isPayment || isProduction;
      if (stage === "production") return isProduction;
      return true;
    });

    // Include any additional statuses referenced in flow rules (e.g., custom statuses)
    if (Array.isArray(flowRules)) {
      flowRules.forEach((rule) => {
        if (rule && rule.next && typeof rule.next === "object") {
          Object.keys(rule.next).forEach((s) => {
            if (s && !base.includes(s)) {
              base.push(s);
            }
          });
        }
      });
    }

    return base;
  })();

  const currentTimelineIndex = timelineStatuses.findIndex(
    (item) => item.toLowerCase() === effectiveStatus.toLowerCase(),
  );

  const allowedStatusOptions = (() => {
    const current = String(lead?.status || "").trim().toLowerCase();
    if (!current) {
      return orderedLeadStatuses;
    }
    
    // Find the flow rule for the current status
    const rule = Array.isArray(flowRules)
      ? flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() === current,
        )
      : null;
    
    // Rule exists — only show explicitly configured next statuses
    if (rule) {
      if (rule.next && typeof rule.next === "object") {
        const nextKeys = Object.keys(rule.next);
        if (nextKeys.length > 0) {
          return nextKeys
            .map((item) => String(item || "").trim())
            .filter(Boolean);
        }
      }
      // Rule exists but no next statuses configured → block transitions
      return [];
    }
    
    // No flow rule at all for this status → show all as fallback
    return orderedLeadStatuses;
  })();


  const saveStatus = async () => {
    if (!lead?.id) return;
    const currentKey = String(lead?.status || "").trim().toLowerCase();
    if (
      currentKey === "design" &&
      statusValue &&
      String(statusValue || "").trim().toLowerCase() !== "design"
    ) {
      if (!finalDesignMessage?.id) {
        setError("Please upload the final design before changing status from Design");
        return;
      }
    }
    if (!statusValue) {
      setError("Please select a status");
      return;
    }
    const normalizedKey = String(statusValue || "").trim().toLowerCase();
    // only intercept status transitions if the corresponding form needs to be filled
    if (normalizedKey === "attempted" && statusNeedsModal(normalizedKey)) {
      setShowAttemptedModal(true);
      return;
    }
    if (normalizedKey === "interested" && statusNeedsModal(normalizedKey)) {
      setShowInterestedModal(true);
      return;
    }
    if (normalizedKey === "rejected" && statusNeedsModal(normalizedKey)) {
      setShowRejectedModal(true);
      return;
    }
    if ((normalizedKey === "requirement" || normalizedKey === "budget") && statusNeedsModal(normalizedKey)) {
      setShowRequirementModal(true);
      return;
    }
    if (normalizedKey === "allocate") {
      setShowAllocateModal(true);
      return;
    }

    setSaving(true);
    setError("");
    try {
      // Determine the nextGroupId based on flow rules for the target status
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }

      const updated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      let key = normalizedKey;
      
      // Assign verification to the current user when status changes to budget or payment
      if (key === "budget") {
        try {
          console.log("Assigning budget verification to user:", user?.id);
          await updateLeadDetails(lead.id, { budgetVerificationAssignedToUserId: user?.id });
          console.log("✓ Budget verification assigned successfully");
        } catch (err) {
          console.warn("Failed to assign budget verification", err);
        }
      }
      
      if (key === "payment") {
        try {
          console.log("Assigning payment verification to user:", user?.id);
          await updateLeadDetails(lead.id, { paymentVerificationAssignedToUserId: user?.id });
          console.log("✓ Payment verification assigned successfully");
        } catch (err) {
          console.warn("Failed to assign payment verification", err);
        }
      }
      
      if (key === "payment" || key === "design" || key === "production") {
        if ((key === "design" || key === "production") && lead.ownerUserId) {
          await updateLeadDetails(lead.id, { paymentOwnerId: lead.ownerUserId });
        }
        const ownerToUse = null;
        const groupId = null;
        try {
          const allocators = [];
          if (allocators.length > 0) {
            let nextAllocator = null;
            if (ownerToUse) {
              nextAllocator = allocators.find((a) => String(a.id) === String(ownerToUse));
              if (nextAllocator?.id) {
                try {
                  await updateLeadDetails(lead.id, { paymentOwnerId: null });
                } catch {
                  /* ignore */
                }
              }
            }
            if (!nextAllocator) {
              let currentOwnerIndex = -1;
              if (lead.ownerUserId) {
                currentOwnerIndex = allocators.findIndex(
                  (a) => String(a.id) === String(lead.ownerUserId),
                );
              }
              const nextIndex = (currentOwnerIndex + 1) % allocators.length;
              nextAllocator = allocators[nextIndex];
            }
            if (nextAllocator?.id) {
              await updateLeadAllocator(lead.id, nextAllocator.id, groupId);
            }
          }
        } catch (err) {
          console.warn(`failed to round-robin assign ${key} group`, err);
        }
      }
      if (key === "payment") {
        // nothing special needed when moving to payment
      }
      const mergedLead = { ...(lead || {}), ...updated };
      setLead(mergedLead);
      showSuccess("Lead status updated");
      // open appropriate modal after save if details are still missing
      if (statusNeedsModal(normalizedKey)) {
        if (normalizedKey === "attempted") setShowAttemptedModal(true);
        else if (normalizedKey === "interested") setShowInterestedModal(true);
        else if (normalizedKey === "rejected") setShowRejectedModal(true);
        else if (normalizedKey === "requirement" || normalizedKey === "budget") setShowRequirementModal(true);
        else if (normalizedKey === "design") setShowDesignDurationModal(true);
      }
      if (exitEditIfOwnershipMoved(mergedLead)) return;
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update status"));
    } finally {
      setSaving(false);
    }
  };

  const exitEditIfOwnershipMoved = (nextLead) => {
    if (role !== "EMPLOYEE") return false;
    const nextOwnerId = nextLead?.ownerUserId;
    const currentUserId = user?.id;
    if (!nextOwnerId || !currentUserId) return false;
    if (String(nextOwnerId) === String(currentUserId)) return false;
    navigate("/leads");
    return true;
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
      
      // Determine nextGroupId from flow rules
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }
      
      const updated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      const mergedLead = { ...(lead || {}), ...detailsUpdated, ...updated };
      setLead(mergedLead);
      showSuccess("Lead status updated");
      setShowAttemptedModal(false);
      if (exitEditIfOwnershipMoved(mergedLead)) return;
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
      
      // Determine nextGroupId from flow rules
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }
      
      const updated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      const mergedLead = { ...(lead || {}), ...detailsUpdated, ...updated };
      setLead(mergedLead);
      showSuccess("Lead status updated");
      setShowInterestedModal(false);
      if (exitEditIfOwnershipMoved(mergedLead)) return;
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
      
      // Determine nextGroupId from flow rules
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }
      
      const updated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      setLead((prev) => ({ ...(prev || {}), ...detailsUpdated, ...updated }));
      showSuccess("Lead status updated");
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
      
      // Determine nextGroupId from flow rules
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }
      
      const statusUpdated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      const mergedLead = { ...(lead || {}), ...ownerUpdated, ...statusUpdated };
      setLead(mergedLead);
      showSuccess("Lead allocated");
      setShowAllocateModal(false);
      if (exitEditIfOwnershipMoved(mergedLead)) return;
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to allocate lead"));
    } finally {
      setSaving(false);
    }
  };


  const submitRequirement = async () => {
    if (!lead?.id) return;
    if (!requirementType || !requirementNotes) {
      setError("Please select category and add notes");
      return;
    }
    if (!requirementFile && !requirementFileName) {
      setError("Please attach a requirement file");
      return;
    }
    setRequirementSaving(true);
    setError("");
    try {
      let detailsPayload = {
        requirementType,
        requirementNotes,
      };
      
      let fileAttachment = null;
      if (requirementFile) {
        try {
          fileAttachment = await sendLeadChatAttachment(lead.id, {
            threadType: "INTERNAL",
            message: "Requirement file",
            file: requirementFile,
          });
          if (fileAttachment?.id) {
            detailsPayload.requirementFileName =
              fileAttachment.attachmentName || fileAttachment.name || requirementFileName;
            detailsPayload.requirementFileType = fileAttachment.attachmentType;
            detailsPayload.requirementFileSize = fileAttachment.attachmentSize;
            detailsPayload.requirementFilePath = `/api/v1/leads/${lead.id}/chat/messages/${fileAttachment.id}/file`;
          }
        } catch (uploadErr) {
          console.warn("File upload failed but continuing with notes", uploadErr);
        }
      }
      
      const detailsUpdated = await updateLeadDetails(lead.id, detailsPayload);
      
      // Determine nextGroupId from flow rules
      let nextGroupId = null;
      if (Array.isArray(flowRules)) {
        const targetRule = flowRules.find(
          (r) =>
            String(r?.status || "").trim().toLowerCase() ===
            String(statusValue || "").trim().toLowerCase(),
        );
        if (targetRule?.handledByGroupId != null) {
          nextGroupId = targetRule.handledByGroupId;
        }
      }
      
      const updated = await updateLeadRowStatus(lead.id, statusValue, nextGroupId);
      const mergedLead = { ...(lead || {}), ...detailsUpdated, ...updated };
      setLead(mergedLead);
      
      // Clear requirement modal state
      setRequirementType("");
      setRequirementFile(null);
      setRequirementFileName("");
      setRequirementNotes("");
      
      showSuccess("Requirement submitted successfully");
      setShowRequirementModal(false);
      if (exitEditIfOwnershipMoved(mergedLead)) return;
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to submit requirement"));
    } finally {
      setRequirementSaving(false);
    }
  };

  const openChatPanel = () => {
    if (!lead?.id) return;
    navigate(`/leads/${lead.id}/chat`);
  };

  const handleStatusChange = (newStatus) => {
    setStatusValue(newStatus);
    
    // Open appropriate modal based on selected status
    if (!newStatus) return;
    
    const normalizedStatus = String(newStatus || "").trim().toLowerCase();
    
    if (normalizedStatus === "attempted") {
      setShowAttemptedModal(true);
    } else if (normalizedStatus === "interested") {
      setShowInterestedModal(true);
    } else if (normalizedStatus === "design") {
      setShowDesignDurationModal(true);
    } else if (normalizedStatus === "rejected") {
      setShowRejectedModal(true);
    } else if (normalizedStatus === "requirement") {
      setShowRequirementModal(true);
    }
  }; // handleStatusChange


  const uploadFinalDesign = async () => {
    if (!lead?.id) return;
    if (!designUploadFile) {
      setError("Please choose a design file");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await sendLeadChatAttachment(lead.id, {
        threadType: "CUSTOMER",
        message: `${DESIGN_THREAD_MARKER}\nFinal design uploaded`,
        file: designUploadFile,
      });
      setFinalDesignMessage({
        id: response?.id,
        attachmentName: designUploadFile?.name || "",
        message: response?.message,
      });
      setDesignUploadFile(null);
      showSuccess("Final design uploaded");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to upload final design"));
    } finally {
      setSaving(false);
    }
  };


  const handleViewFinalDesign = async () => {
    if (!lead?.id || !finalDesignMessage?.id) {
      setError("Final design file not available");
      return;
    }
    try {
      const blob = await downloadLeadChatAttachment(lead.id, finalDesignMessage.id);
      if (!blob) {
        setError("Final design file not available");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to open final design file"));
    }
  };

  const submitDesignDuration = async () => {
    if (!lead?.id) return;
    if (!designStartAt || !designEndAt) {
      setError("Please select design start and end");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateLeadDetails(lead.id, {
        designStartAt,
        designEndAt,
      });
      setLead((prev) => ({
        ...(prev || {}),
        ...updated,
        designStartAt: updated?.designStartAt || designStartAt,
        designEndAt: updated?.designEndAt || designEndAt,
      }));
      setDesignStartAt(toInputDateTime(updated?.designStartAt || designStartAt));
      setDesignEndAt(toInputDateTime(updated?.designEndAt || designEndAt));
      showSuccess("Design duration updated");
      setShowDesignDurationModal(false);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update design duration"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!lead?.id) return;
    
    // Validation
    if (!newAddressContactName.trim()) {
      showError("Contact person name is required");
      return;
    }
    if (!newAddressPhone.trim()) {
      showError("Phone number is required");
      return;
    }
    if (!newAddressLine1.trim()) {
      showError("Address line 1 is required");
      return;
    }
    if (!newAddressCity.trim()) {
      showError("City is required");
      return;
    }
    if (!newAddressState.trim()) {
      showError("State/Province is required");
      return;
    }
    if (!newAddressPincode.trim()) {
      showError("Pincode is required");
      return;
    }
    if (!newAddressCountry.trim()) {
      showError("Country is required");
      return;
    }

    // Validate GSTIN if provided (12 alphanumeric)
    if (newAddressGstin && !/^[A-Za-z0-9]{12}$/.test(newAddressGstin)) {
      showError("GSTIN must be 12 alphanumeric characters");
      return;
    }

    // Validate phone number using configured country rules
    const phoneValidationError = validatePhoneNumber(newAddressPhone, newAddressCountryCode);
    if (phoneValidationError) {
      setNewAddressPhoneError(phoneValidationError);
      showError(phoneValidationError);
      return;
    }

    // Validate email if provided
    if (newAddressEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAddressEmail)) {
      showError("Invalid email format");
      return;
    }

    setAddressLoading(true);
    try {
      const payload = {
        type: newAddressType,
        contactPersonName: newAddressContactName,
        companyName: newAddressCompanyName || null,
        gstin: newAddressGstin || null,
        countryCode: newAddressCountryCode,
        phone: newAddressPhone,
        email: newAddressEmail || null,
        addressLine1: newAddressLine1,
        addressLine2: newAddressLine2 || null,
        city: newAddressCity,
        state: newAddressState,
        pincode: newAddressPincode,
        country: newAddressCountry,
        isPrimary: newAddressPrimary,
      };

      const newAddress = await createAddress(lead.id, payload);

      // Refresh addresses list
      const type = newAddressType;
      if (type === "BILLING") {
        const addressesResponse = await getAddressesByLeadIdAndType(lead.id, "BILLING");
        setBillingAddresses(addressesResponse);
        // Auto-select the new address
        setSelectedBillingAddressId(newAddress.id);
      } else {
        const addressesResponse = await getAddressesByLeadIdAndType(lead.id, "SHIPPING");
        setShippingAddresses(addressesResponse);
        // Auto-select the new address
        setSelectedShippingAddressId(newAddress.id);
      }

      showSuccess(`${newAddressType === "BILLING" ? "Billing" : "Shipping"} address added successfully`);
      setShowAddAddressModal(false);

      // Reset form
      setNewAddressContactName("");
      setNewAddressCompanyName("");
      setNewAddressGstin("");
      setNewAddressCountryCode("+91");
      setNewAddressPhone("");
      setNewAddressPhoneError("");
      setNewAddressEmail("");
      setNewAddressLine1("");
      setNewAddressLine2("");
      setNewAddressCity("");
      setNewAddressState("");
      setNewAddressPincode("");
      setNewAddressCountry("India");
      setNewAddressPrimary(false);
    } catch (e) {
      showError(extractApiErrorMessage(e, `Failed to add ${newAddressType === "BILLING" ? "billing" : "shipping"} address`));
    } finally {
      setAddressLoading(false);
    }
  };

  const submitVerifyDetails = async () => {
    if (!lead?.id) return;
    if (!selectedBillingAddressId) {
      setError("Please select a billing address");
      return;
    }
    if (!parsedInvoice && !verifyFile) {
      setError("Invoice not found. Please upload a payment proof file or ensure invoice exists");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let uploadedProof = null;
      let invoiceAttachment = null;

      // Upload invoice PDF automatically
      if (parsedInvoice) {
        try {
          const doc = new jsPDF();
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageMargin = 15;
          const invoiceNumber = `INV-${lead.leadId || lead.id}`;

          doc.text("INVOICE", pageMargin, 15);
          doc.text(`Company: ${lead.companyName || ""}`, pageMargin, 22);
          doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - pageMargin - 60, 25);
          doc.text(`Date: ${parsedInvoice.createdAt ? new Date(parsedInvoice.createdAt).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}`, pageWidth - pageMargin - 60, 30);

          const itemsWithTotals = (parsedInvoice.items || []).map(item => ({
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: (item.quantity || 1) * (item.unitPrice || 0),
          }));

          const columns = [
            { header: "Description", dataKey: "description" },
            { header: "Qty", dataKey: "quantity" },
            { header: "Unit Price", dataKey: "unitPrice" },
            { header: "Total", dataKey: "total" },
          ];

          doc.autoTable({
            columns,
            body: itemsWithTotals,
            startY: 40,
            margin: { left: pageMargin, right: pageMargin },
          });

          const finalY = doc.lastAutoTable.finalY || 100;
          const t = parsedInvoice.totals || {};
          doc.text(`Subtotal: ${(t.subtotal || 0).toFixed(2)}`, pageWidth - pageMargin - 40, finalY + 10);
          doc.text(`CGST (${lead.invoiceCgstPercent || 0}%): ${(t.cgst || 0).toFixed(2)}`, pageWidth - pageMargin - 40, finalY + 17);
          doc.text(`SGST (${lead.invoiceSgstPercent || 0}%): ${(t.sgst || 0).toFixed(2)}`, pageWidth - pageMargin - 40, finalY + 24);
          doc.text(`Total: ${(t.total || 0).toFixed(2)}`, pageWidth - pageMargin - 40, finalY + 31);

          const pdfBlob = doc.output("blob");
          const pdfFile = new File([pdfBlob], `Invoice-${invoiceNumber}.pdf`, { type: "application/pdf" });

          invoiceAttachment = await sendLeadChatAttachment(lead.id, {
            threadType: "INTERNAL",
            message: "Invoice attached for payment verification",
            file: pdfFile,
          });
        } catch (invoiceErr) {
          console.warn("Failed to generate/attach invoice PDF", invoiceErr);
        }
      }

      // Upload payment proof if provided
      if (verifyFile) {
        uploadedProof = await uploadLeadPaymentProof(lead.id, verifyFile);
      }

      const payload = {
        paymentProofFileName: uploadedProof?.fileName || verifyFileName || null,
        paymentProofFilePath: uploadedProof?.filePath || null,
        paymentProofNotes: verifyNotes || null,
        paymentVerificationStatus: "PENDING",
        paymentVerificationBillingAddressId: selectedBillingAddressId,
        paymentVerificationShippingAddressId: shipSame ? selectedBillingAddressId : selectedShippingAddressId,
        // Store the amount being verified - backend will add it to paidAmount on APPROVE
        paymentVerificationAmount: verifyPaidAmount ? Number(verifyPaidAmount) : null,
      };
      const updated = await updateLeadDetails(lead.id, payload);
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      showSuccess("Verification sent with invoice");
      setShowVerifyModal(false);
      // Reset form
      setShipSame(false);
      setSelectedBillingAddressId(null);
      setSelectedShippingAddressId(null);
      setVerifyFile(null);
      setVerifyFileName("");
      setVerifyNotes("");
      if (exitEditIfOwnershipMoved(updated)) return;
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to submit payment verification"));
    } finally {
      setSaving(false);
    }
  };

  const submitMoneyDetails = async () => {
    if (!lead?.id) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateLeadDetails(lead.id, {
        totalAmount: totalAmount || null,
        paidAmount: paidAmount || null,
        remainingAmount: remainingAmount || null,
      });
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      showSuccess("Money details updated");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update money details"));
    } finally {
      setSaving(false);
    }
  };

  const saveLeadType = async (nextValue) => {
    if (!lead?.id) return;
    setTypeSaving(true);
    setError("");
    try {
      const updated = await updateLeadDetails(lead.id, { leadType: nextValue });
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      showSuccess("Lead type updated");
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
        totalAmount: totalAmount || null,
        paidAmount: paidAmount || null,
        remainingAmount: remainingAmount || null,
        designStartAt: designStartAt || null,
        designEndAt: designEndAt || null,
      };
      const updated = await updateLeadDetails(lead.id, payload);
      setLead((prev) => ({ ...(prev || {}), ...updated }));
      showSuccess("Lead details updated");
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to update lead details"));
    } finally {
      setSaving(false);
    }
  };

  const handleStockRequestSubmit = async ({ leadId, leadName, items }) => {
    if (!leadId) return;
    setStockRequestSubmitting(true);
    setStockRequestError("");
    try {
      const payload = {
        leadId,
        leadName: leadName || lead?.leadName || lead?.name || "",
        requestedBy: user?.id,
        items,
      };
      const req = await createStockRequest(payload);
      if (req?.id) {
        // Update lead status to "Stock Requested"
        try {
          await updateLeadRowStatus(leadId, "Stock Requested");
        } catch (statusErr) {
          console.error("Failed to update lead status to Stock Requested:", statusErr);
          // Continue anyway - stock request was created successfully
        }
        setShowStockRequestModal(false);
        navigate("/stocks", { state: { leadId: lead?.id } });
      }
    } catch (err) {
      const message = extractApiErrorMessage(err, "Failed to create stock request");
      setStockRequestError(message);
    } finally {
      setStockRequestSubmitting(false);
    }
  };

  if (dealLoadError) return <div className="content"><div className="alert alert-danger">{dealLoadError}</div></div>;
  if (!id) return <div className="content"><div className="card"><div className="card-body p-4"><p className="text-center">Loading deal...</p></div></div></div>;

  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-1">Edit Deal</h3>
          <p className="text-muted mb-0">View deal details and status</p>
        </div>
        <button className="btn btn-light" onClick={() => navigate("/deals")}>
          Back to Deals
        </button>
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3">
        <div className="lead-status-current">
          <span className="text-muted">Current status:&nbsp;</span>
          <span className="badge bg-primary">{effectiveStatus || "N/A"}</span>
        </div>
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
            <div className="text-muted">Deal not found.</div>
          ) : (
            <div className="row g-4">
              {!isEmployeeDesignView && (
              <div className="col-lg-7">
                <ul className="nav nav-tabs mb-3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                      id="general-tab"
                      onClick={() => setActiveTab("general")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "general"}
                    >
                      General Info
                    </button>
                  </li>
                  {showAttemptedSummary && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "attempted" ? "active" : ""}`}
                      id="attempted-tab"
                      onClick={() => setActiveTab("attempted")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "attempted"}
                    >
                      Attempted
                    </button>
                  </li>
                  )}
                  {showInterestedSummary && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "interested" ? "active" : ""}`}
                      id="interested-tab"
                      onClick={() => setActiveTab("interested")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "interested"}
                    >
                      Interested
                    </button>
                  </li>
                  )}
                  {showRequirementSummary && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "requirement" ? "active" : ""}`}
                      id="requirement-tab"
                      onClick={() => setActiveTab("requirement")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "requirement"}
                    >
                      Requirement
                    </button>
                  </li>
                  )}
                  {(statusLower === "budget" || lead?.budgetVerificationStatus) && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "budget" ? "active" : ""}`}
                      id="budget-tab"
                      onClick={() => setActiveTab("budget")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "budget"}
                    >
                      Budget
                    </button>
                  </li>
                  )}
                  {isRejected && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "rejected" ? "active" : ""}`}
                      id="rejected-tab"
                      onClick={() => setActiveTab("rejected")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "rejected"}
                    >
                      Rejected
                    </button>
                  </li>
                  )}
                  {showDesignSummary && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "design" ? "active" : ""}`}
                      id="design-tab"
                      onClick={() => setActiveTab("design")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "design"}
                    >
                      Design
                    </button>
                  </li>
                  )}
                  {showPaymentSummary && statusLower !== "budget" && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === "payment" ? "active" : ""}`}
                      id="payment-tab"
                      onClick={() => setActiveTab("payment")}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "payment"}
                    >
                      {isProduction ? "Production" : "Payment"}
                    </button>
                  </li>
                  )}
                </ul>

                {activeTab === "general" && (
                <div className="tab-pane fade show active">
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
                    <h5 className="mb-3">Lead Overview</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Lead Group</label>
                        <input
                          className="form-control"
                          value={pickText(lead, ["leadGroupName", "groupName"]) || "-"}
                          readOnly
                        />
                      </div>
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
                    </div>
                  </div>
                </div>
                )}

                <>
                {activeTab === "attempted" && showAttemptedSummary && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">Attempted Details</h5>
                    <div className="row g-3">
                      {String(attemptedCallStatus || "")
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
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "interested" && showInterestedSummary && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">Interested Details</h5>
                    <div className="row g-3">
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
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "boq" && showBoqSummary && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">Customer Login Info</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input className="form-control" value={lead.email || "-"} readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input className="form-control" value={DEFAULT_CUSTOMER_LOGIN_PASSWORD} readOnly />
                      </div>
                      <div className="col-12">
                        <div className="text-muted small">
                          Customer is forced to change this password on first login.
                        </div>
                      </div>
                      <div className="col-12 d-flex justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          type="button"
                        >
                          <i className="ti ti-share me-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "requirement" && showRequirementSummary && (
                <div className="tab-pane fade show active">
                  <div className="mb-4">
                    <h5 className="mb-3">Requirement Details</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <input
                          className="form-control"
                          value={lead.requirementType || "-"}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          value={lead.requirementNotes || "-"}
                          readOnly
                          rows={3}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">File</label>
                        <div className="py-2">
                          {lead.requirementFileName && lead.requirementFilePath ? (
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <span className="text-break">{lead.requirementFileName}</span>
                              <a
                                className="btn btn-outline-secondary btn-sm"
                                href={lead.requirementFilePath}
                                download={lead.requirementFileName}
                              >
                                Download
                              </a>
                            </div>
                          ) : lead.requirementFileName ? (
                            <span className="text-break">{lead.requirementFileName}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "budget" && (statusLower === "budget" || lead?.budgetVerificationStatus) && (
                <div className="tab-pane fade show active">
                  <div className="mb-4">
                    <h5 className="mb-3">Budget Verification</h5>
                    {lead?.budgetVerificationStatus && (
                      <div className={`alert d-flex align-items-center gap-2 mb-4 ${
                        lead?.budgetVerificationStatus === "APPROVED" ? "alert-success" : "alert-info"
                      }`}>
                        <i className={`ti fs-5 ${
                          lead?.budgetVerificationStatus === "APPROVED" ? "ti-circle-check" : "ti-calculator"
                        }`}></i>
                        <div>
                          <strong>
                            {lead?.budgetVerificationStatus === "APPROVED"
                              ? "Budget Verification Done"
                              : "Budget Verification In Progress"}
                          </strong>
                          <div className="small">
                            {lead?.budgetVerificationStatus === "APPROVED"
                              ? "Invoice is ready. You can now move to Payment."
                              : "Budget team is calculating the invoice for this requirement."}
                          </div>
                        </div>
                      </div>
                    )}
                    {lead?.budgetVerificationRejectionReason && (
                      <div className="alert alert-danger mb-3">
                        <strong>Rejection Reason:</strong>
                        <div>{lead.budgetVerificationRejectionReason}</div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {activeTab === "design" && showDesignSummary && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">Design Details</h5>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label">Design Duration</label>
                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            value={
                              designStartAt && designEndAt
                                ? `${getDesignDurationDays(designStartAt, designEndAt)} day(s)`
                                : "-"
                            }
                            readOnly
                          />
                          <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => setShowDesignDurationModal(true)}
                          >
                            Design Duration
                          </button>
                        </div>
                      </div>

                      {/* final design view for any user when available */}
                      <div className="col-md-12">
                        <label className="form-label">Final Design</label>
                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            value={finalDesignMessage?.attachmentName || "-"}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleViewFinalDesign}
                            disabled={!finalDesignMessage?.id}
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {isEmployeeDesignView && (
                        <div className="col-md-12">
                          <div className="card border mb-3">
                            <div className="card-body">
                              <h6 className="mb-2">Upload Final Design</h6>
                              <input
                                className="form-control mb-3"
                                type="file"
                                onChange={(e) => setDesignUploadFile(e.target.files?.[0] || null)}
                              />
                              <button
                                className="btn btn-outline-primary w-100"
                                type="button"
                                onClick={uploadFinalDesign}
                                disabled={saving || !designUploadFile}
                              >
                                {saving ? "Uploading..." : "Upload File"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "payment" && showPaymentSummary && statusLower !== "budget" && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">{isProduction ? "Production Details" : "Payment Tracker"}</h5>

                    {/* Budget Verification Status Box - Only show during budget status */}
                    {lead?.budgetVerificationStatus && statusLower === "budget" && (
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className={`card border-2 ${
                            lead.budgetVerificationStatus === "APPROVED" ? "border-success bg-light-success" :
                            lead.budgetVerificationStatus === "REJECTED" ? "border-danger bg-light-danger" :
                            "border-info bg-light"
                          }`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-2 text-center">
                                  {lead.budgetVerificationStatus === "APPROVED" ? (
                                    <div className="fs-1 text-success"><i className="ti ti-circle-check-filled"></i></div>
                                  ) : lead.budgetVerificationStatus === "REJECTED" ? (
                                    <div className="fs-1 text-danger"><i className="ti ti-circle-x-filled"></i></div>
                                  ) : (
                                    <div className="fs-1 text-info"><i className="ti ti-calculator"></i></div>
                                  )}
                                </div>
                                <div className="col-md-10">
                                  <h5 className="mb-1">
                                    {lead.budgetVerificationStatus === "APPROVED"
                                      ? "Budget Approved"
                                      : lead.budgetVerificationStatus === "REJECTED"
                                      ? "Budget Rejected"
                                      : "Budget Calculating"}
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {lead.budgetVerificationStatus === "APPROVED"
                                      ? "Budget has been approved and invoice has been created."
                                      : lead.budgetVerificationStatus === "REJECTED"
                                      ? "Budget calculation has been rejected."
                                      : "Budget team is calculating the invoice for this requirement."}
                                  </p>
                                  {lead.budgetVerificationStatus === "REJECTED" && lead.budgetVerificationRejectionReason && (
                                    <div className="mt-2 p-2 rounded border border-danger bg-white">
                                      <small className="text-danger fw-semibold">Reason:</small>
                                      <p className="mb-0 text-dark">{lead.budgetVerificationRejectionReason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Verification Status Box */}
                    {lead?.paymentVerificationStatus && (
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className={`card border-2 ${
                            lead.paymentVerificationStatus === "APPROVED" ? "border-success bg-light-success" :
                            lead.paymentVerificationStatus === "REJECTED" ? "border-danger bg-light-danger" :
                            "border-warning bg-light-warning"
                          }`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-2 text-center">
                                  {lead.paymentVerificationStatus === "APPROVED" ? (
                                    <div className="fs-1 text-success"><i className="ti ti-circle-check-filled"></i></div>
                                  ) : lead.paymentVerificationStatus === "REJECTED" ? (
                                    <div className="fs-1 text-danger"><i className="ti ti-circle-x-filled"></i></div>
                                  ) : (
                                    <div className="fs-1 text-warning"><i className="ti ti-clock"></i></div>
                                  )}
                                </div>
                                <div className="col-md-10">
                                  <h5 className="mb-1">
                                    {lead.paymentVerificationStatus === "APPROVED" 
                                      ? "Verification Successful" 
                                      : lead.paymentVerificationStatus === "REJECTED" 
                                      ? "Verification Rejected" 
                                      : "Verification Pending"}
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {lead.paymentVerificationStatus === "APPROVED"
                                      ? "Payment verification has been approved and invoice has been created."
                                      : lead.paymentVerificationStatus === "REJECTED"
                                      ? "Payment verification has been rejected."
                                      : "This payment verification is pending approval."}
                                  </p>
                                  {lead.paymentVerificationStatus === "REJECTED" && lead.paymentVerificationRejectionReason && (
                                    <div className="mt-2 p-2 rounded border border-danger bg-white">
                                      <small className="text-danger fw-semibold">Reason:</small>
                                      <p className="mb-0 text-dark">{lead.paymentVerificationRejectionReason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Invoice from Accounts */}
                    {parsedInvoice && (
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="card border">
                            <div className="card-header d-flex justify-content-between align-items-center py-2">
                              <strong className="text-dark">
                                <i className="ti ti-file-invoice me-1"></i>
                                {parsedInvoice.type === "payment" ? "Payment Invoice" : parsedInvoice.type === "budget" ? "Budget Invoice" : "Invoice"}
                                {parsedInvoice.type === "payment" && <span className="badge bg-success ms-2" style={{fontSize:"0.65rem"}}>Approved</span>}
                                {parsedInvoice.type === "budget" && <span className="badge bg-warning text-dark ms-2" style={{fontSize:"0.65rem"}}>Budget</span>}
                              </strong>
                              <div className="d-flex align-items-center gap-2">
                                {parsedInvoice.createdAt && (
                                  <small className="text-muted">{new Date(parsedInvoice.createdAt).toLocaleString("en-IN")}</small>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={handleDownloadInvoice}
                                >
                                  <i className="ti ti-download me-1"></i>Download PDF
                                </button>
                              </div>
                            </div>
                            <div className="card-body p-0">
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>#</th>
                                      <th>Description</th>
                                      <th>HSN</th>
                                      <th className="text-end">Qty</th>
                                      <th className="text-end">Unit Price</th>
                                      <th className="text-end">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(parsedInvoice.items || []).map((item, idx) => (
                                      <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{item.description}</td>
                                        <td>{item.hsn || "-"}</td>
                                        <td className="text-end">{item.quantity}</td>
                                        <td className="text-end">&#8377;{Number(item.unitPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                        <td className="text-end">&#8377;{Number(item.subtotal ?? item.total ?? (Number(item.quantity || 0) * Number(item.unitPrice || 0))).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  {parsedInvoice.totals && (
                                    <tfoot>
                                      <tr>
                                        <td colSpan={5} className="text-end fw-semibold">Subtotal</td>
                                        <td className="text-end">&#8377;{Number(parsedInvoice.totals.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                      {parsedInvoice.totals.cgst > 0 && (
                                        <tr>
                                          <td colSpan={5} className="text-end text-muted">CGST ({parsedInvoice.totals.cgstPercent}%)</td>
                                          <td className="text-end text-muted">&#8377;{Number(parsedInvoice.totals.cgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                      )}
                                      {parsedInvoice.totals.sgst > 0 && (
                                        <tr>
                                          <td colSpan={5} className="text-end text-muted">SGST ({parsedInvoice.totals.sgstPercent}%)</td>
                                          <td className="text-end text-muted">&#8377;{Number(parsedInvoice.totals.sgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                      )}
                                      <tr className="table-success">
                                        <td colSpan={5} className="text-end fw-bold">Grand Total</td>
                                        <td className="text-end fw-bold">&#8377;{Number(parsedInvoice.totals.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    </tfoot>
                                  )}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display Payment Notes if Available */}
                    {lead?.paymentNotes && (
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="text-muted small">Payment Notes</label>
                          <p className="alert alert-info py-2 px-3 mb-0">{lead.paymentNotes}</p>
                        </div>
                      </div>
                    )}

                    <div className="row g-3">
                      {isProduction && (
                      <div className="col-12 mb-3">
                        <button
                          className="btn btn-warning"
                          type="button"
                          onClick={() => {
                            setStockRequestError("");
                            setShowStockRequestModal(true);
                          }}
                        >
                          Create Stock Request
                        </button>
                        {stockRequestError && (
                          <div className="alert alert-danger mt-2 mb-0">{stockRequestError}</div>
                        )}
                      </div>
                      )}
                      {isPayment && (
                        <>
                        <div className="col-md-12">
                          <label className="form-label">Amount Details</label>
                          <div className="d-flex gap-2">
                            <input
                              className="form-control"
                              value={
                                totalAmount
                                  ? `Total: Rs ${Number(totalAmount || 0).toLocaleString("en-IN")} | Paid: Rs ${Number(paidAmount || 0).toLocaleString("en-IN")}`
                                  : "-"
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Total Amount</label>
                          <input
                            className="form-control"
                            type="number"
                            value={totalAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTotalAmount(val);
                              const paid = Number(paidAmount) || 0;
                              setRemainingAmount(String(Math.max(0, Number(val) - paid)));
                            }}
                            placeholder="Total amount"
                            min="0"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Paid Amount</label>
                          <input
                            className="form-control"
                            type="number"
                            value={paidAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPaidAmount(val);
                              const total = Number(totalAmount) || 0;
                              setRemainingAmount(String(Math.max(0, total - Number(val))));
                            }}
                            placeholder="Paid amount"
                            min="0"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Remaining Amount</label>
                          <input
                            className="form-control"
                            value={remainingAmount ? `Rs ${Number(remainingAmount).toLocaleString("en-IN")}` : "Rs 0"}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-end">
                          <button
                            className="btn btn-primary w-100"
                            type="button"
                            onClick={submitMoneyDetails}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Amount"}
                          </button>
                        </div>
                        <div className="col-md-6 d-flex align-items-end">
                          <button
                            className="btn btn-outline-secondary w-100"
                            type="button"
                            onClick={() => {
                              setVerifyPaidAmount(paidAmount);
                              setVerifyNotes("");
                              setVerifyFile(null);
                              setVerifyFileName("");
                              setShowVerifyModal(true);
                            }}
                          >
                            Verify Payment
                          </button>
                        </div>

                        <div className="col-12">
                          <div className="progress" style={{ height: 8 }}>
                            <div
                              className={`progress-bar ${
                                Number(remainingAmount) <= 0 && Number(totalAmount) > 0
                                  ? "bg-success"
                                  : "bg-primary"
                              }`}
                              style={{
                                width: Number(totalAmount) > 0
                                  ? `${Math.min(100, (Number(paidAmount) / Number(totalAmount)) * 100)}%`
                                  : "0%",
                              }}
                            />
                          </div>
                          <small className="text-muted">
                            {Number(totalAmount) > 0
                              ? `${Math.round((Number(paidAmount) / Number(totalAmount)) * 100)}% paid`
                              : "No amount set"}
                          </small>
                        </div>
                        <div className="col-md-12">
                          <button
                            className="btn btn-outline-primary w-100"
                            type="button"
                            onClick={openChatPanel}
                          >
                            <i className="ti ti-message-circle me-1" />
                            Payment Chat
                          </button>
                        </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {activeTab === "rejected" && isRejected && (
                <div className="tab-pane fade show active">
                  <div>
                    <h5 className="mb-3">Rejected Details</h5>
                    <div className="row g-3">
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
                    </div>
                  </div>
                </div>
                )}
                </>
              </div>
              )}

              <div className={isEmployeeDesignView ? "col-12" : "col-lg-5"}>
                {isEmployeeDesignView ? (
                  <div className="mx-auto" style={{ maxWidth: "760px" }}>
                    <div className="mb-3">
                      <h5 className="mb-1">Design Review</h5>
                      <div className="text-muted">Only lead status and customer design response are shown in this phase.</div>
                    </div>
                  </div>
                ) : null}
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
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="">Select Status</option>
                    {allowedStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {effectiveStatus.toLowerCase() === "design" ? (
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={saveStatus}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Status"}
                    </button>
                  ) : null}
                  {isEmployeeDesignView ? (
                    <div className="card border mb-3">
                      <div className="card-body">
                        <h6 className="mb-2">Upload Final Design</h6>
                        <input
                          className="form-control mb-3"
                          type="file"
                          onChange={(e) => setDesignUploadFile(e.target.files?.[0] || null)}
                        />
                        <button
                          className="btn btn-outline-primary w-100"
                          type="button"
                          onClick={uploadFinalDesign}
                          disabled={saving || !designUploadFile}
                        >
                          {saving ? "Uploading..." : "Upload File"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                    {effectiveStatus.toLowerCase() !== "design" ? (
                    <button
                      className="btn btn-primary w-100"
                      onClick={saveStatus}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Status"}
                    </button>
                    ) : null}
                  </div>
                </div>

                {!isEmployeeDesignView && (
                <div className="card border mt-3">
                  <div className="card-body">
                    <h5 className="mb-3">Save Deal Details</h5>
                    <button
                      className="btn btn-primary w-100"
                      onClick={saveLeadDetails}
                      disabled={saving || typeSaving}
                    >
                      {saving ? "Saving..." : "Save Details"}
                    </button>
                  </div>
                </div>
                )}

                {!isEmployeeDesignView && (
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
                )}

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

      {showRequirementModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Requirement</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowRequirementModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Requirement">Requirement</option>
                  <option value="Design">Design</option>
                  <option value="Production">Production</option>
                  <option value="Design + Production">Design + Production</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File</label>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setRequirementFile(file);
                    setRequirementFileName(file?.name || "");
                  }}
                />
                {requirementFileName && <div className="text-muted mt-1">{requirementFileName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Requirements Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={requirementNotes}
                  onChange={(e) => setRequirementNotes(e.target.value)}
                  placeholder="Add notes"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={submitRequirement}
                  disabled={requirementSaving}
                >
                  {requirementSaving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDesignDurationModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "520px" }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Design Duration</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowDesignDurationModal(false)}
              />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Design Start</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={designStartAt}
                  onChange={(e) => setDesignStartAt(e.target.value)}
                  disabled={!!lead?.designStartAt}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Design End</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={designEndAt}
                  onChange={(e) => setDesignEndAt(e.target.value)}
                  disabled={!!lead?.designEndAt}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Days</label>
                <input
                  className="form-control"
                  value={getDesignDurationDays(designStartAt, designEndAt) || "-"}
                  readOnly
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={submitDesignDuration} disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showVerifyModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto" }}>
            <div className="card-header d-flex align-items-center justify-content-between sticky-top bg-white">
              <h5 className="mb-0">Verify Payment</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowVerifyModal(false)}
              />
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}</div>}
              
              {/* Payment Amount */}
              <div className="mb-3">
                <label className="form-label"><strong>Paid Amount</strong></label>
                <input
                  className="form-control"
                  type="number"
                  value={verifyPaidAmount}
                  onChange={(e) => setVerifyPaidAmount(e.target.value)}
                  placeholder="Paid amount"
                  min="0"
                />
              </div>

              {/* Payment Proof */}
              <div className="mb-3">
                <label className="form-label"><strong>Payment Proof Document</strong></label>
                <div className="alert alert-info mb-2" role="alert">
                  <small>{parsedInvoice ? "Invoice will be automatically attached. Upload additional payment proof if needed." : "Upload payment proof document for verification."}</small>
                </div>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setVerifyFile(file);
                    setVerifyFileName(file?.name || "");
                  }}
                />
                {verifyFileName && <small className="text-muted">Selected: {verifyFileName}</small>}
              </div>

              {/* Payment Notes */}
              <div className="mb-3">
                <label className="form-label"><strong>Payment Notes</strong></label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Payment notes"
                />
              </div>

              {/* Billing Address Section */}
              <div className="mb-4">
                <h6 className="border-bottom pb-2"><strong>Billing Address</strong></h6>
                <div className="mb-3">
                  <label className="form-label">Select Billing Address</label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={selectedBillingAddressId || ""}
                      onChange={(e) => {
                        const id = e.target.value ? Number(e.target.value) : null;
                        setSelectedBillingAddressId(id);
                        if (shipSame) {
                          setSelectedShippingAddressId(id);
                        }
                      }}
                      disabled={addressLoading || billingAddresses.length === 0}
                    >
                      <option value="">-- Select Address --</option>
                      {billingAddresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.contactPersonName} - {addr.city}
                          {addr.isPrimary ? " (Primary)" : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setNewAddressType("BILLING");
                        setShowAddAddressModal(true);
                      }}
                      title="Add new billing address"
                    >
                      <i className="ti ti-plus"></i> Add
                    </button>
                  </div>
                  {billingAddresses.length === 0 && (
                    <small className="text-warning">No billing addresses found. Please add one.</small>
                  )}
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mb-4">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="shipSame"
                    checked={shipSame}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShipSame(checked);
                      setSelectedShippingAddressId(checked ? selectedBillingAddressId : null);
                    }}
                  />
                  <label className="form-check-label" htmlFor="shipSame">
                    <strong>Shipping address is same as billing</strong>
                  </label>
                  <div>
                    <small className="text-muted">
                      Click this checkbox to use same shipping address as billing address. If unchecked, select a separate shipping address.
                    </small>
                  </div>
                </div>

                {!shipSame && (
                  <div>
                    <h6 className="border-bottom pb-2"><strong>Shipping Address</strong></h6>
                    <div className="mb-3">
                      <label className="form-label">Select Shipping Address</label>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          value={selectedShippingAddressId || ""}
                          onChange={(e) => setSelectedShippingAddressId(e.target.value ? Number(e.target.value) : null)}
                          disabled={addressLoading || shippingAddresses.length === 0}
                        >
                          <option value="">-- Select Address --</option>
                          {shippingAddresses.map((addr) => (
                            <option key={addr.id} value={addr.id}>
                              {addr.contactPersonName} - {addr.city}
                              {addr.isPrimary ? " (Primary)" : ""}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            setNewAddressType("SHIPPING");
                            setShowAddAddressModal(true);
                          }}
                          title="Add new shipping address"
                        >
                          <i className="ti ti-plus"></i> Add
                        </button>
                      </div>
                      {shippingAddresses.length === 0 && (
                        <small className="text-warning">No shipping addresses found. Please add one.</small>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowVerifyModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submitVerifyDetails}
                  disabled={
                    saving ||
                    !selectedBillingAddressId ||
                    (!shipSame && !selectedShippingAddressId)
                  }
                >
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1100 }}>
          <div className="card shadow-lg" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflow: "auto" }}>
            <div className="card-header d-flex align-items-center justify-content-between sticky-top bg-white">
              <h5 className="mb-0">Add {newAddressType === "BILLING" ? "Billing" : "Shipping"} Address</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setShowAddAddressModal(false);
                  // Reset form
                  setNewAddressContactName("");
                  setNewAddressCompanyName("");
                  setNewAddressGstin("");
                  setNewAddressCountryCode("+91");
                  setNewAddressPhone("");
                  setNewAddressEmail("");
                  setNewAddressLine1("");
                  setNewAddressLine2("");
                  setNewAddressCity("");
                  setNewAddressState("");
                  setNewAddressPincode("");
                  setNewAddressCountry("India");
                  setNewAddressPrimary(false);
                }}
              />
            </div>
            <div className="card-body">
              {/* Contact Person Name */}
              <div className="mb-3">
                <label className="form-label"><strong>Contact Person Name *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressContactName}
                  onChange={(e) => setNewAddressContactName(e.target.value)}
                  placeholder="Contact person name"
                />
              </div>

              {/* Company Name */}
              <div className="mb-3">
                <label className="form-label"><strong>Company Name</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressCompanyName}
                  onChange={(e) => setNewAddressCompanyName(e.target.value)}
                  placeholder="Company name"
                />
              </div>

              {/* GSTIN */}
              <div className="mb-3">
                <label className="form-label"><strong>GSTIN</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressGstin}
                  onChange={(e) => setNewAddressGstin(e.target.value.toUpperCase())}
                  placeholder="12-digit alphanumeric"
                  maxLength="12"
                />
                <small className="text-muted">Format: 12 alphanumeric characters</small>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label"><strong>Phone Number *</strong></label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    style={{ maxWidth: "160px" }}
                    value={newAddressCountryCode}
                    onChange={(e) => {
                      setNewAddressCountryCode(e.target.value);
                      // re-validate/trim based on new country max length
                      const maxLen = getCountryOptionByValue(e.target.value)?.maxLength || 15;
                      const allowed = getCountryAllowedLengths(e.target.value);
                      setNewAddressPhone((prev) => sanitizePhoneDigits(prev, maxLen, allowed));
                      setNewAddressPhoneError("");
                    }}
                  >
                    {COUNTRY_CODE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddressPhone}
                    onChange={(e) => {
                      const maxLen = getCountryOptionByValue(newAddressCountryCode)?.maxLength || 15;
                      const allowed = getCountryAllowedLengths(newAddressCountryCode);
                      setNewAddressPhone(sanitizePhoneDigits(e.target.value, maxLen, allowed));
                      setNewAddressPhoneError("");
                    }}
                    placeholder="Enter phone"
                    maxLength={getCountryOptionByValue(newAddressCountryCode)?.maxLength || 15}
                  />
                </div>
                {newAddressPhoneError ? (
                  <small className="text-danger">{newAddressPhoneError}</small>
                ) : (
                  <small className="text-muted">
                    {`Expected length: ${getCountryAllowedLengths(newAddressCountryCode).length
                      ? getCountryAllowedLengths(newAddressCountryCode).join(" or ")
                      : getCountryOptionByValue(newAddressCountryCode)?.maxLength}
                    `}
                  </small>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label"><strong>Email</strong></label>
                <input
                  className="form-control"
                  type="email"
                  value={newAddressEmail}
                  onChange={(e) => setNewAddressEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>

              {/* Address Line 1 */}
              <div className="mb-3">
                <label className="form-label"><strong>Address Line 1 *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressLine1}
                  onChange={(e) => setNewAddressLine1(e.target.value)}
                  placeholder="Street address"
                />
              </div>

              {/* Address Line 2 */}
              <div className="mb-3">
                <label className="form-label"><strong>Address Line 2</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressLine2}
                  onChange={(e) => setNewAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              {/* City */}
              <div className="mb-3">
                <label className="form-label"><strong>City *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div className="mb-3">
                <label className="form-label"><strong>State/Province *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressState}
                  onChange={(e) => setNewAddressState(e.target.value)}
                  placeholder="State or Province"
                />
              </div>

              {/* Pincode */}
              <div className="mb-3">
                <label className="form-label"><strong>Pincode/Zip Code *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressPincode}
                  onChange={(e) => setNewAddressPincode(e.target.value)}
                  placeholder="Postal code"
                />
              </div>

              {/* Country */}
              <div className="mb-3">
                <label className="form-label"><strong>Country *</strong></label>
                <input
                  className="form-control"
                  type="text"
                  value={newAddressCountry}
                  onChange={(e) => setNewAddressCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>

              {/* Primary Address */}
              <div className="mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPrimary"
                    checked={newAddressPrimary}
                    onChange={(e) => setNewAddressPrimary(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isPrimary">
                    <strong>Set as primary address</strong>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddAddressModal(false);
                    // Reset form
                    setNewAddressContactName("");
                    setNewAddressCompanyName("");
                    setNewAddressGstin("");
                    setNewAddressCountryCode("+91");
                    setNewAddressPhone("");
                    setNewAddressEmail("");
                    setNewAddressLine1("");
                    setNewAddressLine2("");
                    setNewAddressCity("");
                    setNewAddressState("");
                    setNewAddressPincode("");
                    setNewAddressCountry("India");
                    setNewAddressPrimary(false);
                  }}
                  disabled={addressLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddAddress}
                  disabled={addressLoading || !newAddressContactName || !newAddressLine1 || !newAddressCity || !newAddressState || !newAddressPincode || !newAddressCountry || !newAddressPhone}
                >
                  {addressLoading ? "Adding..." : "Add Address"}
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
      <StockRequestFormModal
        open={showStockRequestModal}
        leadId={lead?.id}
        initialLeadName={lead?.leadName || lead?.name || ""}
        leadOptions={
          lead?.id
            ? [{ id: lead.id, name: lead?.leadName || lead?.name || "" }]
            : []
        }
        itemOptions={stockItems}
        onClose={() => setShowStockRequestModal(false)}
        onSubmit={handleStockRequestSubmit}
        submitting={stockRequestSubmitting}
      />
    </div>
  );
}
