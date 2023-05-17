import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import { useAuth0, Auth0Provider } from "@auth0/auth0-react"

import App from './App';
import Login from './account/Login';
import LoginRedirect from './account/LoginRedirect';


function AppRoutes() {
  const { isLoading, isAuthenticated } = useAuth0();
  return (
    <Router>
      <Routes>
        <Route path="/login_redirect" element={<LoginRedirect />} />
        <Route path="/account" element={<Login />} />
        <Route path="/*" element={
          !isLoading && isAuthenticated
            ? <App />
            : <Login />} />
      </Routes>
    </Router>
  )
}

export default function LandingPage() {

  return (
    <Auth0Provider
      domain="dev-o67p7tq48xlb0jt1.us.auth0.com"
      clientId="lh7xJTrQCQrPr9NEzlbuFMBX7dC8FMoj"
      authorizationParams={{
        redirect_uri: window.location.origin + "/login_redirect"
      }}>
      <AppRoutes />
    </Auth0Provider>
  )
}
