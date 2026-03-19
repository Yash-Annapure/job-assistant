import { useState } from "react"
import { useEffect } from "react"

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
        const reponse = await fetch("http://localhost:8000/auth/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password})
        })
        const data = await reponse.json()
        console.log(data)
        console.log(data["access_token"])
        console.log("token value:", data["access_token"])
        if (data["access_token"]) {
        localStorage.setItem("token", data.access_token)
        setIsLoggedIn(true)
        }
    }
    return (
        <div>
            <input onChange={(e) => setEmail(e.target.value)}/>
            <p>{email}</p>
            <Button label="Submit" onClick={handelLogin} /> 
            <input onChange={(e) => setPassword(e.target.value)}/>   
            <p>{password}</p>
            <Button label="Submit" onClick={handelLogin} />
            {isLoggedIn ? <h1> WELCOME!</h1> : <p>Please login</p>}
        </div>
    )
    
}

export default LoginForm