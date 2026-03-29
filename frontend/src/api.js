const API_URL = "http://localhost:8000"

const getToken = () => localStorage.getItem("token")

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/login"
        return null
    }
    return response.json()
}

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
}

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username,email,password})
    })
    return handleResponse(response)
}

export const searchJob = async (query,location) =>{
    const response = await fetch(`${API_URL}/jobs/search?query=${query}&location=${location}`,{
        method : "GET",
        headers : {"Content-Type": "application/json"},
        })
    return handleResponse(response)
}
export const uploadCV = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`${API_URL}/cv/upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getToken()}`
            // NO Content-Type header — browser sets it automatically for FormData
        },
        body: formData
    })
    return handleResponse(response)
}

export const matchCV = async (job_description) => {
    const response = await fetch(`${API_URL}/jobs/match`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body : JSON.stringify({job_description})
    })
    return handleResponse(response)
}

export const generateCoverLetter = async (job_description) => {
    const response = await fetch(`${API_URL}/jobs/cover-letter`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body : JSON.stringify({job_description})
    })
    return handleResponse(response)
}

export const getApplications = async () => {
    const response = await fetch(`${API_URL}/applications/get`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    })
    return handleResponse(response)
}

export const createApplication = async (job_id,status,notes) => {
    const response = await fetch(`${API_URL}/applications/create`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body : JSON.stringify({job_id,status,notes})
    })
    return handleResponse(response)
}

export const getMe = async () => {
    const response = await fetch(`${API_URL}/users/me`,{
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })
    return handleResponse(response)
}

export const deleteCV = async () => {
    const response = await fetch(`${API_URL}/cv/delete`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return handleResponse(response)
}

export const analyzeCV = async () => {
    const response = await fetch(`${API_URL}/cv/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return handleResponse(response)
}

export const getCV = async () => {
    const response = await fetch(`${API_URL}/cv/get`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return handleResponse(response)
}

export const saveJob = async (job) => {
    const response = await fetch(`${API_URL}/jobs/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(job)
    })
    return handleResponse(response)
}

export const updateApplication = async (id, status, notes) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status, notes })
    })
    return handleResponse(response)
}

export const getInterviewPrep = async (job_description) => {
    const response = await fetch(`${API_URL}/jobs/interview-prep`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ job_description })
    })
    return handleResponse(response)
}

export const deleteApplication = async (id) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return handleResponse(response)
}
