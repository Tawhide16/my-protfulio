import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"; // Fixed import - should be from 'react-router-dom'
import Home from './Pages/Home.jsx';
import ProjectDetails from './Pages/ProjectDetails.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Main app layout
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);