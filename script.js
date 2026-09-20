const API_URL =
  "https://script.google.com/macros/s/AKfycbwspp_TEjJCT1-C3dVVnEhc4EdyXcbwm9kYW113xbV3gg-6y1TQkOKVHHNZFyCSFZoE/exec";


const categoriesContainer = document.getElementById("categories");
const bannerSection = document.getElementById("bannerSection");
const bannerImage = document.getElementById("bannerImage");
const heroImage = document.getElementById("heroImage");
const shopLogo = document.getElementById("shopLogo");


async function loadWebsiteData() {

  try {

    if (!API_URL) {
      showConnectionMessage("Google Sheet connection is not configured yet.");
      return;
    }

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to connect to Google Sheet.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Something went wrong.");
    }

    renderCategories(data.categories || []);
    renderBanner(data.banners || []);

  } catch (error) {

    console.error(error);

    categoriesContainer.innerHTML = `
      <div class="error-box">
        <h3>Unable to load data</h3>
        <p>Please try again later.</p>
      </div>
    `;

    bannerSection.style.display = "none";
  }
}


/* =========================
   CATEGORIES
========================= */

function renderCategories(categories) {

  if (!categories.length) {

    categoriesContainer.innerHTML = `
      <div class="error-box">
        <h3>No categories available</h3>
        <p>Categories will appear here when they are added.</p>
      </div>
    `;

    return;
  }


  categoriesContainer.innerHTML = categories
    .map(category => {

      const id = escapeHTML(category.id);
      const name = escapeHTML(category.name);
      const description = escapeHTML(category.description);
      const image = escapeHTML(category.image);

      return `
        <article
          class="category-card"
          onclick="openCategory('${encodeURIComponent(category.id)}')"
        >

          <div class="category-image">

            ${
              image
                ? `<img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                  >`
                : ""
            }

            <div class="category-overlay"></div>

            <div class="category-content">

              <h3>${name}</h3>

              ${
                description
                  ? `<p>${description}</p>`
                  : ""
              }

            </div>

          </div>

        </article>
      `;

    })
    .join("");
}


/* =========================
   OPEN CATEGORY
========================= */

function openCategory(categoryId) {

  window.location.href =
    `products.html?category=${categoryId}`;
}


/* =========================
   BANNER
========================= */

function renderBanner(banners) {

  if (!banners.length) {

    bannerSection.style.display = "none";

    return;
  }


  const banner = banners[0];


  if (!banner.image) {

    bannerSection.style.display = "none";

    return;
  }


  bannerImage.src = banner.image;

  bannerImage.alt = "Shree Balaji Sweets";

  bannerSection.style.display = "block";
}


/* =========================
   IMAGE LOADING
========================= */

function loadImage(element, url) {

  if (!element || !url) {
    return;
  }

  element.src = url;

  element.onerror = function () {
    element.style.display = "none";
  };
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


/* =========================
   CONNECTION MESSAGE
========================= */

function showConnectionMessage(message) {

  categoriesContainer.innerHTML = `
    <div class="error-box">
      <h3>Connection</h3>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}


/* =========================
   START
========================= */

loadWebsiteData();
