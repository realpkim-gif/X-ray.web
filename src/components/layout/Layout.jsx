import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Navbar />
      <main key={location.pathname} className="flex-1 animate-fade-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
