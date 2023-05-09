import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {

  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div>
      {isLoading ?
        <div className="w-full flex flex-col items-center p-5 gap-2">
          <span>Loading</span>
        </div>
        :
        <div>
          {isAuthenticated ?
            <div className="w-full flex flex-col items-center p-5 gap-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
              </button>
              <img src={user.picture} alt={user.name} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            :
            <div className="w-full flex flex-col items-center p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => loginWithRedirect()}>
                Log In
              </button>
            </div>
          }
        </div>
      }
    </div>
  )
}
