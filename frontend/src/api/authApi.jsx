// api.jsx

// routes signup api call to the backend
export async function signup({ name, email, password }) {
  const res = await fetch("/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("signup failed"); 
  return res.json().catch(() => ({}));
}

export async function signin({ email, password }) {
  const res = await fetch("/api/users/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Signin failed");
  }
  
  return res.json().catch(() => ({}));
}