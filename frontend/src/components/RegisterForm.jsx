import { useState } from "react"
import { registerUser } from "../api.js"

function RegisterForm() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegistration = async () => {
        setLoading(true)
        setError("")
        const data = await registerUser(username, email, password)
        setLoading(false)
        if (data && data.access_token) {
            localStorage.setItem("token", data.access_token)
            window.location.href = "/dashboard"
        } else {
            setError("Registration failed. Try again.")
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
        }}>
            <div style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                height: "300px",
                background: "radial-gradient(ellipse, rgba(120,80,255,0.12) 0%, transparent 70%)",
                pointerEvents: "none"
            }} />

            <div style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.5px", color: "#fff" }}>
                        Job Assistant
                    </span>
                </div>

                <div style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "32px"
                }}>
                    <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "6px", letterSpacing: "-0.3px" }}>
                        Create account
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "28px" }}>
                        Start your job search journey
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

                        {error && (
                            <p style={{
                                color: "#f87171", fontSize: "13px",
                                padding: "10px 12px",
                                backgroundColor: "rgba(248,113,113,0.08)",
                                borderRadius: "7px",
                                border: "1px solid rgba(248,113,113,0.15)"
                            }}>{error}</p>
                        )}

                        <button
                            onClick={handleRegistration}
                            disabled={loading}
                            style={{ marginTop: "4px", padding: "11px", fontSize: "14px", fontWeight: "500", opacity: loading ? 0.6 : 1 }}>
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>

                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
                        Already have an account?{" "}
                        <a href="/login" style={{ color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm