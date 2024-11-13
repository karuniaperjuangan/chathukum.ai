import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import LandingPage from './pages/landingPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
    <RouterProvider router={router} />
    </FluentProvider>
  </StrictMode>,
)
