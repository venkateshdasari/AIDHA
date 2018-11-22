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

export function checkLoginStatus(handleSuccess, handleError) {
  fetch(URL + LOGIN_ENDPOINT, {
    method: 'GET'
  }).then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        handleSuccess();
      } else {
        handleError();
      }
    })
}

export function getConfig(handleSuccess, handleError) {
  fetch(URL + CONFIG_ENDPOINT, {
    method: 'GET'
  }).then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        handleSuccess();
      } else {
        handleError();
      }
    })
}

export function addExpense(userID, description, date, category, spending_type, amount, handleSuccess, handleError){
  fetch(URL + EXPENSES_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        "date": date,
        "description": description,
        "spending_type": spending_type,
        "category": category,
        "amount": amount,
        "userID": userID,
      })
    }).then((response) => response.json())
    .then((data) => {
      if(data.status !== 200){
        handleSuccess();
      }else{
        handleError();
      }
    })
}

export function getAllExpense(userID, handleSuccess, handleError){
  fetch(URL + EXPENSES_ENDPOINT + `?user_id=${encodeURIComponent(userID)}`, {
    method: 'GET'
  }).then((response) => response.json())
    .then((data) => {
      if(data.status === 200){
        handleSuccess(data.result);
      }else{
        handleError();
      }
    })
}
