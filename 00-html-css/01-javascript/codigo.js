const menu = document.querySelector(".IconMenu2");
const productos= document.querySelector(".container__oureggs--items");
const car_body= document.querySelector(".cart--cuerpo");
const checkboxCartFlotante= document.querySelector(".container__cart--flotante");
const cart=document.querySelector(".cart");
const buttonCart= document.querySelector(".cart--button");
const link__wasap= document.querySelector(".link__wasap");



let productsArray=[];

let menu_close = `
<svg xmlns="http://www.w3.org/2000/svg" id="menu__open"  width="24" height="24" 
viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
stroke-linecap="round" stroke-linejoin="round" 
class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" />
</svg>`;

let menu_open = `
<svg xmlns="http://www.w3.org/2000/svg" id="menu__open" width="24" height="24" 
viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
stroke-linecap="round" stroke-linejoin="round" 
class="icon icon-tabler icons-tabler-outline icon-tabler-x">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M18 6L6 18" />
<path d="M6 6l12 12" />
</svg>`;

let abierto = false;
menu.addEventListener("click", (e) => {
    menu.innerHTML= abierto ? menu_close : menu_open; 
    abierto = !abierto;
});
//cart
document.addEventListener('DOMContentLoaded',function(){
    evenlisteners();
})


function evenlisteners(){
    productos.addEventListener('click',getDataElements);

    link__wasap.addEventListener('click',function(){
        let mensaje = [];
        if(productsArray.length===0){
            showAlert('No hay productos en el carrito','error');
            link__wasap.removeAttribute("href")
            link__wasap.removeAttribute("target")
        }else{
            productsArray.forEach(element =>{
            mensaje.push(`${element.title}🥚\n`)
            mensaje.push(`Precio: ${element.price}00💲\n`)
            mensaje.push(`Cantidad: ${element.quantity}🧺\n`)
        })
        link__wasap.target="blank";
        link__wasap.href=`https://api.whatsapp.com/send?phone=573105103893&text=${mensaje}`;
        }
    })

    const loadProduct= localStorage.getItem('products');
    if (loadProduct){
        productsArray=JSON.parse(loadProduct);
        productsHtml();
        updateCartCount();
    }else{
        productsArray=[];
    }
}

function updateCartCount(){
    const cartCount = document.querySelector("#cartCount");
    cartCount.textContent = productsArray.length;
}

function updateTotal(){
    const total = document.querySelector("#total");
    let totalProdu = productsArray.reduce((total,prod)=> total + prod.price * prod.quantity,0);
    total.textContent= `$${totalProdu.toFixed(3)}`;
}

function getDataElements(e){
   if(e.target.classList.contains('eggs__item--button')){
        const elementHtml =e.target.parentElement;
        selectData(elementHtml);
   }
}
function selectData(prod){
    const productObj = {
        img:prod.querySelector('img').src,
        title:prod.querySelector('.eggs__item--title').textContent,
        price:parseFloat(prod.querySelector('.ouregss--price').textContent.replace('$',''),1000),
        id:parseInt(prod.querySelector('.eggs__item--button').dataset.id,10),
        quantity: 1
    }

    const exists=productsArray.some(prod => prod.id === productObj.id);
    if (exists){
        showAlert('El producto ya existe en el cart','error');
        return;
    }


    productsArray=[...productsArray,productObj];
    showAlert("El producto fue agregado","success")
    productsHtml();
    updateCartCount();
    updateTotal();


}
function productsHtml(){
    cleanHtml();
    productsArray.forEach(prod =>{
        const {img,title,price,quantity,id} = prod;
        const tr = document.createElement('tr')
        tr.classList='cart--pago';
        //img
        const tdImg= document.createElement('td');
        tdImg.classList="cart--img";
        const prodImg= document.createElement('img');
        prodImg.src=img;
        prodImg.alt='img--product';
        tdImg.appendChild(prodImg);
        //title
        const tdTitle=document.createElement('td');
        tdTitle.classList="cart__pago--titulo"
        const prodTitle=document.createElement('p');
        prodTitle.textContent=title;
        tdTitle.appendChild(prodTitle,tdTitle);
        //price
        const tdPrice=document.createElement('td');
        tdPrice.classList="cart--precio";
        const prodPrice=document.createElement('p');
        prodPrice.textContent=`$${(price * quantity).toFixed(3)}`;
        tdPrice.appendChild(prodPrice);
        //quantity
        const tdQuantity=document.createElement('td');
        tdQuantity.classList="cart--inputs";
        const prodQuantity=document.createElement('input');
        prodQuantity.type='number';
        prodQuantity.inputMode='numeric';
        prodQuantity.min='1';
        prodQuantity.value=quantity;
        prodQuantity.dataset.id=id;
        prodQuantity.oninput=updateQuantity;
        tdQuantity.appendChild(prodQuantity)

        //Delete
        const prodDelete=document.createElement('button');
        prodDelete.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';
        prodDelete.onclick = () => destroyProduct(id)
        tdQuantity.appendChild(prodDelete);
        tr.append(tdImg,tdTitle,tdPrice,tdQuantity);
        car_body.append(tr);

    })
    saveLocalStorage();
}


function saveLocalStorage(){
    localStorage.setItem('products', JSON.stringify(productsArray))
}

function updateQuantity(e){
    const newQuantity=parseInt(e.target.value,10);
    const idProd = parseInt(e.target.dataset.id,10);

    const product = productsArray.find(prod => prod.id === idProd);
    if (product && newQuantity > 0){
        product.quantity= newQuantity
    }
    productsHtml();
    updateTotal();
    saveLocalStorage();
}

function destroyProduct(idProd){
    productsArray = productsArray.filter(prod => prod.id !== idProd);
    showAlert("El producto fue eliminado existosamente","success")
    productsHtml();
    updateCartCount();
    updateTotal();
    saveLocalStorage();
}

function cleanHtml(){
    car_body.innerHTML='';
}



function showAlert(message,type){
    const norepeatAlert= document.querySelector('.alert')
    if (norepeatAlert) norepeatAlert.remove();
    const div= document.createElement('div');
    div.classList.add('alert',type);
    div.textContent=message;

    document.body.appendChild(div);

    setTimeout(()=> div.remove(),2000);
}