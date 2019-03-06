const default_url = 'https://mmmpolitical.herokuapp.com/api/v2/';
const default_urls = 'http://127.0.0.1:5000/api/v2/';
var token = sessionStorage.getItem('token');
var current_url = window.location.href;
sessionStorage.setItem('voting', false);
//default actions 
create_flash_div();
check_login();
create_spinner();

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
    check_login();
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
                    count += 1;
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

function get_all_users() {
    url = default_url + 'auth/users'
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;
            var all_users = [];
            if (data != null) {
                table = document.getElementById('listUsers');
                data.forEach(function (user, key) {
                    var user_id = user.id
                    all_users[user_id] = user;
                    var newRow = table.insertRow();
                    var id = newRow.insertCell(0);
                    var name = newRow.insertCell(1);
                    var address = newRow.insertCell(2);
                    var action = newRow.insertCell(3);
                    id.innerHTML = user.id;
                    name.innerHTML = user.firstname + ' ' + user.lastname + ' ' + user.othername;
                    address.innerHTML = user.email;
                    newRow.id = 'user-' + user.id
                    var viewButton = document.createElement('button');
                    viewButton.classList.add('button');
                    viewButton.classList.add('bg-info');
                    viewButton.setAttribute('onclick', 'view_user(' + user.id + ')');
                    viewButton.innerHTML = 'view';
                    action.appendChild(viewButton);

                });
                localStorage.setItem('all_users', JSON.stringify(all_users));

            }
        });
}

function view_user(id) {
    all_users = JSON.parse(localStorage.getItem('all_users'));
    user = all_users[id];
    document.getElementById('profile-img').setAttribute('src', user.passporturlstring);
    document.getElementById('profile-img').onerror = function () {
        document.getElementById('profile-img').src = "../images/person3.JPG";
    }
    var mini_info = document.getElementById('user-mini-info');
    mini_info.innerHTML = '';
    var name = document.createElement('h2');
    var full_name = user.firstname + ' ' + user.lastname;
    name.innerHTML = full_name;
    var email = document.createElement('p');
    email.innerHTML = 'Email:' + user.email;

    mini_info.appendChild(name);
    mini_info.appendChild(email);
    var reg_head = document.getElementById('register-candidate-head')
    reg_head.innerHTML = 'Register ' + full_name + ' as a candidate'
    var table = document.getElementById('user-profile-table');
    table.innerHTML = '';

    Object.keys(user).forEach(function (key) {
        if (key != 'id' &
            key != 'email') {
            var newRow = table.insertRow();
            var theKey = newRow.insertCell(0);
            var theValue = newRow.insertCell(1);
            theKey.style.textTransform = 'capitalize';
            theKey.innerHTML = key + ':';
            theValue.innerHTML = user[key];
        }
    });
    var make_admin = document.getElementById('admin-action');
    if (user.isadmin == true) {
        make_admin.style.display = 'none';


    } else {
        make_admin.classList.add('bg-warning');
        make_admin.innerHTML = "Make User Admin";
        make_admin.setAttribute('onClick', 'make_user_admin(' + user.id + ');');
        make_admin.style.display = 'block';
    }
    var candidate_form = document.getElementById('newCandidate');
    candidate_form.setAttribute('onSubmit', 'save_candidate(event,' + user.id + ')')
    modal_show('view-user-modal');

}

function fetch_all_Offices() {
    var url = default_url + 'offices'
    var r_data = make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                return data;

            }
            showError('Something went wrong');
            return {};
        });
    return r_data;
}

function offices_dropdown() {
    var data = fetch_all_Offices()
        .then(function (data) {

            office_select = document.getElementById('office-select');
            count = 0;
            data.forEach(function (office, key) {
                count += 1;

                var opt = document.createElement('option');
                opt.value = office.id;
                opt.innerHTML = office.name + '(' + office.type + ')';

                office_select.appendChild(opt);

            });
        });
}

function save_candidate(event, id) {
    event.preventDefault()
    var data = {
        user_id: id
    };
    var office_id = document.getElementById('office-select').value;
    url = default_url + 'offices/' + office_id + '/register';
    make_request(url, 'POST', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {
                showMessage('Registration Successful');
                modal_hide('view-user-modal');
            }
        });

}

function get_all_parties_front() {
    url = default_url + 'parties'
    make_request(url, 'GET')
        .then(function (response) {
            data = response.data;
            var all_parties = document.getElementById('all-parties');
            var len =  Object.keys(data).length
            if (data != null & len>0) {

                data.forEach(function (party, key) {
                   
                    var newParty = document.getElementById('party-profile');
                    var template = newParty.cloneNode(true);
                    var party_details = document.getElementById('party-details');
                    var name = document.createElement('h2');
                    var address = document.createElement('p');

                    name.innerHTML = party.name;
                    address.innerHTML = '<b>Address:</b>' + party.hqaddress;
                    party_details.appendChild(name);
                    party_details.appendChild(address);
                    var img = document.getElementById('party-logo');
                    img.setAttribute('src', party.logourl);

                    newParty.setAttribute('id', 'party-profile-' + party.id);
                    img.setAttribute('id', 'party-logo-' + party.id);
                    party_details.setAttribute('id', 'party-details-' + party.id);
                    newParty.style.display = 'block';
                    all_parties.appendChild(template);
                    document.getElementById('party-logo-' + party.id).onerror = function () {
                        var alt_img = "images/party 4.png";
                        if (current_url.search(/admin/i) != -1) {
                            alt_img = "../images/party 4.png"
                        }

                        document.getElementById('party-logo-' + party.id).src = alt_img;
                    }
                });
            }else{
               
            var error = document.createElement('div');
            error.classList.add('alert');
            error.classList.add('bg-warning');
            error.innerHTML = '<p>No registred parties</p>';
            all_parties.appendChild(error);
            }
        });
}

function offices_sidebar_menu() {
    var data = fetch_all_Offices()
        .then(function (data) {

            office_side = document.getElementById('offices-sidebar');
            count = 0;
            data.forEach(function (office, key) {
                count += 1;

                var opt = document.createElement('a');
                opt.setAttribute('onclick', 'candidates_by_office_front(this,' + office.id + ')');
                opt.innerHTML = office.name + '(' + office.type + ')';
                opt.id = 'office_link_' + office.id;

                office_side.appendChild(opt);

            });
        });
}

function fetch_candidates(id = null) {
    var url = default_url + 'candidates';

    if (id != null) {

        url = default_url + 'offices/' + id + '/candidates'
    }

    var r_data = make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                return data;

            }
            showError('Something went wrong');
            return {};
        });
    return r_data;
}

function candidates_by_office_front(elem, id) {
    office_side = document.getElementById('offices-sidebar');
    menu_items = office_side.children;
    for (x in menu_items) {
        console.log();
        if (menu_items[x].classList != null) {
            menu_items[x].classList.remove('active');
        }
    }
    elem.classList.add('active');

    fetch_candidates(id).then(function (data) {
        var all_candidates = document.getElementById('all-candidates');
        var theTemplate = document.getElementById('candidate-profile');
        all_candidates.innerHTML = '';
        all_candidates.appendChild(theTemplate);
        document.getElementById('office-header').innerHTML = ' &#x265B; ' + elem.innerHTML;

        if (data != null & data.length > 0) {


            data.forEach(function (candidate, key) {

                var newCandidate = document.getElementById('candidate-profile');
                template = newCandidate.cloneNode(true);
                var candidate_details = document.getElementById('candidate-details');
                var name = document.createElement('h2');



                name.innerHTML = candidate.candidate_name;

                candidate_details.appendChild(name);


                var office = document.createElement('p');
                office.innerHTML = '<b>Office:</b>' + candidate.office_name + '(' + candidate.office_type + ')';
                candidate_details.appendChild(office);
                if (sessionStorage.getItem('voting')) {
                    set_voting(candidate);
                }
                var img = document.getElementById('candidate-img');
                img.setAttribute('src', candidate.candidate_passport);

                newCandidate.setAttribute('id', 'candidate-profile-' + candidate.candidatev_id);
                img.setAttribute('id', 'candidate-logo-' + candidate.candidatev_id);
                candidate_details.setAttribute('id', 'candidate-details-' + candidate.candidatev_id);
                newCandidate.style.display = 'block';
                all_candidates.appendChild(template);
                document.getElementById('candidate-logo-' + candidate.candidatev_id).onerror = function () {
                    var alt_img = "images/person3.JPG";
                    if (current_url.search(/admin/i) != -1) {
                        alt_img = "../images/person3.JPG"
                    }
                    document.getElementById('candidate-logo-' + candidate.candidatev_id).src = alt_img;
                }
            });
        } else {
            var error = document.createElement('div');
            error.classList.add('alert');
            error.classList.add('bg-warning');
            error.innerHTML = 'No candidates Registred for ' + elem.innerHTML;;
            all_candidates.appendChild(error);
        }
    });
}

function all_candidates() {
    var element = document.getElementById('all-candidates-link');
    candidates_by_office_front(element, null)
}

function set_voting(candidate) {
    var url = default_url + 'votes/check/' + candidate.candidate_office_id
    var r_data = make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                if (data.voted == false) {
                    var vote_button = document.createElement('a');
                    vote_button.classList.add('button');
                    vote_button.classList.add('bg-info');
                    vote_button.classList.add('pull-right');
                    vote_button.setAttribute('onClick', "show_vote_modal(" + candidate.candidatev_id + ")");
                    vote_button.innerHTML = "&#10004; Vote for " + candidate.candidate_name;
                    var vote_area = document.getElementById('cast_vote');
                    vote_area.innerHTML = '';
                    vote_area.appendChild(vote_button);
                    vote_area.id = 'cast_vote_' + candidate.candidatev_id
                } else if (data.voted == true) {
                    var voted_alert = document.createElement('div');
                    voted_alert.classList.add('alert');
                    voted_alert.classList.add('bg-warning');
                    voted_alert.classList.add('pull-right');
                    voted_alert.innerHTML = 'Your have already voted';
                    var vote_area = document.getElementById('cast_vote');
                    vote_area.innerHTML = '';
                    vote_area.appendChild(voted_alert);
                    vote_area.id = 'cast_vote_' + candidate.candidatev_id
                }
            }
        });
}

function show_vote_modal(candidate_id) {
    var url = default_url + 'candidates/' + candidate_id
    var r_data = make_request(url, 'GET')
        .then(function (response) {
            data = response.data;

            if (data != null) {
                var passport = document.getElementById('v-modal-passport');
                passport.src = data.candidate_passport;
                var details = document.getElementById('v-modal-c-details');
                details.innerHTML = '';
                var name = document.createElement('h2');
                name.innerHTML = 'Name: ' + data.candidate_name;
                var office = document.createElement('h2');
                office.innerHTML = 'Office: ' + data.office_name + "(" + data.office_type + ")";
                details.appendChild(name);
                details.appendChild(office);
                var confirm_vote_btn = document.getElementById('v-modal-vote-btn-confirm');
                confirm_vote_btn.setAttribute('class', 'button bg-success');
                confirm_vote_btn.innerHTML = "Vote"
                confirm_vote_btn.setAttribute('onClick', 'save_vote(' + candidate_id + ',' + data.candidate_office_id + ')');
                var action_div = document.getElementById('v-modal-vote-action');
                action_div.appendChild(confirm_vote_btn);
                var info = document.getElementById('v-modal-info');
                info.innerHTML = "<p>You are about to cast vote for " + data.candidate_name + ", click vote to cast </p>"
                modal_show('confirm-vote');
                document.getElementById('v-modal-passport').onerror = function () {
                    var alt_img = "images/person3.JPG";
                    document.getElementById('v-modal-passport').src = alt_img;
                }
            }
        });



}

function save_vote(candidate_id, office_id) {
    data = {
        candidate_id: candidate_id,
        office_id: office_id
    }

    url = default_url + 'votes';
    make_request(url, 'POST', data)
        .then(function (response) {
            data = response.data;

            if (data != null) {
                showMessage('Voted');
                var office_link = document.getElementById('office_link_' + office_id)
                candidates_by_office_front(office_link, office_id);
                modal_hide('confirm-vote');
            }
        });

}

function get_results() {
    var data = fetch_all_Offices()
        .then(function (data) {
            data.forEach(function (office, key) {
                var office_card = document.getElementById('office-result');

                var template = office_card.cloneNode(true);

                var header = document.getElementById('office-result-header');
                header.innerHTML = office.name + '(' + office.type + ')';

                var table = document.getElementById('office_result_table');
                var table_head = document.getElementById('result-table-header')
                table.innerHTML = '';
                table.appendChild(table_head);
                url = default_url + 'offices/' + office.id + '/result';
                make_request(url, 'GET').then(function (response) {
                    data2 = response.data;
                    if (data2 != null) {
                        count = 0;
                        data2.forEach(function (vote, key) {
                            count += 1
                            var newRow = table.insertRow();
                            if (count == 1) {
                                newRow.classList.add('bg-sucess-light');
                            }
                            var no = newRow.insertCell(0);
                            no.innerHTML = count;
                            var candidate_name = newRow.insertCell(1);
                            candidate_name.id = 'c_name_cell_' + vote.candidate_id;
                            candidate_name.innerHTML = 'Gettting name took long candidate:'+vote.candidate_id;
                            var result = newRow.insertCell(2);
                            result.innerHTML = vote.result;


                        });
                    }
                });
                header.id = 'office-result-header-' + office.id;
                office_card.id = 'office-result-' + office.id;
                table.id = 'office_result_table' + office.id;
                table_head.id = 'result-table-header' + office.id;
                office_card.style.display = 'flex';
                document.getElementById('all-results').appendChild(template);

            });
        }).then(function () {
            setTimeout( get_candidates_names(), 15000);
        });

}

function get_candidates_names() {
    fetch_candidates(null)
        .then(function (data) {
            if (data != null) {
                data.forEach(function (candidate, key) {

                    var cell_id = 'c_name_cell_' + candidate.candidatev_id;
                    var cell = document.getElementById(cell_id);

                    if (cell != null) {
                        cell.innerHTML = candidate.candidate_name;
                    } else {
                        var table = document.getElementById('office_result_table' + candidate.candidate_office_id);
                        if (table != null) {
                            var newRow = table.insertRow()
                            var no = newRow.insertCell(0);
                            no.innerHTML = '#';
                            var candidate_name = newRow.insertCell(1);
                            candidate_name.id = 'c_name_cell_' + candidate.candidatev_id;
                            candidate_name.innerHTML = candidate.candidate_name;
                            var result = newRow.insertCell(2);
                            result.innerHTML = 0;
                        }

                    }

                });
            }

        }).then(function () {
            calc_result_totals();
        });

}

function calc_result_totals() {
    var tables = document.getElementsByTagName("table");
    for (x in tables) {
        var table = tables[x];
        if (table instanceof Element || table instanceof HTMLDocument) {
            var rows = table.rows;
            var total = 0
            for (c in rows) {
                if (rows[c].cells != null) {
                    val = parseInt(rows[c].cells[2].innerHTML);
                    if (!isNaN(val)) {
                        total += val
                    }

                }


            }
            var newRow = table.insertRow();
            newRow.classList.add('bg-warning');
            var no = newRow.insertCell(0);
            no.innerHTML = '#';
            var name = newRow.insertCell(1);

            name.innerHTML = "Total Votes";
            var result = newRow.insertCell(2);
            result.innerHTML = total;
        }
    }

}
