import { auth,db } from './firebase-config.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const inpUsername = document.querySelector("#Username");
const inpEmail = document.querySelector("#Email");
const inpPWD = document.querySelector("#Pwd");
const inpConfirmPWD = document.querySelector("#Confirm-pwd");

const RegisterForm = document.querySelector("#Register-form");

const handleRegister = (event) =>{
    event.preventDefault();
    let Username = inpUsername.value;
    let Email = inpEmail.value;
    let Password = inpPWD.value;
    let confirmPassword = inpConfirmPWD.value;
    let role_id =2;

    if(!Username || !Email || !Password || !confirmPassword){
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if(Password !== confirmPassword){
        alert("Mật khẩu không khớp!");
        return;
    }

    createUserWithEmailAndPassword(auth, Email, Password)
    .then((userCredential) => {
            const user = userCredential.user;
            const userData ={
                Username,
                Email,
                Password,
                role_id,
                balance: 0
            }

            return addDoc(collection(db, 'users'), userData);
           
        })
    .then(() => {
        alert("Đăng ký thành công!");
    })
    .catch((error) => {
        alert("Lỗi: "+ error.message);
    })

}

RegisterForm.addEventListener("submit", handleRegister);