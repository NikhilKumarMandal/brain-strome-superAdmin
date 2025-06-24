import { api } from "./client";

// auth service
export const login = (token) => api.post("/auth/login", { token });

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

// SuperAdmin Server

export const stats = () => api.get("/superadmin/stats");

export const sendMail = (subject, intro, outro) =>
  api.post("/superadmin/sendBulkMail", { subject, intro, outro });
