import { useState } from "react"
import { loginUser } from "../api.js"

function Button({ label, onClick }) {
    return <button onClick={onClick}>{label}</button>
}

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async () => {
        const data = await loginUser(email, password)
        if (data && data.access_token) {
            localStorage.setItem("token", data.access_token)
            window.location.href = "/dashboard"
        } else {
            setError("Invalid email or password")
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "40px",
                width: "400px"
            }}>
                <h1 style={{ marginBottom: "8px", fontSize: "24px" }}>Welcome back</h1>
                <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
                    Sign in to your account
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                    />
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    {error && <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>}
                    <Button label="Sign In" onClick={handleLogin} />
                    <p style={{ color: "#888", fontSize: "14px", textAlign: "center" }}>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm