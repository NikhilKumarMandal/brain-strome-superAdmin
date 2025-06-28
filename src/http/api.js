import { api } from "./client";

// auth service
export const login = (token) => api.post("/auth/login", { token });

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

// SuperAdmin Server

export const stats = () => api.get("/superadmin/stats");

export const sendMail = (subject, intro, outro) =>
  api.post("/superadmin/sendBulkMail", { subject, intro, outro });

export const fetchEmail = (filters) => {
  const params = new URLSearchParams();

  if (filters.queryParams) {
    const qp = new URLSearchParams(filters.queryParams);
    qp.forEach((value, key) => {
      if (value) params.append(key, value);
    });
  }
  if (filters.q) params.append("q", filters.q);

  return api.get(`/superadmin/fetchEmail?${params.toString()}`);
};

export const updateRole = (userId, role) =>
  api.patch("/superadmin/updateRole", { userId, role });

export const disbandTeam = (teamName) =>
  api.delete("/superadmin/disbandTeam", {
    data: { teamName },
  });

export const getAllCourses = () => api.get("/superadmin/courses");

export const getTeamHistory = (teamName) =>
  api.post("/superadmin/teamHistory", { teamName });

export const seeTeamMembers = (teamName) =>
  api.post("/superadmin/teamMemeberDetail", { teamName });

export const getUserHistory = (userId) =>
  api.get(`/superadmin/userHistory/${userId}`);

export const banUser = (userId, ban) =>
  api.patch("/superadmin/banUser", { userId, ban });

export const updateTeamSize = (courseId, newSize) =>
  api.patch("/superadmin/updateTeamSize", { courseId, newSize });

export const dumpCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/superadmin/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
