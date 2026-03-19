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
        }
    }
    return (
        <div>
            <input onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
            <input onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            <input type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="Password"/>
            <Button lable = "Register" onClick={handelRegistration}/>
            {registration ? <h1> Registration Successful</h1>: <p>Please register</p>}
        </div>
    )
}           

export default RegisterForm