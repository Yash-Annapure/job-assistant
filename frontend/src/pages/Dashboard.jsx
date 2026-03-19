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

    return(
         <div>
            <h1>Welcome, {user ? user.username : "..."}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard