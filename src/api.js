const BASE = "http://127.0.0.1:5000/api";

export function call(method, route, body = undefined) {
  let headers = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) { headers.body = JSON.stringify(body); }

  return fetch(`${BASE}${route}`, headers)
    .then(res => res.json())
    .catch(_err => { })
}
