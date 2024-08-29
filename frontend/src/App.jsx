// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import NoteList from './components/notes/NoteList'
import Header from './components/common/Header'
import { Spinner } from 'flowbite-react'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><NoteList /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth() ;
  console.log("user in protected route", user) ;
   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner aria-label="Loading..." size="xl" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default App