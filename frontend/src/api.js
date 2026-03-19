const API_URL = "http://localhost:8000"

const getToken = () => localStorage.getItem("token")

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    return response.json()
}

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username,email,password})
    })
    return response.json()
}

export const searchJob = async (query,location) =>{
    const response = await fetch(`${API_URL}/jobs/search?query=${query}&location=${location}`,{
        method : "GET",
        headers : {"Content-Type": "application/json"},
        })
    return response.json()
}
export const uploadCV = async (raw_text,file_path) => {
    const response = await fetch(`${API_URL}/cv/upload`,{
        method : "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body : JSON.stringify({raw_text,file_path})
        })
        return response.json()
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
    return response.json()
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
    return response.json()
}

export const getApplications = async () => {
    const response = await fetch(`${API_URL}/applications/get`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    })
    return response.json()
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
    return response.json()
}