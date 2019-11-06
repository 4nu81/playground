
function getPosts () {
    var accessToken = localStorage.getItem('accessToken')
    var User = JSON.parse(localStorage.getItem('user'))

    var url = "/posts"
    var req = new XMLHttpRequest()
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            res = this.responseText;
            document.querySelector('content').innerHTML = res;
        }
    }
    req.open("GET", url, true);
    req.setRequestHeader("Conten-Type", "application/json");
    req.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    req.send({ username: User.name });
}

function logout () {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set_Header()
    document.querySelector('content').innerHTML = "Content"
}

function login () {
    var login = document.querySelector('#login').value;
    var passwd = document.querySelector('#passwd').value;
    var data = {
        username: login,
        passwd: passwd
    }
    
    const url= "http://localhost:4000/login";

    var req = new XMLHttpRequest();
    req.withCredentials = true;
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            var cookie = req.getResponseHeader('Set-Cookie');
            console.log('cookie:',cookie)
            res = JSON.parse(this.responseText);
            var accessToken = res.accessToken;
            var refreshToken = res.refreshToken;
            var User = {
                name: login
            }
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(User));
            set_Header()
        }
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}

function set_Header () {
    const accessToken = localStorage.getItem('accessToken')
    const User = JSON.parse(localStorage.getItem('user'))

    var newHeader = document.createElement('header')
    if (accessToken && User) {

        var userField = document.createElement('span')
        userField.innerHTML = User.name

        var tokenField = document.createElement('span')
        tokenField.title = accessToken
        tokenField.innerHTML = 'accessToken'

        var logoutButton = document.createElement('button')
        logoutButton.innerHTML = 'Logout'

        var getPostsButton = document.createElement('button')
        getPostsButton.innerHTML = 'get Posts'

        newHeader.appendChild(userField)
        newHeader.appendChild(tokenField)
        newHeader.appendChild(logoutButton)
        newHeader.appendChild(getPostsButton)

        logoutButton.addEventListener("click", () => {logout ();});
        getPostsButton.addEventListener("click", () => {getPosts()})


    } else {

        var loginInput = document.createElement('input')
        loginInput.id = 'login'
        loginInput.type = 'text'

        var passwdInput = document.createElement('input')
        passwdInput.id = 'passwd'
        passwdInput.type= 'password'

        var submitButton = document.createElement('button')
        submitButton.innerHTML = 'Login'

        newHeader.appendChild(loginInput)
        newHeader.appendChild(passwdInput)
        newHeader.appendChild(submitButton)

        submitButton.addEventListener("click", () => {
            login();
        });
    }

    var header = document.querySelector('header');
    header.replaceWith(newHeader)
}

document.addEventListener("DOMContentLoaded", () => {
    set_Header();
});