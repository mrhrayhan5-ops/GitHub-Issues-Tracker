// sign in function

document.getElementById("signin-btn").addEventListener("click", () =>{
    const inputName = document.getElementById("input-name");
    const username = inputName.value;
    
    const inputPassword = document.getElementById("input-password");
    const password = inputPassword.value;
    
    // console.log(window.location);
    if(username === "admin" && password === "admin123"){
        alert("Sign In Successful!");
        window.location.assign("/main.html");
    }else{
        alert("Sign In Unsuccessful!");
        return;
    }
});