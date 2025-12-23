let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

function displayProducts(list) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString()} ریال</p>
        <a href="product-detail.html?id=${p.id}">جزئیات</a>
      </div>
    `;
  });
}

function filterProducts(category) {
  if(category === "all") displayProducts(products);
  else displayProducts(products.filter(p => p.category === category));
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

if(window.location.pathname.includes("product-detail.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id === id);
      if(!product) return;
      document.getElementById("product-detail").innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>ابعاد: ${product.dimensions}</p>
        <strong>${product.price.toLocaleString()} ریال</strong>
      `;
    });
}

function addCurrentProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id);
  if(!product) return;
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("به سبد خرید اضافه شد");
}

if(window.location.pathname.includes("cart.html")) {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  container.innerHTML = "";
  let total = 0;
  cart.forEach(p => {
    container.innerHTML += `<li>${p.name} - ${p.price.toLocaleString()} ریال</li>`;
    total += p.price;
  });
  totalEl.innerText = `جمع کل: ${total.toLocaleString()} ریال`;
}
