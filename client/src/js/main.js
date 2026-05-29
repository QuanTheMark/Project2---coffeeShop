import { auth } from "./firebase-config.js";
import {signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const userSession = JSON.parse(localStorage.getItem('userSession'));

//xử lí profile

document.addEventListener('DOMContentLoaded', ()=>{
    const profileDropDown = document.querySelector('#author-menu-drd');

    if(userSession){
        const now = new Date().getTime();
        if(now < userSession.expiry ){
            profileDropDown.innerHTML = ` 
            <li class = "bg-grey-light"><span class ="dropdown-item">${userSession.user.email}</span></li>
            <li><a href = "#" class = "dropdown-item">Lịch sử đơn hàng</a></li>
            <li><a href = "#" class = "dropdown-item">Số dư</a></li>
            <li><button type ="button" class ="dropdown-item btn text-danger 
            w-100 flex-start" id="log-out" >Đăng xuất</button></li>
            `;

        //xử lý đăng xuất

        document.querySelector("#log-out").addEventListener("click", ()=>{
            if(confirm("Bạn có chắc chắn muốn đăng xuất không?")){
                signOut(auth)
                .then(()=>{
                    localStorage.removeItem('userSession');
                    window.location.href = './index.html';
                })
                .catch((error)=> {
                    console.log("Lỗi đăng xuất :", error);
                    alert("Có lỗi xảy ra khi đăng xuất!");
                })
                    
                
            }

        });
   
    }else{

         //kiểm tra phiên đăng nhập
         localStorage.removeItem(userSession);
         console.log("Phiên đăng nhập đã hết hạn");
    }
    
}else{
        profileDropDown.innerHTML = `
            <li><a class="dropdown-item" href="./login.html">Đăng nhập</a></li>
            <li><a class="dropdown-item" href="./register.html">Đăng ký</a></li>
        `
    }
});