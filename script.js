/* =====================================================
   DEFAULT PRODUCTS
===================================================== */

const defaultProducts = [

    {
        id: 1,
        name: "Tomato",
        price: 40,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
        stock: true
    },

    {
        id: 2,
        name: "Potato",
        price: 35,
        category: "root",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
        stock: true
    },

    {
        id: 3,
        name: "Onion",
        price: 45,
        category: "root",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500",
        stock: true
    },

    {
        id: 4,
        name: "Carrot",
        price: 60,
        category: "root",
        image: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=500",
        stock: true
    },

    {
        id: 5,
        name: "Cabbage",
        price: 35,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500",
        stock: true
    },

    {
        id: 6,
        name: "Cauliflower",
        price: 55,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1568584711271-6c929fb49b53?w=500",
        stock: true
    },

    {
        id: 7,
        name: "Brinjal",
        price: 50,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0f04?w=500",
        stock: true
    },

    {
        id: 8,
        name: "Ladies Finger",
        price: 60,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1425543103986-22abb7d7ea1d?w=500",
        stock: true
    },

    {
        id: 9,
        name: "Spinach",
        price: 30,
        category: "leafy",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500",
        stock: true
    },

    {
        id: 10,
        name: "Green Chilli",
        price: 80,
        category: "vegetable",
        image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500",
        stock: true
    }

];


/* =====================================================
   LOAD PRODUCTS
===================================================== */

let products =
    JSON.parse(
        localStorage.getItem(
            "freshcart_products"
        )
    ) || defaultProducts;


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   PAYMENT
===================================================== */

let paymentMethod = "Cash";


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCurrentDate();

        displayProducts();

        updateCart();

        displayAdminProducts();

    }
);


/* =====================================================
   DATE
===================================================== */

function displayCurrentDate() {

    const now = new Date();

    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    };

    document.getElementById(
        "currentDate"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            options
        );

}


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts() {

    localStorage.setItem(
        "freshcart_products",
        JSON.stringify(products)
    );

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(
    category = "all",
    search = ""
) {

    const grid =
        document.getElementById(
            "productGrid"
        );


    grid.innerHTML = "";


    const filtered =
        products.filter(
            product => {

                const categoryMatch =
                    category === "all" ||
                    product.category === category;


                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(
                            search
                                .toLowerCase()
                        );


                return (
                    categoryMatch &&
                    searchMatch
                );

            }
        );


    if (filtered.length === 0) {

        grid.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🥬
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="
                        this.src='https://placehold.co/500x400?text=${encodeURIComponent(product.name)}'
                    "
                >


                <div class="product-details">

                    <div class="product-name">
                        ${escapeHTML(product.name)}
                    </div>


                    <div class="product-price">

                        ₹${Number(product.price).toFixed(2)}

                        <span>
                            / kg
                        </span>

                    </div>


                    <span
                        class="
                            stock-badge
                            ${
                                product.stock
                                    ? "stock-available"
                                    : "stock-out"
                            }
                        "
                    >

                        ${
                            product.stock
                                ? "● Available"
                                : "● Out of Stock"
                        }

                    </span>


                    <button
                        class="add-btn"
                        ${
                            !product.stock
                                ? "disabled"
                                : ""
                        }
                        onclick="
                            addToCart(${product.id})
                        "
                    >

                        ${
                            product.stock
                                ? "+ Add"
                                : "Out of Stock"
                        }

                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product || !product.stock) {

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity += 0.5;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: 0.5

        });

    }


    updateCart();

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    No items added
                </h3>

                <p>
                    Add vegetables from the product list
                </p>

            </div>

        `;

    }


    let total = 0;

    let totalItems = 0;


    cart.forEach(
        item => {

            const itemTotal =
                item.price *
                item.quantity;


            total += itemTotal;

            totalItems +=
                item.quantity;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cart-item";


            div.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="
                        this.src='https://placehold.co/100x100?text=Image'
                    "
                >


                <div class="cart-item-info">

                    <div class="cart-item-name">
                        ${escapeHTML(item.name)}
                    </div>


                    <div class="cart-item-price">

                        ₹${item.price.toFixed(2)}
                        / kg

                    </div>


                    <div class="cart-item-total">

                        ₹${itemTotal.toFixed(2)}

                    </div>

                </div>


                <div class="quantity-controls">

                    <button
                        class="qty-btn"
                        onclick="
                            changeQuantity(
                                ${item.id},
                                -0.5
                            )
                        "
                    >
                        −
                    </button>


                    <span class="qty-value">

                        ${formatWeight(item.quantity)}

                    </span>


                    <button
                        class="qty-btn"
                        onclick="
                            changeQuantity(
                                ${item.id},
                                0.5
                            )
                        "
                    >
                        +
                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );


    document.getElementById(
        "cartCount"
    ).textContent =
        `${cart.length} ${
            cart.length === 1
                ? "item"
                : "items"
        }`;


    document.getElementById(
        "totalItems"
    ).textContent =
        formatWeight(totalItems);


    document.getElementById(
        "subtotal"
    ).textContent =
        `₹${total.toFixed(2)}`;


    document.getElementById(
        "grandTotal"
    ).textContent =
        `₹${total.toFixed(2)}`;

}


/* =====================================================
   FORMAT WEIGHT
===================================================== */

function formatWeight(
    weight
) {

    if (weight < 1) {

        return `${Math.round(
            weight * 1000
        )} g`;

    }


    return `${weight.toFixed(2)} kg`;

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) {

        return;

    }


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    updateCart();

}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    if (cart.length === 0) {

        return;

    }


    const confirmClear =
        confirm(
            "Clear the current bill?"
        );


    if (!confirmClear) {

        return;

    }


    cart = [];


    updateCart();

}


/* =====================================================
   PAYMENT
===================================================== */

function selectPayment(
    button
) {

    document
        .querySelectorAll(
            ".payment-btn"
        )
        .forEach(
            btn =>
                btn.classList.remove(
                    "active"
                )
        );


    button.classList.add(
        "active"
    );


    paymentMethod =
        button.dataset.payment;

}


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function () {

            const search =
                this.value;


            const activeCategory =
                document
                    .querySelector(
                        ".category-btn.active"
                    )
                    .dataset.category;


            displayProducts(
                activeCategory,
                search
            );

        }
    );


/* =====================================================
   CATEGORY
===================================================== */

document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    const category =
                        this.dataset.category;


                    const search =
                        document
                            .getElementById(
                                "searchInput"
                            )
                            .value;


                    displayProducts(
                        category,
                        search
                    );

                }
            );

        }
    );


/* =====================================================
   ADMIN MODAL
===================================================== */

function openAdminModal() {

    displayAdminProducts();

    document
        .getElementById(
            "adminModal"
        )
        .classList.add(
            "show"
        );

}


function closeAdminModal() {

    document
        .getElementById(
            "adminModal"
        )
        .classList.remove(
            "show"
        );

}


/* =====================================================
   ADD PRODUCT
===================================================== */

document
    .getElementById(
        "productForm"
    )
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "productName"
                    )
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById(
                            "productPrice"
                        )
                        .value
                );


            const category =
                document
                    .getElementById(
                        "productCategory"
                    )
                    .value;


            const image =
                document
                    .getElementById(
                        "productImage"
                    )
                    .value
                    .trim();


            const stock =
                document
                    .getElementById(
                        "productStock"
                    )
                    .value === "true";


            if (
                !name ||
                !image ||
                price < 0
            ) {

                alert(
                    "Please enter valid product details."
                );

                return;

            }


            const newProduct = {

                id:
                    Date.now(),

                name,

                price,

                category,

                image,

                stock

            };


            products.push(
                newProduct
            );


            saveProducts();


            this.reset();


            displayProducts();


            displayAdminProducts();


            alert(
                `${name} added successfully!`
            );

        }
    );


/* =====================================================
   DISPLAY ADMIN PRODUCTS
===================================================== */

function displayAdminProducts() {

    const list =
        document.getElementById(
            "adminProductList"
        );


    const count =
        document.getElementById(
            "productCount"
        );


    list.innerHTML = "";


    count.textContent =
        `${products.length} ${
            products.length === 1
                ? "product"
                : "products"
        }`;


    products.forEach(
        product => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-product";


            div.innerHTML = `

                <img
                    class="admin-product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="
                        this.src='https://placehold.co/100x100?text=Image'
                    "
                >


                <div class="admin-product-info">

                    <strong>
                        ${escapeHTML(product.name)}
                    </strong>

                    <span>
                        ₹${Number(product.price).toFixed(2)}
                        / kg
                        •
                        ${
                            product.stock
                                ? "Available"
                                : "Out of Stock"
                        }
                    </span>

                </div>


                <div class="admin-actions">

                    <button
                        class="edit-btn"
                        onclick="
                            openEditModal(
                                ${product.id}
                            )
                        "
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="
                            deleteProduct(
                                ${product.id}
                            )
                        "
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


/* =====================================================
   EDIT MODAL
===================================================== */

function openEditModal(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    document.getElementById(
        "editProductId"
    ).value =
        product.id;


    document.getElementById(
        "editProductName"
    ).value =
        product.name;


    document.getElementById(
        "editProductPrice"
    ).value =
        product.price;


    document.getElementById(
        "editProductCategory"
    ).value =
        product.category;


    document.getElementById(
        "editProductImage"
    ).value =
        product.image;


    document.getElementById(
        "editProductStock"
    ).value =
        String(product.stock);


    document
        .getElementById(
            "editModal"
        )
        .classList.add(
            "show"
        );

}


function closeEditModal() {

    document
        .getElementById(
            "editModal"
        )
        .classList.remove(
            "show"
        );

}


/* =====================================================
   SAVE EDIT
===================================================== */

document
    .getElementById(
        "editProductForm"
    )
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                Number(
                    document
                        .getElementById(
                            "editProductId"
                        )
                        .value
                );


            const product =
                products.find(
                    item =>
                        item.id === id
                );


            if (!product) {

                return;

            }


            product.name =
                document
                    .getElementById(
                        "editProductName"
                    )
                    .value
                    .trim();


            product.price =
                Number(
                    document
                        .getElementById(
                            "editProductPrice"
                        )
                        .value
                );


            product.category =
                document
                    .getElementById(
                        "editProductCategory"
                    )
                    .value;


            product.image =
                document
                    .getElementById(
                        "editProductImage"
                    )
                    .value
                    .trim();


            product.stock =
                document
                    .getElementById(
                        "editProductStock"
                    )
                    .value === "true";


            saveProducts();


            displayProducts();


            displayAdminProducts();


            closeEditModal();


            alert(
                "Product updated successfully!"
            );

        }
    );


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    const confirmDelete =
        confirm(
            `Delete ${product.name}?`
        );


    if (!confirmDelete) {

        return;

    }


    products =
        products.filter(
            item =>
                item.id !== productId
        );


    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveProducts();


    displayProducts();


    displayAdminProducts();


    updateCart();

}


/* =====================================================
   PRINT BILL
===================================================== */

function printBill() {

    if (cart.length === 0) {

        alert(
            "Please add at least one product."
        );

        return;

    }


    const receiptItems =
        document.getElementById(
            "receiptItems"
        );


    receiptItems.innerHTML = "";


    let total = 0;


    cart.forEach(
        item => {

            const amount =
                item.price *
                item.quantity;


            total += amount;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "receipt-item";


            div.innerHTML = `

                <span>
                    ${escapeHTML(item.name)}
                    <br>
                    ${formatWeight(item.quantity)}
                    × ₹${item.price.toFixed(2)}
                </span>


                <strong>
                    ₹${amount.toFixed(2)}
                </strong>

            `;


            receiptItems.appendChild(
                div
            );

        }
    );


    const billNumber =
        generateBillNumber();


    const now =
        new Date();


    document.getElementById(
        "receiptBillNumber"
    ).textContent =
        billNumber;


    document.getElementById(
        "receiptDate"
    ).textContent =
        now.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "receiptTotal"
    ).textContent =
        `₹${total.toFixed(2)}`;


    document.getElementById(
        "receiptPayment"
    ).textContent =
        paymentMethod;


    window.print();


}


/* =====================================================
   BILL NUMBER
===================================================== */

function generateBillNumber() {

    let number =
        Number(
            localStorage.getItem(
                "freshcart_bill_number"
            )
        ) || 1000;


    number++;


    localStorage.setItem(
        "freshcart_bill_number",
        number
    );


    return `BILL-${number}`;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById(
        "adminModal"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                closeAdminModal();

            }

        }
    );


document
    .getElementById(
        "editModal"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                closeEditModal();

            }

        }
    );