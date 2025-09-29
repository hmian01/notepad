// api.jsx
// convienent place to have all api related code (can change api link at once) 


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

  if (!res.ok) throw new Error("signin failed"); 
  return res.json().catch(() => ({}));
}