import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Applications from './pages/Applications'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App