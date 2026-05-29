import { db } from './firebase-config.js';
import { checkSession } from './check_session.js';
import { collection , query , orderBy , getDocs ,limit, doc, getDoc, addDoc, updateDoc, where} from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js';

 const getProductList = async (limitCount, container) =>{
    let htmls = "";
    try {
        const q  = query(collection(db , 'products'),  orderBy("CreatedAt", "asc"), limit(limitCount));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach(docs => {
            // console.log(docs.id , docs.data());
            const product = docs.data();
            const productId = docs.id;

            const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);
            htmls += ` 
            <div class="product-item col-md-3 col-6">
              <div class = "content p-2">
                  <img src="${product.imgURLS}" alt="${product.name}" class="img-fluid rounded">
                <div class="text p-2">
                  <div class ="justify-content-between align-items-center d-flex flex-column">
                    <h5 class="mb-2 text-uppercase">${product.name}</h5>
                    <p>Giá : <span class="fs-6 fw-semibold text-danger">${formattedPrice} VNĐ</span> </p>
                  </div>
                  <button type="button" class="btn-order mt-2 w-100 btn btn-primary" data-id ="${productId}">Đặt hàng</button>
                </div>
              </div>
            </div>
        `

        });

      container.innerHTML = htmls;

        //thêm sự kiện đặt hàng
        let btnOrder = document.querySelectorAll('.btn-order');
        btnOrder.forEach(btn => {
          btn.addEventListener('click', function(){

                // lấy giá trị data id
                const productId = this.getAttribute('data-id');
                //kiểm tra phiên bản
                checkSession();

                // hiển thị bảng order
                showOrderForm(productId);
          })
        });
    }catch(error){
        console.log("Lỗi khi lấy sản phẩm", error);
    }
    
}


// hiển thị đơn đặt hàng

const showOrderForm = async (productId) =>{
    let orderForm = document.querySelector('.order-form');
    orderForm.style.display = 'block';

    try {
      const docRef = doc(db , 'products', productId);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        const product = docSnap.data();
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);
        
        orderForm.innerHTML = `
      
          <div class="content p-3 bg-light rounded shadow">
            <button type="button" class="btn btn-outline-dark
            btn-cancel mb-3">Đóng</button>
            <div class="row">
              <div class="col-md-4 col-12">
                <img src="${product.imgURLS}" alt="${product.name}"
                class="img-fluid rounded">
              </div>
              <div class="col-md-8 col-12">
                <h5>${product.name}</h5>
                <p>Giá: <span class="text-danger"><strong>${formattedPrice} VNĐ</strong></span></p>
                <form id="order-form">
                  <div class="mb-3">
                    <label for="quantity" class="form-label">Số lượng</label>
                    <input type="number" class="form-control"
                    id="quantity" value="1" min="1" required>
                  </div>
                  <button type="submit"
                  class="btn btn-primary btn-confirm-order 
                   w-100" data-price="${product.price}">Xác nhận</button>
                </form>
             
              </div>
            </div>
         
          </div>

        `
        // sự kiện đóng order-form
          const btnClose = orderForm.querySelector('.btn-cancel');
          btnClose.addEventListener('click', (event) =>{
              event.preventDefault();
              orderForm.innerHTML =``;
              orderForm.style.display = 'none';
          });

          //sự kiện đặt hàng

          const btnConfirm = orderForm.querySelector('.btn-confirm-order');
          btnConfirm.addEventListener('click', (event)=>{
            event.preventDefault();
            const quantity = document.getElementById("quantity").value;
            const productPrice = event.currentTarget.getAttribute('data-price');
            handleOrder(productId,quantity,productPrice);

          });

      }else{
        console.log("No such document found!");
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin sản phẩm: ", error);
    }
}

const userSession = JSON.parse(localStorage.getItem('userSession'));
// xử lý đơn hàng
const handleOrder = async(productId, quantity, productPrice)=>{
  if(!userSession){
    alert('Vui lòng đặt nhập để đặt hàng');
    return;
  }

  let authorEmail = userSession.user.email;

  try {
    const q = query(collection(db , 'users'), where('Email', '==', authorEmail));
    const querySnapShot = await getDocs(q);

    if(querySnapShot.empty){
      console.log("không tìm thấy!");
      return;
    }
  
    for(const userDoc of querySnapShot.docs){
      let author = userDoc.data();
      const totalCost = productPrice * quantity;
    

    if(author.balance < totalCost){
      alert("Số dư không đủ!");
      return;
    }

    const productDoc = await getDoc(doc(db, 'products', productId));
    const orderData ={
      author    :   authorEmail,
      product   :   productDoc.data(),
      quantity  :   parseInt(quantity),
      status    :   0,
      CreatedAt :   new Date()
    };

    await addDoc(collection(db, 'orders'), orderData );
    await updateDoc(userDoc.ref,{
        balance : author.balance - totalCost
    });
    
    alert("Đặt hàng thành công!");
    document.querySelector('.order-form').style.display = 'none';
    }
  } catch (error) {
    console.log("Lỗi khi đặt hàng :", error);
  }
}






export { getProductList }

