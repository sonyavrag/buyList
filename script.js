document.addEventListener('DOMContentLoaded', () => {

    let products = JSON.parse(localStorage.getItem('products'));

    const productList = document.getElementById('product-list');
    const productInput = document.getElementById('product-input');
    const addButton = document.getElementById('add-button');
    const remainingProducts = document.getElementById('remaining-products');
    const boughtProducts = document.getElementById('bought-products');

    const saveProducts = () => {
        localStorage.setItem('products', JSON.stringify(products));
    };

    const updateStatistics = () => {
        remainingProducts.innerHTML = '';
        boughtProducts.innerHTML = '';
        products.forEach(product => {
            const summary = document.createElement('div');
            summary.classList.add('product-summary-box');
            summary.innerHTML = `<div class="product-summary">${product.bought ? `<s>${product.name}</s>` : product.name}<span class="quantity-summary">${product.quantity}</span></div>`;
            if (product.bought) {
                boughtProducts.appendChild(summary);
            } else {
                remainingProducts.appendChild(summary);
            }
        });
    };

    const renderProducts = () => {
        productList.innerHTML = '';

        products.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.dataset.index = index;

            const productName = `<span class="product-name" data-index="${index}">${product.bought ? `<s>${product.name}</s>` : product.name}</span>`;
            const quantityControls = product.bought ? `
                <div class="quantity-controls">
                    <button class="decrease" style="visibility: hidden;">-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="increase" style="visibility: hidden;">+</button>
                </div>` : `
                <div class="quantity-controls">
                    <button class="decrease" ${product.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="increase">+</button>
                </div>`;
            const buttonsBox = `
                <div class="buttons-box">
                    ${product.bought ? `<button class="status" data-tooltip="Зробити не купленим">Не куплено</button>` :
                    `<button class="remove" data-tooltip="Видалити товар" style="visibility: hidden">x</button>`
                }
                    ${!product.bought ?
                    `<button class="status" data-tooltip="Відмітити як куплений">Куплено   </button>` :
                    `<button class="remove" data-tooltip="Видалити товар">x</button>`
                }
                </div>`;
            productElement.innerHTML = `
                ${productName}
                ${quantityControls}
                ${buttonsBox}
            `;

            productList.appendChild(productElement);
        });
        updateStatistics();
    };

    const updateProductQuantity = (index) => {
        const productElement = document.querySelector(`.product[data-index="${index}"]`);
        const quantitySpan = productElement.querySelector('.quantity');
        quantitySpan.textContent = products[index].quantity;
        updateStatistics();
    };

    const addProduct = (name) => {
        if (name.trim() === '') return;
        products.push({ name, quantity: 1, bought: false });
        saveProducts();
        renderProducts();
        productInput.value = '';
        productInput.focus();
    };

    productInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addProduct(productInput.value);
        }
    });

    addButton.addEventListener('click', () => {
        addProduct(productInput.value);
    });

    productList.addEventListener('click', (e) => {
        const productElement = e.target.closest('.product');
        if (!productElement) return;
        const index = productElement.dataset.index;

        if (e.target.classList.contains('decrease')) {
            if (products[index].quantity > 1) {
                products[index].quantity -= 1;
                updateProductQuantity(index);
                saveProducts();
            }
        } else if (e.target.classList.contains('increase')) {
            products[index].quantity += 1;
            updateProductQuantity(index);
            saveProducts();
        } else if (e.target.classList.contains('remove')) {
            products.splice(index, 1);
            renderProducts();
            saveProducts();
        } else if (e.target.classList.contains('status')) {
            products[index].bought = !products[index].bought;
            renderProducts();
            saveProducts();
            return;
        } else if (e.target.classList.contains('product-name') && !products[index].bought) {
            editItemName(e.target, index);
        }
    });

    const editItemName = (nameSpan, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Введіть нову назву';
        input.className = 'edit-name-input';

        nameSpan.replaceWith(input);
        input.focus();

        const saveName = () => {
            const newName = input.value.trim();
            if (newName !== '') {
                products[index].name = newName;
                saveProducts();
                renderProducts();
            } else {
                input.focus();
            }
        };
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveName();
            }
        });
    };

    renderProducts();
});
