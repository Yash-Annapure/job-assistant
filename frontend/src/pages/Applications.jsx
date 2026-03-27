import { useEffect,useState } from "react";
import { getApplications } from "../api";

function Applications() {
    const [applications,setApplications] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApplications = async () => {
            const data = await getApplications()
    if (Array.isArray(data)) {
        setApplications(data)
    } else {
        setApplications([])
    }
    setLoading(false)
}
        fetchApplications()
    }, [])
    return (
    <div>
        <h1>My Applications</h1>
        {loading ? (
            <p>Loading...</p>
        ) :applications == null || applications.length === 0 ? (
            <p>No applications found.</p>
        ) : (
            applications.map(app => (
                <div key={app.id}>
                    <h2>{new Date(app.applied_at).toLocaleDateString()}</h2>
                    <p>{app.status}</p>
                    <p>{app.notes}</p>
                </div>
            ))
        )}
    </div>
)
}
export default Applications