import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav style={{
            backgroundColor: "#1a1a2e",
            padding: "15px 30px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
        }}>
            <span style={{ color: "#4f8ef7", fontWeight: "bold", fontSize: "18px" }}>
                Job Assistant
            </span>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/jobs" style={{ color: "white", textDecoration: "none" }}>Jobs</Link>
            <Link to="/applications" style={{ color: "white", textDecoration: "none" }}>Applications</Link>
        </nav>
    )
}

export default Navbar