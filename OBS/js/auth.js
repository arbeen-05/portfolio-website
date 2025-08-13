
// Register
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let company = document.getElementById("company").value;
        let pan = document.getElementById("pan").value;
        let password = document.getElementById("password").value;
        users.push({name,email,company,pan,password});
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registered Successfully!");
        window.location.href="OBS/index.html";
    });
}

// Login
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let user = users.find(u=>u.email===email && u.password===password);
        if(user){
            localStorage.setItem("username", user.name);
            window.location.href="OBS/dashboard.html";
        }else{
            alert("Invalid Credentials!");
        }
    });
}
