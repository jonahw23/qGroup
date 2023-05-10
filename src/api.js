const BASE = "http://127.0.0.1:5000/api";

export function call(method, route, body = undefined) {
  let headers = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) { headers.body = JSON.stringify(body); }

  return fetch(`${BASE}${route}`, headers)
    .then(res => res.json())
    .catch(err => console.error(err))
}

// In case more than Google auth is planned in the future,
// this function can hold the necessary ID parsing.
// Example call:
//
// import { useAuth0 } from "@auth0/auth0-react";
// const { user } = useAuth0()
// const id = user_id(user)
export function user_id(user) {
  if (user) {
    return parseInt(user.sub.split("|")[1])
  }
}
