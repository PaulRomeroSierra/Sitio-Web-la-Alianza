// ============================================================
//  contacto.js  —  Formulario de contacto con Supabase
//  Cambios: guarda el mensaje en la tabla mensajes_contacto
//  antes de abrir WhatsApp
// ============================================================

import { menu }           from './module/menu.js';
import { supabaseClient } from './supabase.js';

const linkContact      = document.querySelector('.link__send--consult');
const formularioContact = document.querySelector('.form');

document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
});

function eventListeners() {
    formularioContact.addEventListener('submit', submitCancel);
    menu();
}

function submitCancel(e) {
    e.preventDefault();

    const inputName     = document.querySelector('.input--name');
    const inputEmail    = document.querySelector('.input--email');
    const inputTextArea = document.querySelector('.input--textarea');

    linkContact.addEventListener('click', async function () {
        const nombre  = inputName.value.trim();
        const email   = inputEmail.value.trim();
        const mensaje = inputTextArea.value.trim();

        // Guardar en Supabase
        await guardarMensajeContacto(nombre, email, mensaje);

        // Abrir WhatsApp igual que antes
        const messageWasap =
            `Nombre: ${nombre} \nCorreo: ${email} \nMensaje: ${mensaje} \n`;
        linkContact.target = 'blank';
        linkContact.href   = `https://api.whatsapp.com/send?phone=573105103893&text=${encodeURIComponent(messageWasap)}`;
    });
}

async function guardarMensajeContacto(nombre, email, mensaje) {
    try {
        const { error } = await supabaseClient
            .from('mensajes_contacto')
            .insert({ nombre, email, mensaje });

        if (error) throw error;

        console.log('✅ Mensaje de contacto guardado en Supabase');
    } catch (err) {
        console.error('❌ Error guardando mensaje de contacto:', err.message);
    }
}
