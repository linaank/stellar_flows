const formatPrice = (value) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);

const productsEl = document.getElementById("products");

function renderProducts() {
  productsEl.innerHTML = products.map((p) => `
    <li>
      <article class="card">
        <img class="card__img" src="${p.image}" alt="${p.name}" width="430" height="400" loading="lazy">
        <div class="card__body">
          <h2 class="card__title">${p.name}</h2>
          <p class="card__price">${formatPrice(p.price)}</p>
          <button class="btn" type="button" data-add="${p.id}">Добавить в корзину</button>
        </div>
      </article>
    </li>`).join("");
}

renderProducts();

let cart = [];

const cartItemsEl = document.getElementById("cart-items");
const cartEmptyEl = document.getElementById("cart-empty");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

const getProduct = (id) => products.find((p) => p.id === id);

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  update();
}

function getTotal() {
  return cart.reduce((sum, i) => sum + getProduct(i.id).price * i.qty, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = cart.map((i) => {
    const p = getProduct(i.id);
    return `
      <li class="cart-item">
        <img src="${p.image}" alt="" width="56" height="56">
        <div class="cart-item__info">
          <h3>${p.name}</h3>
          <p>${formatPrice(p.price)} × ${i.qty} = <strong>${formatPrice(p.price * i.qty)}</strong></p>
        </div>
        <div class="qty">
          <button type="button" data-action="dec" data-id="${p.id}" aria-label="Уменьшить количество">−</button>
          <span>${i.qty}</span>
          <button type="button" data-action="inc" data-id="${p.id}" aria-label="Увеличить количество">+</button>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove" data-id="${p.id}" aria-label="Удалить ${p.name}">✕</button>
      </li>`;
  }).join("");

  cartEmptyEl.hidden = cart.length > 0;
  cartTotalEl.textContent = formatPrice(getTotal());
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  checkoutBtn.disabled = cart.length === 0;
}

function update() {
  renderCart();
}

productsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});

renderCart();

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  update();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else update();
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const { action } = btn.dataset;
  if (action === "inc") changeQty(id, 1);
  if (action === "dec") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

const CART_KEY = "flora-cart";

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(data)) return [];
    return data.filter((i) => getProduct(i.id) && Number.isInteger(i.qty) && i.qty > 0);
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function update() {
  saveCart();
  renderCart();
}

cart = loadCart();  
renderCart();