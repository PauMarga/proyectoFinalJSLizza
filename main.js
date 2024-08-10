// Simulador de Tienda en Línea

// Elementos del DOM
const listaDeProductos = document.getElementById('listaDeProductos');
const listaDelCarrito = document.getElementById('listaDelCarrito');
const totalSpan = document.getElementById('total');
const botonVaciarCarrito = document.getElementById('botonVaciarCarrito');
const botonFinalizarCompra = document.getElementById('finalizarCompra');

// Eventos
botonVaciarCarrito.addEventListener('click', vaciarCarrito);

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    const boton = event.target;
    const productoId = parseInt(boton.dataset.id);

    // Busca el contenedor del producto que contiene el botón clickeado
    const productoDiv = boton.closest('.tarjeta-producto');

    // Extrae la información del producto desde el DOM
    const producto = {
        id: productoId,
        nombre: productoDiv.querySelector('h3').textContent,
        precio: parseFloat(productoDiv.querySelector('p').textContent.replace('Precio: €', '')),
        imagen: productoDiv.querySelector('img').src,
        cantidad: 1
    };

    const itemDelCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
    };

    agregarElementoDelCarritoAlDOM(itemDelCarrito);
    guardarElementoDelCarrito(itemDelCarrito);
    actualizarTotal();
}

// Función para manejar acciones en la lista del carrito
function manejarAccionDelCarrito(event) {
    if (event.target.classList.contains('botonEliminar')) {
        const itemDelCarritoId = event.target.parentElement.dataset.id;
        eliminarElementoDelCarrito(itemDelCarritoId);
        event.target.parentElement.remove();
        actualizarTotal();
    }
}

// Función para agregar un elemento del carrito al DOM
function agregarElementoDelCarritoAlDOM(itemDelCarrito) {
    const li = document.createElement('li');
    li.dataset.id = itemDelCarrito.id;
    li.innerHTML = `
        ${itemDelCarrito.nombre} - €${itemDelCarrito.precio.toFixed(2)}
        <button class="botonEliminar">Eliminar</button>
    `;
    listaDelCarrito.appendChild(li);
    li.querySelector('.botonEliminar').addEventListener('click', manejarAccionDelCarrito);
}

// Función para guardar un elemento del carrito en el localStorage
function guardarElementoDelCarrito(itemDelCarrito) {
    let carrito = obtenerCarritoDelStorage();
    carrito.push(itemDelCarrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener el carrito del localStorage
function obtenerCarritoDelStorage() {
    return localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [];
}

// Función para eliminar un elemento del carrito del localStorage
function eliminarElementoDelCarrito(itemDelCarritoId) {
    let carrito = obtenerCarritoDelStorage();
    carrito = carrito.filter(item => item.id !== parseInt(itemDelCarritoId));
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar el total
function actualizarTotal() {
    const carrito = obtenerCarritoDelStorage();
    const total = carrito.reduce((acc, item) => acc + item.precio, 0);
    totalSpan.textContent = total.toFixed(2);
}

// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    listaDelCarrito.innerHTML = '';
    actualizarTotal();
}

// Inicialización: cargar elementos del carrito desde el localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar los productos en el DOM
    fetch('/productos.json')
    .then(response => response.json())
    .then(productos => {
        productos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('tarjeta-producto');
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>Precio: €${producto.precio}</p>
                <button class="botonAgregarAlCarrito" data-id="${producto.id}">Agregar al Carrito</button>`;
            listaDeProductos.appendChild(div);
        });

        // Añadir eventos a los botones de agregar al carrito después de que los productos hayan sido añadidos al DOM
        document.querySelectorAll('.botonAgregarAlCarrito').forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    });

    // Cargar el carrito desde el localStorage
    const carrito = obtenerCarritoDelStorage();
    carrito.forEach(agregarElementoDelCarritoAlDOM);
    actualizarTotal();
});

botonFinalizarCompra.addEventListener('click', () => {
    swal.fire ({
        title: "Tu compra se realizó satisfactoriamente",
        icon: "success",
        text: "Muchas gracias por confiar en nosotros!",
    });
})

