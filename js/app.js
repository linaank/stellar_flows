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