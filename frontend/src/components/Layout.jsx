import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function Layout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "⊞" },
        { path: "/jobs", label: "Find Jobs", icon: "◎" },
        { path: "/applications", label: "Applications", icon: "☰" },
    ]

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    const isActive = (path) => location.pathname === path

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>

            {/* Sidebar */}
            <div style={{
                width: collapsed ? "56px" : "210px",
                backgroundColor: "#080808",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                padding: "16px 0",
                transition: "width 0.2s ease",
                position: "fixed",
                height: "100vh",
                zIndex: 100
            }}>
                {/* Logo */}
                <div style={{
                    padding: "0 14px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    {!collapsed && (
                        <span style={{
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: "15px",
                            letterSpacing: "-0.3px"
                        }}>
                            Job Assistant
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "rgba(255,255,255,0.3)",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center"
                        }}>
                        {collapsed ? "›" : "‹"}
                    </button>
                </div>

                {/* Nav Items */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" }}>
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "9px 10px",
                                borderRadius: "7px",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: isActive(item.path) ? "rgba(255,255,255,0.08)" : "transparent",
                                color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.4)",
                                fontSize: "13.5px",
                                fontWeight: isActive(item.path) ? "500" : "400",
                                textAlign: "left",
                                width: "100%",
                                transition: "all 0.15s ease"
                            }}
                            onMouseEnter={e => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"
                                    e.currentTarget.style.color = "rgba(255,255,255,0.7)"
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.backgroundColor = "transparent"
                                    e.currentTarget.style.color = "rgba(255,255,255,0.4)"
                                }
                            }}
                        >
                            <span style={{ fontSize: "14px", opacity: 0.8, minWidth: "16px" }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <div style={{ padding: "0 8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "9px 10px",
                            borderRadius: "7px",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "13.5px",
                            width: "100%",
                            transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"
                            e.currentTarget.style.color = "rgba(255,255,255,0.75)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.color = "rgba(255,255,255,0.75)"
                        }}
                    >
                        <span style={{ fontSize: "14px", minWidth: "16px" }}>↪</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: collapsed ? "56px" : "210px",
                flex: 1,
                transition: "margin-left 0.2s ease",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }}>
                {/* Top Bar */}
                <div style={{
                    height: "52px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    backgroundColor: "#000",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 28px",
                    justifyContent: "flex-end",
                    position: "sticky",
                    top: 0,
                    zIndex: 50
                }}>
                    <div style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "0.3px"
                    }}>
                        v1.0
                    </div>
                </div>

                {/* Page Content */}
                <div style={{ padding: "36px 32px", flex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout