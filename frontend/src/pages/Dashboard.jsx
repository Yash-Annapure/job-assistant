import { useEffect,useState } from "react";
import { getMe } from "../api";

function Dashboard() {
    const [user,setUser] = useState(null)

    const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
    }

    useEffect(() => {
    const fetchUser = async () => {
        const data = await getMe()
        setUser(data)
    }
    fetchUser()

}, [])

    return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "0 24px" }}>
        <div style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "40px",
            marginBottom: "24px"
        }}>
            <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
                Welcome back, {user ? user.username : "..."}  👋
            </h1>
            <p style={{ color: "#888", marginBottom: "32px" }}>
                Here's your job search overview
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
                <a href="/jobs" style={{
                    backgroundColor: "#4f8ef7",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "14px"
                }}>Search Jobs</a>
                <a href="/applications" style={{
                    backgroundColor: "#2a2a2a",
                    color: "#e8e8e8",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "14px"
                }}>My Applications</a>
                <button onClick={handleLogout} style={{
                    backgroundColor: "transparent",
                    border: "1px solid #2a2a2a",
                    color: "#888",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer"
                }}>Logout</button>
            </div>
        </div>
    </div>
)
}

export default Dashboard