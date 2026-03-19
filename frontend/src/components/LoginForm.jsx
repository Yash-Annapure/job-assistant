import { useState } from "react"
import { useEffect } from "react"
import { loginUser } from "../api.js"
function Button({ label, onClick}) {
        return <button onClick={onClick}>{label}</button>
    }
function LoginForm() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const token = localStorage.getItem("token")
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) setIsLoggedIn(true)
    }, [])
    
    const handelLogin = async () => {
        const data = await loginUser(email,password)  // refactored to login user to fetch from servide API layer
        if (data["access_token"]) {
        localStorage.setItem("token", data.access_token)
        setIsLoggedIn(true)
        }
    }
    return (
    <div>
        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
        <Button label="Login" onClick={handelLogin} />
        {isLoggedIn ? <h1>WELCOME!</h1> : <p>Please login</p>}
    </div>
) 
    
}

export default LoginForm