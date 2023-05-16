import { useAuth0 } from "@auth0/auth0-react";
import * as api from "../api.js";
import { Navigate } from "react-router-dom"

export default function LoginRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && isAuthenticated) {
    const id = api.user_id(user);
    api.call("POST", "/users/new",
      {
        id: id + "",
        name: id + "",
        password: "",
      })
    return (
      <Navigate replace to="/" />
    )
  }

  return ""
}
