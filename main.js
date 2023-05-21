const cartCounter = document.querySelector(".cart_counter");


const cartDom = document.querySelector(".cart_items");

const totalCount = document.querySelector("#total_counter");

const totalCost = document.querySelector(".total_cost");

const addCartBtn = document.querySelectorAll(".btn_add_toCart");
const checkOutBtn = document.querySelector(".check_out_btn");
// peyment 
let paymentMethod = document.querySelectorAll("input[type=radio][name=payment_method]")
// select payment 
let selectedPaymentMethod = document.querySelector("input[type=radio][name=payment_method]:checked");

let phone = document.querySelector("#phone");

let paymentType ='paypal';

paymentMethod.forEach(pay =>{
    pay.addEventListener("change",(e) =>{
        if(pay.value === "evc"){
            phone.classList.toggle("active");
            paymentType = "Evc"
        
        }else{
            phone.classList.toggle("active");
            paymentType = "paypal"
        }
    })
})

checkOutBtn.addEventListener("click",() =>{
    if(paymentType === "paypal"){
        checkOutpaypal();
    }else{
        checkOutEvc();
    }
})
let cartItems = [];


cartCounter.addEventListener("click" ,() => {
    cartDom.classList.toggle("active");
})
addCartBtn.forEach(btn =>{

    btn.addEventListener("click",() => {
        
        let parentElement = btn.parentElement;

        const product = {
            id : parentElement.querySelector("#product_id").value,
            name : parentElement.querySelector(".product_name").innerText,
            image : parentElement.querySelector("#image").getAttribute("src"),
            price : parentElement.querySelector(".product_price").innerText.replace("$",""),
            quantity :1
        }

        let InCart = cartItems.filter(item => item.id === product.id).length > 0;

        if(!InCart) {
            addItemDom(product);
        }
        else{
            alert("product already in the cart ");
            return;
            
        }
        const cartDomsItems = document.querySelectorAll(".cart_item");

        cartDomsItems.forEach( individualItem => {
            if(individualItem.querySelector("#productID").value === product.id) {
                // increase
                increaseItem(individualItem,product);
                // decrease item
                decreaseItem(individualItem,product);
                // remove
                removeItem(individualItem,product);
            }
        })
        cartItems.push(product);
        calculateTotal();
        
    });
   
    
})

function  addItemDom(product){
    // Adding the new item to the dom
    cartDom .insertAdjacentHTML("afterbegin",`
     <div class="cart_item">
              <input type="hidden" name="" id="productID" value="${product.id}"/>

              <img src="${product.image}" alt="" id="product_img" />

              <h4 class="product_name">${product.name}</h4>

              <a class="btn_small" action="decrease">&minus;</a>
              <h4 class="product_quantity">${product.quantity}</h4>

              <a  class="btn_small" action="increase">&plus;</a>
              <span class="product_price">${product.price}</span>
              <a  class="btn_small btn_remove" action="remove">&times;</a>

            </div>

            `)
}
function increaseItem (individualItem,product){
    individualItem.querySelector("[action='increase']").addEventListener("click", () => {

    cartItems.forEach( cartItem =>{
        if(cartItem.id === product.id){
            individualItem.querySelector(".product_quantity").innerText = ++cartItem.quantity;
            calculateTotal();
        }
    })
    })

}
function decreaseItem (individualItem,product){
    individualItem.querySelector("[action='decrease']").addEventListener("click", () => {

    cartItems.forEach( cartItem =>{
        if(cartItem.id === product.id){
            if(cartItem.quantity > 1){
                individualItem.querySelector(".product_quantity").innerText = --cartItem.quantity;
            }
            else{
                cartItems = cartItems.filter(newItems =>newItems.id !== product.id);
                individualItem.remove();
            }
            calculateTotal();
        }
    })
    })

}

function removeItem (individualItem,product){
    individualItem.querySelector("[action='remove']").addEventListener("click", () => {

    cartItems.forEach( cartItem =>{
        if(cartItem.id === product.id){
           
               
            
                cartItems = cartItems.filter(newItems =>newItems.id !== product.id);
                individualItem.remove();
            
            calculateTotal();
        }
    })
    })

}

function calculateTotal(){
    let total = 0

    cartItems.forEach( item =>{
        total += item.quantity * item.price;
    })
    totalCost.innerText = total;
    totalCount.innerText = cartItems.length;
}


function checkOutpaypal (){
    let checkOutForm = `<form  id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="upload" value="1">
    <input type="hidden" name="business" value="sellerengshakrayare114@gmail.com.com">
    `;

    cartItems.forEach((item,index) =>{
        index++;

        checkOutForm +=  `<input type="hidden" name="item_name_${index}" value="${item.name}">
        <input type="hidden" name="${index}" value="${item.price}">
        <input type="hidden" name="quantity${index}" value="${item.quantity}">

       

        `;

    });
    checkOutForm += ` <input type="submit" value="PayPal">
    </form>

    `;
    document.querySelector("body").insertAdjacentHTML("afterend",checkOutForm);

    document.querySelector("#paypal-form").submit();

}
