import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Main Outlet */}
      <Outlet />
      
      {/* Notification Toast */}
      <Toaster richColors position="top-right" closeButton />
      
      {/* Devtools */}
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  ),
})
