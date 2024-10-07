"use strict";

const STORE_BASE_URL = "https://fakestoreapi.com";
const CONTAINER = document.querySelector(".container-fluid");

// Navbar Function
const navBar = () => {
  const navDiv = document.createElement("div");
  navDiv.innerHTML = `
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Fake Store</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Category</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" data-category="all">All</a></li>
              <li><a class="dropdown-item" href="#" data-category="electronics">Electronics</a></li>
              <li><a class="dropdown-item" href="#" data-category="jewelery">Jewelery</a></li>
              <li><a class="dropdown-item" href="#" data-category="men's clothing">Men's clothing</a></li>
              <li><a class="dropdown-item" href="#" data-category="women's clothing">Women's clothing</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        <a class="cart" href="/card"><i class="bi bi-cart3"></i></a>
      </div>
    </div>
  </nav>`;
  CONTAINER.appendChild(navDiv);
};

// Don't touch this function please
const autorun = async () => {
  const products = await fetchProducts();
  navBar();
  setupCategoryFilters(products); // Set up filters with fetched products
  renderProducts(products);
  renderFooter(); // Render the footer after products
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${STORE_BASE_URL}/${path}`;
};

// Don't touch this function please. This function is to fetch one product.
const fetchProduct = async (productId) => {
  const url = constructUrl(`products/${productId}`);
  const res = await fetch(url);
  return res.json();
};

///////////////////////////////////////////

// This function is to fetch products. You may need to add it or change some part in it in order to apply some of the features.
const fetchProducts = async () => {
  const url = constructUrl(`products`);
  const res = await fetch(url);
  return res.json();
};
const filterProducts = (category, products) => {
  if (category === "all") {
    return products;
  }
  return products.filter((product) => product.category === category);
};

const setupCategoryFilters = (products) => {
  const categoryLinks = document.querySelectorAll("[data-category]");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const category = event.target.getAttribute("data-category");
      const filteredProducts = filterProducts(category, products);
      CONTAINER.innerHTML = ""; // Clear existing content
      navBar(); // Add navbar again
      setupCategoryFilters(products); // Reattach the event listeners
      renderProducts(filteredProducts); // Render filtered products
      renderFooter(); // Re-add footer after rendering
    });
  });
};

// You may need to add to this function, definitely don't delete it.
const productDetails = async (product) => {
  const res = await fetchProduct(product.id);
  renderProduct(res);
};

// You'll need to play with this function in order to add features and enhance the style.

const renderProducts = (products) => {
  const productRow = document.createElement("div");
  productRow.className = "row";

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let cartCount = JSON.parse(localStorage.getItem("cartCount")) || 0;

  products.map((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "col-sm-4";

    productDiv.innerHTML = `
      <div class="card" style="width: 18rem;">
        <i class="bi bi-heart" data-id="${product.id}"></i>
        <div class="card-body">
          <img class="card-img-top" src="${product.image}" alt="${product.title} poster">
          <h3 class="card-title">${product.title}</h3>
          <p>${product.price}</p>
        </div>
      </div>`;

    productDiv.addEventListener("click", () => {
      productDetails(product);

      // Increment cart count and update local storage
      cartCount += 1;
      localStorage.setItem("cartCount", JSON.stringify(cartCount));
      updateCartCount();
    });

    const heartIcon = productDiv.querySelector(".bi-heart");

    if (favorites.includes(product.id)) {
      heartIcon.classList.replace("bi-heart", "bi-heart-fill");
    }

    heartIcon.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!favorites.includes(product.id)) {
        favorites.push(product.id);
        heartIcon.classList.replace("bi-heart", "bi-heart-fill");
      } else {
        favorites = favorites.filter((id) => id !== product.id);
        heartIcon.classList.replace("bi-heart-fill", "bi-heart");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    productRow.appendChild(productDiv);
  });

  CONTAINER.appendChild(productRow);
};

const renderProduct = (product) => {
  CONTAINER.innerHTML = ""; // Clear existing content
  navBar(); // Add navbar again
  const productDetailsDiv = document.createElement("div");
  productDetailsDiv.className = "row";
  productDetailsDiv.innerHTML = `
    <div class="col-12">
      <h1>${product.title}</h1>
      <img src="${product.image}" alt="${product.title}" class="img-fluid card-img-top">
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
    </div>
  `;
  CONTAINER.appendChild(productDetailsDiv);
  renderFooter(); // Add footer
};

const renderFooter = () => {
  const footer = document.createElement("footer");
  footer.className = "bg-dark text-white text-center py-3";

  footer.innerHTML = `
    <!-- Grid container -->

    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      © 2024 Copyright:Kareem Sallam
    </div>
    <!-- Copyright -->
  </footer>
  </section>

  `;

  CONTAINER.appendChild(footer);
};


document.addEventListener("DOMContentLoaded", autorun);