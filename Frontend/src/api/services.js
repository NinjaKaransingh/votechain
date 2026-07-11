import api from "./axios";

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const candidateAPI = {
  register: (data) => api.post("/candidates/register", data),
  getAll: () => api.get("/candidates"),
};

export const pollAPI = {
  getAll: () => api.get("/polls"),
  getById: (id) => api.get(`/polls/${id}`),
  create: (data) => api.post("/polls/create", data),
  addCandidate: (pollId, candidateId) =>
    api.post(`/polls/${pollId}/add-candidate`, { candidateId }),
};

export const voteAPI = {
  cast: (data) => api.post("/votes/cast", data),
  getResults: (pollId) => api.get(`/votes/results/${pollId}`),
};
