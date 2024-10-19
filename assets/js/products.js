const productListing = document.getElementById("product-listing");
const loadMoreBtn = document.getElementById("load-more-btn");
const errorMessage = document.getElementById("error-message");
let products = [];
let productsPerPage = 10;
let currentIndex = 0;
let allCategories = [];
let filteredProducts = [];

// Show error
function showError() {
  removeShimmerEffect();
  if (errorMessage) {
    errorMessage.style.display = "block";
  }
  if (loadMoreBtn) {
    loadMoreBtn.style.display = "none";
  }
}

// Display shimmer
function showShimmerEffect(count) {
  if (productListing) {
    for (let i = 0; i < count; i++) {
      const shimmerCard = document.createElement("div");
      shimmerCard.classList.add("shimmer-card");
      shimmerCard.innerHTML = `
                <div class="shimmer-img shimmer"></div>
                <div class="shimmer-text shimmer"></div>
                <div class="shimmer-price shimmer"></div>
            `;
      productListing.appendChild(shimmerCard);
    }
  }
}

// products
async function fetchProducts() {
  try {
    // Show shimmer
    showShimmerEffect(productsPerPage);

    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    products = await response.json();
    filteredProducts = products;
    removeShimmerEffect(); // Remove shimmer
    renderProducts();
    updateResultCount(); // Update result count on page load

    allCategories = [...new Set(products.map((product) => product.category))];

    // Render category
    renderCategoryCheckboxes(allCategories);
  } catch (error) {
    console.error("Error fetching products:", error);
    showError(); // Show error
  }
}

// render category
function renderCategoryCheckboxes(categories) {
  const categoriesContainers = document.querySelectorAll(
    ".categories-checkbox"
  ); 

  categoriesContainers.forEach((categoriesContainer) => {
    categoriesContainer.innerHTML = "";

    categories.forEach((category) => {
      const checkbox = document.createElement("span");
      checkbox.innerHTML = `
                <input type="checkbox" name="categories-filter" value="${category}">
                <label>${category}</label>
            `;
      categoriesContainer.appendChild(checkbox);
    });

    // filtering
    const checkboxes = categoriesContainer.querySelectorAll(
      'input[name="categories-filter"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        currentIndex = 0;
        filterProductsByCategory();
      });
    });
  });
}

// Filter categories
function filterProductsByCategory() {
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="categories-filter"]:checked')
  ).map((checkbox) => checkbox.value);

  // Show shimmer
  productListing.innerHTML = "";
  showShimmerEffect(productsPerPage);

  setTimeout(() => {
    if (selectedCategories.length === 0) {
      filteredProducts = products; // no category selected
    } else {
      filteredProducts = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    currentIndex = 0; 
    removeShimmerEffect(); 
    renderProducts(); 
    updateResultCount(); 
  }, 1000); 
}

// Sorting 
const sortFilter = document.querySelector(".product-sort-filter select");
if (sortFilter) {
  sortFilter.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    sortProducts(selectedValue);
  });
}

// sort products
function sortProducts(criteria) {
  if (criteria === "price-low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (criteria === "price-high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  currentIndex = 0;
  renderProducts();
}

// Updated renderProducts
function renderProducts() {
  productListing.innerHTML = "";

  const totalProducts = filteredProducts.length;
  const slicedProducts = filteredProducts.slice(
    0,
    currentIndex + productsPerPage
  );

  // No matching products
  if (totalProducts === 0) {
    const noProductsMessage = document.createElement("div");
    noProductsMessage.classList.add("no-products-message");
    noProductsMessage.innerHTML = `
            <p>No products found. Please try a different search keywords.</p>
        `;
    productListing.appendChild(noProductsMessage);

    // Hide load more button on no products 
    if (loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
  }

  slicedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-listing-card");

    productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img class="product-card-img" src="${product.image}" alt="${product.title}">
                <div class="card-details mt-11">
                    <h2 class="product-card-name">${product.title}</h2>
                    <p class="product-card-price">$${product.price}</p>
            </a>
                    <svg height="20px" width="24px" class="heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                </div>
        `;

    // heart icon
    const heartIcon = productCard.querySelector(".heart");
    heartIcon.addEventListener("click", (event) => {
      event.preventDefault(); 
      heartIcon.classList.toggle("filled");
    });

    productListing.appendChild(productCard);
  });

  currentIndex += productsPerPage;

  // load more btn
  if (currentIndex < totalProducts) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }

  updateResultCount();
}

function updateResultCount() {
  const resultCountElements = document.querySelectorAll(".result-count");
  resultCountElements.forEach((element) => {
    element.textContent = filteredProducts.length;
  });
}

// Load more products
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    renderProducts();
  });
}

// Remove shimmer effect
function removeShimmerEffect() {
  const shimmerCards = document.querySelectorAll(".shimmer-card");
  shimmerCards.forEach((shimmerCard) => shimmerCard.remove());
}

// product and product details diff
if (productListing) {
  fetchProducts();
} else {
  fetchProductDetails();
}

// Product details
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function fetchProductDetails() {
  const productId = getUrlParameter("id");
  if (!productId) {
    return;
  }

  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

//product details in HTML
function displayProductDetails(product) {
  document.querySelector(".product-name").textContent = product.title;
  document.querySelector(".product-price").textContent = `$${product.price}`;
  document.querySelector(".product-disc").textContent = product.description;
  document.querySelector(
    ".rating-number"
  ).textContent = `(${product.rating.count})`;

  document.querySelector(
    ".product-details-bottom-wrapper .product-name"
  ).textContent = product.title;
  document.querySelector(
    ".product-details-bottom-wrapper .product-disc"
  ).textContent = product.description;

  // Update breadcrumb
  const breadcrumbs = document.querySelector(".breadcrubs a.active");
  if (breadcrumbs) {
    breadcrumbs.textContent = product.category;
  }

  // product images
  const productImageLarge = document.querySelector(".product-image-large img");
  const productImagethumbnails = document.querySelectorAll(
    ".product-thumbnails ul li img"
  );

  if (productImageLarge) {
    productImageLarge.src = product.image;
    productImagethumbnails.forEach((thumbnail) => {
      thumbnail.src = product.image;
    });
  }

  // star rating
  const stars = document.querySelectorAll(".product-star-rating .star");
  const rating = Math.round(product.rating.rate); // Round the rating to nearest integer

  // rating
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

// product detail page
if (!productListing) {
  fetchProductDetails();
}

// search
const searchInput = document.getElementById("product-search");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    filterProductsBySearch(query);
  });
}

// search query (title category description)
function filterProductsBySearch(query) {
  if (!query) {
    filteredProducts = products; 
  } else {
    filteredProducts = products.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      const descriptionMatch = product.description
        .toLowerCase()
        .includes(query);
      return titleMatch || categoryMatch || descriptionMatch;
    });
  }

 
  currentIndex = 0;
  renderProducts();
  updateResultCount();
}

// Quantity
document.querySelectorAll(".quantity-selector").forEach((selector) => {
  const minusBtn = selector.querySelector(".btn.minus");
  const plusBtn = selector.querySelector(".btn.plus");
  const inputField = selector.querySelector(".quantity-input");

  // minus
  minusBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputField.value);
    if (currentValue > 1) {
      inputField.value = currentValue - 1;
    }
  });

  // plus
  plusBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputField.value);
    inputField.value = currentValue + 1;
  });

  inputField.addEventListener("input", () => {
    if (inputField.value < 1 || isNaN(inputField.value)) {
      inputField.value = 1;
    }
  });
});
