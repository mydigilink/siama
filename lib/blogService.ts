const API_URL = "https://api.siama.in/api/v1/blogs";

export async function getBlogs() {
  const res = await fetch(API_URL, { cache: "no-store" });
  return res.json();
}

export async function getBlog(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
  return res.json();
}

export async function createBlog(data: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBlog(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}