document.addEventListener("DOMContentLoaded", () => {
    
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    
    
    // Fetch API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => displayProducts(data));

    // Display Products
    function displayProducts(products) {
        const productContainer = document.getElementById('productos-list');
        productContainer.className = 'product-container'; // Añadimos la clase product-container al contenedor

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'producto-card'; // Clase para cada tarjeta de producto
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <h3>${product.title}</h3>
                <p>${product.description.substring(0, 50)}...</p>
                <p><strong>$${product.price}</strong></p>
                <button data-id="${product.id}" class="add-to-cart">Agregar al carrito</button>
            `;
            productContainer.appendChild(productCard);
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        if (!nombre || !email || !mensaje) {
            e.preventDefault();
            console.error("Todos los campos deben ser completados.");
        }
    });

    // Cart Logic
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update Local Storage
    function updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Render Cart Items
    function renderCart() {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>Producto ID: ${item.id}</p>
                <p>Cantidad: 
                    <button class="decrease-qty" data-index="${index}">-</button>
                    ${item.quantity}
                    <button class="increase-qty" data-index="${index}">+</button>
                </p>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    renderCart();

    // Add to Cart Logic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            const existingProduct = cart.find(item => item.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }

            updateLocalStorage();
            renderCart();

            console.log(`Producto ${productId} agregado al carrito.`);
        }

        // Increase Quantity
        if (e.target.classList.contains('increase-qty')) {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity++;
            updateLocalStorage();
            renderCart();
        }

        // Decrease Quantity
        if (e.target.classList.contains('decrease-qty')) {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateLocalStorage();
                renderCart();
            }
        }

        // Remove Item
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateLocalStorage();
            renderCart();
        }
    });
});
