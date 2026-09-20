const API_URL =
    "https://script.google.com/macros/s/AKfycbwspp_TEjJCT1-C3dVVnEhc4EdyXcbwm9kYW113xbV3gg-6y1TQkOKVHHNZFyCSFZoE/exec";


const productsContainer =
    document.getElementById("productsContainer");

const categoryName =
    document.getElementById("categoryName");

const categoryDescription =
    document.getElementById("categoryDescription");


/* =========================
   GET CATEGORY ID
========================= */

const params =
    new URLSearchParams(window.location.search);
const categoryId =
    params.get("category");


/* =========================
   START
========================= */

loadProducts();


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        if (!categoryId) {

            showError(
                "Category not found."
            );

            return;
        }


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Unable to connect to Google Sheet."
            );
        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );
        }


        const categories =
            data.categories || [];

        const products =
            data.products || [];


        /* FIND CATEGORY */

        const category =
            categories.find(
                item =>
                    String(item.id) ===
                    String(categoryId)
            );


        if (category) {

            categoryName.textContent =
                category.name || "Products";

            categoryDescription.textContent =
                category.description ||
                "Available items";

        } else {

            categoryName.textContent =
                "Products";

            categoryDescription.textContent =
                "Available items";
        }


        /* FILTER PRODUCTS */

        const filteredProducts =
            products.filter(
                product =>
                    String(product.categoryId) ===
                    String(categoryId)
            );


        renderProducts(
            filteredProducts
        );


    } catch (error) {

        console.error(error);

        showError(
            "Unable to load products. Please try again later."
        );
    }
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(products) {

    if (!products.length) {

        productsContainer.innerHTML = `
            <div class="empty-box">

                <h3>
                    No products available
                </h3>

                <p>
                    Products will appear here
                    when they are added.
                </p>

            </div>
        `;

        return;
    }


    productsContainer.innerHTML =
        products
            .map(product => {

                const name =
                    escapeHTML(
                        product.name
                    );

                const description =
                    escapeHTML(
                        product.description
                    );

                const image =
                    escapeHTML(
                        product.image
                    );


                return `
                    <article
                        class="product-card"
                    >

                        <div
                            class="product-image"
                        >

                            ${
                                image
                                ? `
                                    <img
                                        src="${image}"
                                        alt="${name}"
                                        loading="lazy"
                                        onerror="this.style.display='none'"
                                    >
                                `
                                : ""
                            }

                        </div>


                        <div
                            class="product-info"
                        >

                            <h2
                                class="product-name"
                            >
                                ${name}
                            </h2>


                            ${
                                description
                                ? `
                                    <p
                                        class="product-description"
                                    >
                                        ${description}
                                    </p>
                                `
                                : ""
                            }

                        </div>

                    </article>
                `;

            })
            .join("");
}


/* =========================
   BACK BUTTON
========================= */

function goBack() {

    window.location.href =
        "index.html";
}


/* =========================
   ERROR
========================= */

function showError(message) {

    productsContainer.innerHTML = `
        <div class="error-box">

            <h3>
                Something went wrong
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
