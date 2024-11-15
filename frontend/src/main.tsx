import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landingPage.tsx'
import LoginPage from './pages/auth/login.tsx'
import RegisterPage from './pages/auth/register.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ExploreLawsPage from './pages/laws/explore.tsx'
import ChatbotPage from './pages/chat/chat.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage/>
  },
  {
    path: '/auth/register',
    element: <RegisterPage/>
  },
  {
    path: '/laws',
    element: <ExploreLawsPage/>,
  },
  {
    path: '/chat',
    element: <ChatbotPage/>,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
  
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
