import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export const Route = createRootRoute({
  component: () => {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith('/admin')

    return (
      <div className="min-h-screen flex flex-col w-full bg-[#F4F6F8]">
        {/* Render Navbar conditionally if it's not an admin route */}
        {!isAdminRoute && <Navbar />}

        {/* Route Outlet */}
        <Outlet />

        {/* Render Footer conditionally if it's not an admin route */}
        {!isAdminRoute && <Footer />}

        {/* Notification Toast */}
        <Toaster richColors position="top-right" closeButton />

        {/* Devtools */}
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </div>
    )
  },
})

