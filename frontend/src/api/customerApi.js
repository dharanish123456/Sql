import api from "../utils/api";

export async function getCustomerLead() {
  const response = await api.get("/api/customer/lead");
  return response?.data || null;
}

export async function updateCustomerLeadStatus(status) {
  const response = await api.patch("/api/customer/lead/status", { status });
  return response?.data || null;
}
