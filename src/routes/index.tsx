import { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/main/Home'

export const Route = createFileRoute('/')({
  component: Home,
})
