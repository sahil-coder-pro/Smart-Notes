// src/components/common/Header.jsx
import { Link } from 'react-router-dom'
import { Button, Avatar } from 'flowbite-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth() ;
  const [darkMode, setDarkMode] = useState(false);

  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  return (
    <header className="border-b p-4 flex justify-between items-center dark:border-gray-700">
      <Link to="/" className="text-xl font-bold dark:text-white">Notes App</Link>
      
      <div className="flex items-center gap-4">
        <Button 
          color="gray" 
          onClick={() => setDarkMode(prev => !prev)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌞' : '🌙'}
        </Button>
        
        {user ? (
            <>
            {/* {console.log(user) } */}
            <span className="text-gray-600 dark:text-gray-300">      
                <Avatar placeholderInitials={user.name?.charAt(0) || 'NU'} rounded />
</span>
            <Button color="gray" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" color="gray">Login</Button>
            <Button as={Link} to="/signup">Sign up</Button>
          </>
        )}
      </div>
    </header>
  )
}