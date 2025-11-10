const menu = document.querySelector(".IconMenu2");
const productos= document.querySelector(".container__oureggs--items");
const car_body= document.querySelector(".carrito--cuerpo");
const checkboxCartFlotante= document.querySelector(".container__carrito--flotante");
const carrito=document.querySelector(".carrito");


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
//Carrito
document.addEventListener('DOMContentLoaded',function(){
    evenlisteners();
})

function evenlisteners(){
    productos.addEventListener('click',getDataElements);
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
        showAlert('The product already exists in the cart','error');
        return;
    }

    productsArray=[...productsArray,productObj];
    showAlert("The product was added succefuly","success")
    productsHtml();
}
function productsHtml(){
    cleanHtml();
    productsArray.forEach(prod =>{
        const {img,title,price,quantity,id} = prod;
        const tr = document.createElement('tr')
        tr.classList='carrito--pago';
        //img
        const tdImg= document.createElement('td');
        tdImg.classList="carrito--img";
        const prodImg= document.createElement('img');
        prodImg.src=img;
        prodImg.alt='img--product';
        tdImg.appendChild(prodImg);
        //title
        const tdTitle=document.createElement('td');
        tdTitle.classList="carrito__pago--titulo"
        const prodTitle=document.createElement('p');
        prodTitle.textContent=title;
        tdTitle.appendChild(prodTitle,tdTitle);
        //price
        const tdPrice=document.createElement('td');
        tdPrice.classList="carrito--precio";
        const prodPrice=document.createElement('p');
        prodPrice.textContent=`$${price.toFixed(3)}`;
        tdPrice.appendChild(prodPrice);
        //quantity
        const tdQuantity=document.createElement('td');
        tdQuantity.classList="carrito--inputs";
        const prodQuantity=document.createElement('input');
        prodQuantity.type='number';
        prodQuantity.min='1';
        prodQuantity.value=quantity;
        prodQuantity.dataset.id=id;
        tdQuantity.appendChild(prodQuantity)

        //Delete
        const prodDelete=document.createElement('button');
        prodDelete.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';
        tdQuantity.appendChild(prodDelete);
        tr.append(tdImg,tdTitle,tdPrice,tdQuantity);

        car_body.appendChild(tr);
        // console.log(tr)
    })
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

    setTimeout(()=> div.remove(),5000);
}