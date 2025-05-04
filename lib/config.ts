const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "development";

const API_URL = isDev
  ? "http://localhost:8000"
  : "https://api.betwise.varekle.tech";

const API_URL_FULL = `${API_URL}/api/v1`;

export { API_URL, API_URL_FULL };