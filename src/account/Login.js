import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';


function LoginButton({ isLogin, callback }) {
  let color = isLogin ? "blue" : "red";
  color = `bg-${color}-500 hover:bg-${color}-700`;

  return (
    <div className="w-full flex flex-col items-center p-5">
      <button
        className={`${color} text-white py-2 px-4 rounded`}
        onClick={callback}>
        {isLogin ? "Log In" : "Log Out"}
      </button>
    </div>
  )
}

function UserInfo({ user }) {
  return (
    <div className="w-full flex flex-col items-center p-5 gap-2">
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}


export default function Login() {

  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-lg flex flex-col items-center">

        <Link to="/" className="mb-5 text-blue-500 underline">Back home</Link>

        {
          isLoading
            ? <p>Loading...</p>
            : (
              <div>
                {isAuthenticated && <UserInfo user={user} />}
                <LoginButton
                  isLogin={!isAuthenticated}
                  callback={isAuthenticated ? logout : loginWithRedirect} />
              </div>
            )
        }

      </div>
    </div>
  )
}
