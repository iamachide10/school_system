export async function apiFetch(url, options = {}) {
options.credentials = "include"

const token = localStorage.getItem("token")

options.headers = {
...(options.headers || {}),
Authorization: token ? `Bearer ${token}` : undefined,
}


let response = await fetch(`http://localhost:5001/api${url}`, options)

if (response.status === 401) {
console.log("Access token expired, refreshing...")


const refreshRes = await fetch("http://localhost:5001/api/refresh_token", {
  method: "POST",
  credentials: "include",
})

if (!refreshRes.ok) {
  console.log("Refresh failed → user must login again.")
  return response
}

const data = await refreshRes.json()

localStorage.setItem("token", data.accessToken)   // FIXED

options.headers.Authorization = `Bearer ${data.accessToken}`

response = await fetch(`http://localhost:5001/api${url}`, options)

}

return response
}
