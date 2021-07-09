import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes/index'
import AuthProvider from './contexts/auth'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000}/>
          <Routes></Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
