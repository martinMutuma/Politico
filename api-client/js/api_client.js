const default_url1 = 'https://mmmpolitical.herokuapp.com/api/v2/'
const default_url = 'http://127.0.0.1:5000/api/v2/'
const token = sessionStorage.getItem('token')

function make_request(url, method, data = null) {
    httpHeaders = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Authorization': 'Bearer ' + token

    }
    MyHeader = new Headers(httpHeaders);
    if (data != null) {

        data = JSON.stringify(data)
        
    }
    requestInit = {
        Headers: MyHeader,
        method: method,
        mode: 'cors',
        cache: 'default',
        body: data,
    }
    if (method == 'get') {
        requestInit = {
            Headers: MyHeader,
            method: method,
            mode: 'cors',
            cache: 'default',
        }
    }
    MyRequest = new Request(url, requestInit);
    return fetch(url, requestInit)
        .then(function (response) {

            return response.text()
        })
        .then(function (data) {
            data = data ? JSON.parse(data) : {};
            if (data.error != null) {
                showError(data.error);
            }
            return data
        })


}

function login() {
    data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    url = default_url + 'auth/login'
    make_request(url, 'POST', data)
        .then(function (response) {
            
            if (response.data != null) {
                data = response.data;
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', data.user);
               if (data.user.isadmin == true){
                    window.location.replace('admin.html')
               }else{
                  window.location.replace('index.html') 
               }

            }
        });
}

function showError(msg, id = 'message') {
    var element = document.getElementById(id);
    element.style.display = 'block';
    element.classList.add('alert');
    element.classList.add('bg-error');
    element.innerHTML = msg
}
function check_login(){
    if (token == null){
      window.location.replace('login.html')
}
}
