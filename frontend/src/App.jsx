// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import NoteList from './components/notes/NoteList'
import Header from './components/common/Header'
import NotePreview from './components/notes/NotePreview'
import NoteForm from './components/notes/NoteForm'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><NoteList /></ProtectedRoute>} />
          <Route path="/notes/:noteId" element={
            <ProtectedRoute>
              <NotePreview />
            </ProtectedRoute>
          } />
          <Route path="/notes/new" element={
  <ProtectedRoute>
    <NoteForm />
  </ProtectedRoute>
} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth() ;
  console.log("user in protected route", user) ;
  return user ? children : <Navigate to="/login" replace />
}

export default App