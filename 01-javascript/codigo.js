const menu = document.querySelector(".IconMenu2");
const productos= document.querySelector(".container__oureggs--items");
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

document.addEventListener('DOMContentLoaded',function(){
    evenlisteners();
});

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
    productsArray=[...productsArray,productObj];
    productsHtml();
}
function productsHtml(){
    productsArray.forEach(prod =>{
        //img
        const {img,title,price,quantity,id} = prod;
        const tr = document.createElement('tr')
        const tdImg= document.createElement('td');
        const prodImg= document.createElement('img');
        prodImg.src=img;
        prodImg.alt='img--product'
        tdImg.appendChild(prodImg)
        //title
        const tdTitle=document.createElement('td');
        const prodTitle=document.createElement('p');
        prodTitle.textContent=title;
        tdTitle.appendChild(prodTitle,tdTitle);
        //price
        const tdPrice=document.createElement('td');
        const prodPrice=document.createElement('p');
        prodPrice.textContent=`$${price.toFixed(3)}`;
        tdPrice.appendChild(prodPrice);
        //quantity
        const tdQuantity=document.createElement('td');
        const prodQuantity=document.createElement('input');
        prodQuantity.type='number';
        prodQuantity.min='1';
        prodQuantity.value=quantity;
        prodQuantity.dataset.id=id;
        tdQuantity.appendChild(prodQuantity)


        tr.append(tdImg,tdTitle,tdPrice,tdQuantity);

        console.log(tr)
    })
}