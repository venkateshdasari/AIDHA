const URL = 'http://localhost:5000';
const LOGIN_ENDPOINT = '/login';
const LOGOUT_ENDPOINT = '/logout';
const USER_ENDPOINT = '/user';
const CREATE_USER_ENDPOINT = '/user/create';
const CONFIG_ENDPOINT = '/config';
const EXPENSES_ENDPOINT = '/expense';
const HEADERS = {
  'Content-Type': 'application/json',
};

// Authentication
export function login(username, password, handleSuccess, handleError) {
  fetch(URL + LOGIN_ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      "user_id": username,
      "password": password,
    })
  }).then((response) => response.json())
    .then((resp) => {
      if (resp.status !== 200) {
        handleError(resp);
      }
      else {
        handleSuccess(resp);
      }
    })
}

export function checkLoginStatus(){
  fetch(URL + LOGIN_ENDPOINT, {
    method: 'GET'
  }).then((response) =>{
    let resp = response.json();
    console.log(resp);
    if(resp.status === 403) throw 'wrong password';
    if(resp.status === 404) throw 'user is not found';
    return true;
  })
}
