import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const inpEmail = document.querySelector("#Email");
const inpPwd = document.querySelector("#Pwd");

const loginForm = document.querySelector("#login-form");

const handleLogin = (event) =>{
    event.preventDefault();

    let email = inpEmail.value;
    let pwd = inpPwd.value;

    if(!email || !pwd){
        alert("Vui lòng nhập đầy đủ thông tin");
    }

    signInWithEmailAndPassword(auth, email, pwd)
    .then((userCredential) => {
        const user = userCredential.user;

        const userSession = {
            user: {
                email : user.email
            },
            expiry : new Date().getTime() + 2*3600*1000 
        };

        localStorage.setItem('userSession', JSON.stringify(userSession));
        alert("Đăng nhập thành công!");

        window.location.href = 'index.html';

    })
    .catch((error) => {
        console.log("Lỗi: " + error.message);
    })
        
    
}

loginForm.addEventListener('submit',handleLogin);

