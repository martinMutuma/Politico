const default_urlf = 'https://mmmpolitical.herokuapp.com/api/v2/'
const default_url = 'http://127.0.0.1:5000/api/v2/'
var token = sessionStorage.getItem('token')
    //default actions 
create_flash_div()
check_login();
create_spinner()

function make_request(url, method, data = null) {
    show_loader()
    token = sessionStorage.getItem('token')

    httpHeaders = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'authorization': 'Bearer ' + token

    }

    MyHeader = new Headers(httpHeaders);
    if (data != null) {

        data = JSON.stringify(data)

    }
    requestInit = {
        headers: MyHeader,
        method: method,
        mode: 'cors',
        cache: 'default',
        body: data,
    }
    if (method == 'get') {
        requestInit = {
            headers: MyHeader,
            method: method,
            mode: 'cors',
            cache: 'default',
        }
    }
    MyRequest = new Request(url, requestInit);
    return fetch(url, requestInit)
        .then(function (response) {
            hide_loader();
            return response.text();
        })
        .then(function (data) {
            data = data ? JSON.parse(data) : {};
            if (data.error != null) {
                showError(data.error);
            }
            hide_loader();
            return data
        }).catch(function (error) {
            hide_loader();
            showError("Something Wrong. Probably connection to server");

            return error;
        });


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
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('userob', data.user);
                localStorage.setItem('message', "Login Successfull")
                if (data.user.isadmin == true) {

                    window.location.replace('admin.html')
                } else {
                    window.location.replace('index.html')
                }

            }
        });
}

function showError(msg, id = 'flash-message') {
    localStorage.setItem('error', msg)
    var element = document.getElementById(id);
    element.parentElement.style.display = 'block';
    element.parentElement.classList.add('bg-error');
    element.innerHTML = msg
    hide_flash_message()
}

function showMessage(msg, id = 'flash-message') {
    localStorage.setItem('message', msg)
    var element = document.getElementById(id);
    element.parentElement.style.display = 'block';
    element.parentElement.classList.add('bg-success');
    element.innerHTML = msg
    hide_flash_message()
}

function hide_flash_message(time_wait = 50000, id = 'flash-message') {
    setTimeout(function () {
        var element = document.getElementById(id);
        element.parentElement.style.display = 'none';
    }, time_wait)
    localStorage.setItem('error', null)
    localStorage.setItem('message', null)
}

function check_login() {
    current_url = window.location.href


    if (current_url.search(/login/i) == -1 & current_url.search(/signup/i) == -1) {
        if (token == null || token == 'null') {
            localStorage.setItem('error', "Please, login to access the page")
            if (current_url.search(/admin/i) == -1 || current_url.search(/admin.h/i) != -1) {
             
                window.location.replace('login.html')
            } else {
                window.location.replace('../login.html')
            }

        } else {
            user = JSON.parse(sessionStorage.getItem('user', null));

            if (current_url.search(/admin/i) != -1 & (user == null || user.isadmin != true)) {
                if (current_url.search(/admin.h/i) == -1) {
                    window.location.replace('../login.html');
                } else {
                    window.location.replace('login.html');
                }
            }
        }
    }

}

function signup() {
    data = getFormDataById('signup')
    url = default_url + 'auth/signup'
    make_request(url, 'POST', data)
        .then(function (response) {
            if (response.data != null) {
                data = response.data;
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('userob', data.user);

                localStorage.setItem('message', "Registration Successfull. Welcome to Politcal " + data.user.firstname)
                window.location.replace('index.html')
            }
        });

}

function getFormDataById(form_id) {

    var formData = new FormData(document.getElementById(form_id));

    var data = {};
    formData.forEach(function (value, key) {

        data[key] = value;
    });
    return data
}

function popSignup() {
    document.getElementById('firstname').value = "Name";
    document.getElementById('lastname').value = "lastname";
    document.getElementById('email').value = "mail@mail.com";
    document.getElementById('othername').value = "main";
    document.getElementById('passporturl').value = "www.url.com/dkdkd";
    document.getElementById('phonenumber').value = "07372883828";
    document.getElementById('password').value = "password";
}


function create_flash_div() {
    var flash_div = document.createElement('div')
    flash_div.classList.add('flash-msg')

    var close_btn = document.createElement("span")
    close_btn.classList.add('flash-msg-close')
    close_btn.setAttribute('onclick', 'this.parentElement.style.display="none";')
    var close_x = document.createTextNode("x")
    close_btn.appendChild(close_x)
    flash_msg = document.createElement('span')
    flash_msg.id = 'flash-message'
    var msg = document.createTextNode('This is a test message')
    flash_msg.appendChild(msg)
    flash_div.appendChild(close_btn)
    flash_div.appendChild(flash_msg)
    flash_div.style.display = 'none';
    document.body.appendChild(flash_div)

    error = localStorage.getItem('error')
    if (error != null & error != 'null') {
        showError(error)
    }
    message = localStorage.getItem('message')
    if (message != null & message != 'null') {
        showMessage(message)
    }

}

function create_spinner() {
    var wrapper = document.createElement('div');
    wrapper.classList.add('loader-wrapper')
    wrapper.id = 'my-loader';
    var text = document.createTextNode('Please wait.....')
    var spinner = document.createElement('div');
    spinner.classList.add('loader-spin')
    wrapper.appendChild(spinner);
    wrapper.appendChild(text);
    wrapper.style.display = 'none';
    document.body.appendChild(wrapper)

}

function show_loader() {
    document.getElementById('my-loader').style.display = 'block'
}

function hide_loader() {
    document.getElementById('my-loader').style.display = 'none'
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
}

//admin
function create_party(e) {
    e.preventDefault();
    data = getFormDataById('create-party')

    url = default_url + 'parties'
    make_request(url, 'POST', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {

                localStorage.setItem('message', "Party: " + data.name + " Created");
                window.location.replace('listpoliticalParties.html');
            }
        });

    return false;

}

function get_all_parties() {
    url = default_url + 'parties'
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                table = document.getElementById('listParties');
                data.forEach(function (party, key) {
                    var newRow = table.insertRow();
                    var id = newRow.insertCell(0);
                    var name = newRow.insertCell(1);
                    var address = newRow.insertCell(2);
                    var action = newRow.insertCell(3);
                    id.innerHTML = party.id;
                    name.innerHTML = party.name;
                    address.innerHTML = party.hqaddress;
                    newRow.id = 'party-' + party.id

                    var editButton = document.createElement('button');
                    editButton.classList.add('button');
                    editButton.classList.add('bg-warning');
                    editButton.setAttribute('onclick', 'edit_party(' + party.id + ')')
                    editButton.innerHTML = 'Edit'
                    action.appendChild(editButton);
                    var deleteButton = document.createElement('button');
                    deleteButton.classList.add('button');
                    deleteButton.classList.add('bg-error');
                    deleteButton.setAttribute('onclick', 'delete_party(' + party.id + ')');
                    deleteButton.innerHTML = 'Delete';
                    action.appendChild(deleteButton);
                });
            }
        });
}

function edit_party(id) {
    url = default_url + 'parties/' + id
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                sessionStorage.setItem('edit_party', JSON.stringify(data));
                window.location.replace('editParty.html');
            }
        });
}

function populate_edit_party_form() {
    edit_party = JSON.parse(sessionStorage.getItem('edit_party'));

    if (edit_party == null) {
        localStorage.setItem('error', "No party Selected");
        window.location.replace('listpoliticalParties.html');
    }
    document.getElementById('party-head').innerHTML += '' + edit_party.name;
    document.getElementById('name').value = edit_party.name;
    document.getElementById('hqaddress').value = edit_party.hqaddress;
    document.getElementById('logourl').value = edit_party.logourl;
}

function save_party_edit(e) {
    e.preventDefault();
    edit_party = JSON.parse(sessionStorage.getItem('edit_party'));
    if (edit_party == null) {
        localStorage.setItem('error', "No party Selected");
        window.location.replace('listpoliticalParties.html');
    }
    data = {
        name: document.getElementById('name').value
    }

    url = default_url + 'parties/' + edit_party.id
    make_request(url, 'PATCH', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {
                localStorage.setItem('message', "Party Updated");
                sessionStorage.setItem('edit_party', null);
                window.location.replace('listpoliticalParties.html');
            }
        });
    return false;
}

function delete_party(id) {
    var confirmDel = confirm('Are you sure? This is not reversible.')
    if (confirmDel == true) {
        url = default_url + 'parties/' + id
        make_request(url, 'DELETE')
            .then(function (response) {
                data = response.data;

                if (data != null) {
                    delRow = document.getElementById('party-' + id);
                    table = document.getElementById('listParties');
                    table.deleteRow(delRow.rowIndex)
                    showMessage(data.message);

                }
            });

    }
}

function get_all_Offices() {
    url = default_url + 'offices'
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                table = document.getElementById('listOffices');
                count = 0;
                data.forEach(function (office, key) {
                    count +=1;
                    var newRow = table.insertRow();
                    var id = newRow.insertCell(0);
                    var name = newRow.insertCell(1);
                    var type = newRow.insertCell(2);
                    var action = newRow.insertCell(3);
                    id.innerHTML = count;
                    name.innerHTML = office.name;
                    type.innerHTML = office.type;
                    newRow.id = 'office-' + office.id

                    var editButton = document.createElement('button');
                    editButton.classList.add('button');
                    editButton.classList.add('bg-warning');
                    editButton.setAttribute('onclick', 'edit_office(' + office.id + ')');
                    editButton.innerHTML = 'Edit';
                    action.appendChild(editButton);
                    var deleteButton = document.createElement('button');
                    deleteButton.classList.add('button');
                    deleteButton.classList.add('bg-error');
                    deleteButton.setAttribute('onclick', 'delete_office(' + office.id + ')');
                    deleteButton.innerHTML = 'Delete';
                    action.appendChild(deleteButton);
                });
            }
        });
}

function add_office(e) {
    e.preventDefault();
    data = getFormDataById('newOffice')

    url = default_url + 'offices'
    make_request(url, 'POST', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {

                localStorage.setItem('message', "Office: " + data.name + " Created");
                window.location.replace('listpoliticalOffices.html');
            }
        });

    return false;

}

function delete_office(id) {
    var confirmDel = confirm('Are you sure? This is not reversible.')
    if (confirmDel == true) {
        url = default_url + 'offices/' + id
        make_request(url, 'DELETE')
            .then(function (response) {
                data = response.data;

                if (data != null) {
                    delRow = document.getElementById('office-' + id);
                    table = document.getElementById('listOffices');
                    table.deleteRow(delRow.rowIndex)
                    showMessage(data.message);

                }
            });

    }
}

function edit_office(id) {
    url = default_url + 'offices/' + id
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                sessionStorage.setItem('edit_office', JSON.stringify(data));
                document.getElementById('edit-office-head').innerHTML = '&#8258 Edit Office ' + data.name;
                document.getElementById('office-name').value = data.name;

            }
        });
    modal_show('edit-party-modal');

}

function save_office_edit(e) {
    e.preventDefault();
    edit_office = JSON.parse(sessionStorage.getItem('edit_office'));
    if (edit_party == null) {
        localStorage.setItem('error', "No Office Selected");
        window.location.replace('listpoliticalOffices.html');
        return false;
    }
    data = {
        name: document.getElementById('office-name').value
    }
    url = default_url + 'offices/' + edit_office.id
    make_request(url, 'PATCH', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {
                showMessage("Office Updated");
                sessionStorage.setItem('edit_office', null);
                modal_hide('edit-party-modal');
                window.location.replace('listpoliticalOffices.html');
            }
        });
    return false;
}
