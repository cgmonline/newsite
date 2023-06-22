import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import AuthContext from 'assets/js/authContext'

export default function Navbar() {
  const { user, login, logout, authReady } = useContext(AuthContext)
  console.log(user)

  return (
    <div className="container">
      <nav>
        {authReady && (
          <ul>
            {!user && <li onClick={login} className="btn">Login/Signup</li>}
            {user && <li>{user.email}</li>}
            {user && <li onClick={logout} className="btn">Logout</li>}
          </ul>
        )}
      </nav>
    </div>
  )
}