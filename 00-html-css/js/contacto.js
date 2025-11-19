import { menu } from "./module/menu.js";

const linkContact=document.querySelector(".link__send--consult");
const fomularioContact=document.querySelector(".form");

document.addEventListener('DOMContentLoaded',function(){
    eventListeners()
})

function eventListeners(){
    fomularioContact.addEventListener('submit',submitCancel)
    menu()
}

function submitCancel(e){
    e.preventDefault()
    let messageWasap="";
    let inputName= document.querySelector(".input--name");
    let inputEmail=document.querySelector(".input--email");
    let inputTextArea=document.querySelector(".input--textarea");

    linkContact.addEventListener('click',function(){
        messageWasap+=`Nombre: ${inputName.value} \n`
        messageWasap+=`Correo: ${inputEmail.value} \n`
        messageWasap+=`Mensaje: ${inputTextArea.value} \n`
        linkContact.target="blank"
        linkContact.href=`https://api.whatsapp.com/send?phone=573105103893&text=${messageWasap}`
    })
}