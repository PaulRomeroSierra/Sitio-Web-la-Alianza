// ============================================================
//  carrito.js  —  Lógica del carrito con integración Supabase
//  Cambios respecto al original:
//    • Carga productos desde Supabase en lugar del HTML estático
//    • Guarda el pedido en Supabase al hacer clic en WhatsApp
//    • El resto de la lógica (cantidad, eliminar, alertas) es idéntica
// ============================================================

import { menu }           from './module/menu.js';
import { supabaseClient } from './supabase.js';

// ── Selectores ──────────────────────────────────────────────
const productos    = document.querySelector('.container__oureggs--items');
const car_body     = document.querySelector('.cart--cuerpo');
const link__wasap  = document.querySelector('.link__wasap');

let productsArray = [];

// ── Arranque ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    evenlisteners();
    cargarProductosDesdeSupabase();   // 👈 nuevo: trae productos de la BD
});


// ── Event listeners ──────────────────────────────────────────
function evenlisteners() {
    if (productos) {
        productos.addEventListener('click', getDataElements);
    }

    if (link__wasap) {
        link__wasap.addEventListener('click', async function (e) {
            if (productsArray.length === 0) {
                showAlert('No hay productos en el carrito', 'error');
                link__wasap.removeAttribute('href');
                link__wasap.removeAttribute('target');
                return;
            }

            // 1. Guardar pedido en Supabase antes de abrir WhatsApp
            const pedidoId = await guardarPedidoEnSupabase();

            // 2. Construir mensaje de WhatsApp
            let mensaje = [];
            if (pedidoId) mensaje.push(`🧾 Pedido #${pedidoId}\\n`);
            productsArray.forEach(element => {
                mensaje.push(`${element.title}🥚\\n`);
                mensaje.push(`Precio: $${element.price.toLocaleString()}💲\\n`);
                mensaje.push(`Cantidad: ${element.quantity}🧺\\n`);
            });

            link__wasap.target = 'blank';
            link__wasap.href   = `https://api.whatsapp.com/send?phone=573105103893&text=${encodeURIComponent(mensaje.join(''))}`;
        });
    }

    // Cargar carrito guardado en localStorage
    const loadProduct = localStorage.getItem('products');
    if (loadProduct) {
        productsArray = JSON.parse(loadProduct);
        productsHtml();
        updateCartCount();
    } else {
        productsArray = [];
    }

    menu();

    if (productsArray.length === 0) carritoVacioUI();
}


// ── NUEVO: Cargar productos desde Supabase ────────────────────
async function cargarProductosDesdeSupabase() {
    if (!productos) return;   // solo en la página de productos

    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('id, nombre, precio, imagen_url, categorias(nombre)')
            .eq('activo', true)
            .order('id');

        if (error) throw error;

        // Limpiar el contenedor y renderizar las tarjetas
        productos.innerHTML = '';
        data.forEach(prod => {
            const div = document.createElement('div');
            div.classList.add('eggs__item');
            div.innerHTML = `
                <img src="../${prod.imagen_url}" alt="${prod.nombre}">
                <h3 class="eggs__item--title">${prod.nombre}</h3>
                <span class="ouregss--price">$${prod.precio.toLocaleString('es-CO')}</span>
                <button class="eggs__item--button" data-id="${prod.id}">Añadir al cart</button>
            `;
            productos.appendChild(div);
        });

    } catch (err) {
        console.error('Error cargando productos desde Supabase:', err.message);
        // Si falla Supabase, los productos del HTML estático siguen funcionando
    }
}


// ── NUEVO: Guardar pedido en Supabase ─────────────────────────
async function guardarPedidoEnSupabase() {
    try {
        // Construir el array de items que espera el procedimiento almacenado
        const items = productsArray.map(p => ({
            producto_id: p.id,
            cantidad:    p.quantity
        }));

        // Llamar al procedimiento almacenado registrar_pedido()
        const { data, error } = await supabaseClient
            .rpc('registrar_pedido', {
                p_cliente_id: null,          // sin login aún; null = cliente anónimo
                p_items:      items,
                p_nota:       'Pedido vía WhatsApp'
            });

        if (error) throw error;

        console.log('✅ Pedido guardado en Supabase con ID:', data);
        showAlert(`Pedido registrado con éxito`, 'success');
        return data;   // devuelve el id del pedido

    } catch (err) {
        console.error('❌ Error guardando pedido:', err.message);
        showAlert('No se pudo registrar el pedido en la base de datos', 'error');
        return null;
    }
}


// ── Obtener datos del elemento clickeado ─────────────────────
function getDataElements(e) {
    if (e.target.classList.contains('eggs__item--button')) {
        const elementHtml = e.target.parentElement;
        selectData(elementHtml);
    }
}

function selectData(prod) {
    const productObj = {
        img:      prod.querySelector('img').src,
        title:    prod.querySelector('.eggs__item--title').textContent,
        price:    parseFloat(
                    prod.querySelector('.ouregss--price')
                        .textContent.replace('$', '').replace(/\./g, '').replace(',', '.')
                  ),
        id:       parseInt(prod.querySelector('.eggs__item--button').dataset.id, 10),
        quantity: 1
    };

    const exists = productsArray.some(p => p.id === productObj.id);
    if (exists) {
        showAlert('El producto ya existe en el cart', 'error');
        return;
    }

    productsArray = [...productsArray, productObj];
    showAlert('El producto fue agregado', 'success');
    productsHtml();
    updateCartCount();
    updateTotal();
}


// ── Renderizar carrito ────────────────────────────────────────
function productsHtml() {
    cleanHtml();

    // Ocultar mensaje de carrito vacío si hay productos
    const empty__car = document.querySelector('.empty__cart');
    if (empty__car) empty__car.style.display = 'none';

    productsArray.forEach(prod => {
        const { img, title, price, quantity, id } = prod;
        const tr = document.createElement('tr');
        tr.classList = 'cart--pago';

        // Imagen
        const tdImg = document.createElement('td');
        tdImg.classList = 'cart--img';
        const prodImg = document.createElement('img');
        prodImg.src = img;
        prodImg.alt = 'img--product';
        tdImg.appendChild(prodImg);

        // Título
        const tdTitle = document.createElement('td');
        tdTitle.classList = 'cart__pago--titulo';
        const prodTitle = document.createElement('p');
        prodTitle.textContent = title;
        tdTitle.appendChild(prodTitle);

        // Precio
        const tdPrice = document.createElement('td');
        tdPrice.classList = 'cart--precio';
        const prodPrice = document.createElement('p');
        prodPrice.textContent = `$${(price * quantity).toLocaleString('es-CO')}`;
        tdPrice.appendChild(prodPrice);

        // Cantidad + controles
        const tdQuantity = document.createElement('td');
        tdQuantity.classList = 'cart--inputs';

        const prodQuantity = document.createElement('input');
        prodQuantity.type      = 'number';
        prodQuantity.inputMode = 'numeric';
        prodQuantity.min       = '1';
        prodQuantity.value     = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput   = updateQuantity;

        const increaseQuantity = document.createElement('span');
        increaseQuantity.classList.add('increaseQuantity');
        increaseQuantity.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>';
        increaseQuantity.onclick = () => increase(prodQuantity);

        const decreaseQuantity = document.createElement('span');
        decreaseQuantity.classList.add('drecreaseQuantity');
        decreaseQuantity.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /></svg>';
        decreaseQuantity.onclick = () => decrease(prodQuantity);

        const prodDelete = document.createElement('button');
        prodDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';
        prodDelete.classList.add('delete--button');
        prodDelete.onclick = () => destroyProduct(id);

        tdQuantity.append(increaseQuantity, decreaseQuantity, prodQuantity, prodDelete);
        tr.append(tdImg, tdTitle, tdPrice, tdQuantity);
        car_body.append(tr);
    });

    saveLocalStorage();
}


// ── Helpers ───────────────────────────────────────────────────
function updateCartCount() {
    const cartCount = document.querySelector('#cartCount');
    if (cartCount) cartCount.textContent = productsArray.length;
}

function updateTotal() {
    const total = document.querySelector('#total');
    if (!total) return;
    const totalProdu = productsArray.reduce((t, p) => t + p.price * p.quantity, 0);
    total.textContent = `$${totalProdu.toLocaleString('es-CO')}`;
    if (productsArray.length === 0) carritoVacioUI();
}

function carritoVacioUI() {
    const empty__car = document.querySelector('.empty__cart');
    if (empty__car) empty__car.style.display = 'flex';
}

function saveLocalStorage() {
    localStorage.setItem('products', JSON.stringify(productsArray));
}

function cleanHtml() {
    if (car_body) car_body.innerHTML = '';
}

function updateQuantity(e) {
    const newQuantity = parseInt(e.target.value, 10);
    const idProd      = parseInt(e.target.dataset.id, 10);
    const product     = productsArray.find(p => p.id === idProd);
    if (product && newQuantity > 0) product.quantity = newQuantity;
    productsHtml();
    updateTotal();
    saveLocalStorage();
}

function destroyProduct(idProd) {
    productsArray = productsArray.filter(p => p.id !== idProd);
    showAlert('El producto fue eliminado exitosamente', 'success');
    productsHtml();
    updateCartCount();
    updateTotal();
    saveLocalStorage();
}

function showAlert(message, type) {
    const norepeatAlert = document.querySelector('.alert');
    if (norepeatAlert) norepeatAlert.remove();
    const div = document.createElement('div');
    div.classList.add('alert', type);
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

function increase(ProduQuantity) {
    ProduQuantity.value = parseInt(ProduQuantity.value) + 1;
    const idProd  = parseInt(ProduQuantity.dataset.id, 10);
    const product = productsArray.find(p => p.id === idProd);
    if (product) product.quantity = parseInt(ProduQuantity.value);
    productsHtml();
    updateTotal();
    saveLocalStorage();
}

function decrease(ProduQuantity) {
    const idProd  = parseInt(ProduQuantity.dataset.id, 10);
    const product = productsArray.find(p => p.id === idProd);
    if (product && ProduQuantity.value > 1) {
        ProduQuantity.value = parseInt(ProduQuantity.value) - 1;
        product.quantity    = parseInt(ProduQuantity.value);
    }
    productsHtml();
    updateTotal();
    saveLocalStorage();
}
