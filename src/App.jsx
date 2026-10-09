import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import About from './pages/About'
import Analyze from './pages/Analyze'
import Dashboard from './pages/Dashboard'
import Demo from './pages/Demo'
import DogDemo from './pages/DogDemo'
import ForgotPassword from './pages/ForgotPassword'
import HowItWorks from './pages/HowItWorks'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

// Matches vite.config.js's `base` (root locally, "/radiant/" on GitHub Pages)
// so route matching lines up with where the app is actually served from.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router basename={basename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="analyze" element={<Analyze />} />
              <Route path="demo" element={<Demo />} />
              <Route path="demo/dog" element={<DogDemo />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="about" element={<About />} />
              <Route
                path="login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="signup"
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <GuestRoute>
                    <ForgotPassword />
                  </GuestRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}
