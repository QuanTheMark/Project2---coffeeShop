const checkSession = () =>{
    let userSession = JSON.parse(localStorage.getItem('userSession'));
    if(!userSession){
        window.location.href = "./login.html";
    }else{
        const now = new Date().getTime();
    }

    if(now > userSession){
        console.log("Phiên đăng nhập không hợp lệ!");
        localStorage.removeItem('userSession');
        window.location.href = "./login.html";
    }else{
        console.log('Phiên đăng nhập hợp lệ!');
    }

};

export {checkSession};