import { useState } from "react"
import { useEffect } from "react"
import { registerUser } from "../api.js"

function Button({lable,onClick}){
    return <button onClick = {onClick}>{lable}</button>
}

function RegisterForm(){
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [registration,isRegistered] = useState(false)
    const token = localStorage.getItem("token")
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if (token) isRegistered(true)
    },[])

    const handelRegistration = async () => {
        const data = await registerUser(username,email,password)
        if (data["access_token"]) {
            localStorage.setItem("token",data.access_token)
            isRegistered(true)
            window.location.href = "/dashboard"
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
            <h1 style={{ marginBottom: "8px", fontSize: "24px" }}>Create account</h1>
            <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
                Start your job search journey
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <Button lable="Register" onClick={handelRegistration}/>
                <p style={{ color: "#888", fontSize: "14px", textAlign: "center" }}>
                    Already have an account? <a href="/login">Sign in</a>
                </p>
                {registration && <p style={{ color: "#4ade80", textAlign: "center" }}>✓ Registration successful</p>}
            </div>
        </div>
    </div>
)
}           

export default RegisterForm