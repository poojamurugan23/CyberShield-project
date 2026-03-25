const BASE = "http://localhost:5000/api";

export const API = {
  login: (data) => fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  }),

  verifyOTP: (data) => fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  }),

  createCase: (data, token) => fetch(`${BASE}/cases`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  }),

  getCases: (token) => fetch(`${BASE}/cases`, {
    headers:{ Authorization: token }
  })
};