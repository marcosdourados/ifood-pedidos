import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Pedidos Bistrô</h1>
        <p>Bem-vindo ao nosso sistema de gerenciamento de pedidos</p>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
