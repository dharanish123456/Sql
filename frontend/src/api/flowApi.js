import api from "../utils/api";

export async function getLeadFlow() {
  const response = await api.get("/api/flow");
  return response?.data || {};
}

export async function updateLeadFlow(payload) {
  const response = await api.put("/api/flow", payload);
  return response?.data || {};
}
