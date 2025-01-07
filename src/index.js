import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import reportWebVitals from './reportWebVitals';
// import "bootstrap/dist/css/bootstrap.min.css";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

export const url = 'http://localhost:8001';
// export const url = 'https://10.0.0.157:8442';
// export const url = 'http://35.172.163.23:8000';
// export const url = 'http://gauravmodi.ca:8000';
