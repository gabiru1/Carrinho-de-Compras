function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function sumAsync() {
  const cartList = Array.from(document.querySelectorAll('.cart__item'));
  const cartNames = cartList.map(({ innerText }) => innerText);
  const priceList = cartNames.map((cartName) => +cartName.split('PRICE: $')[1]);
  const totalPriceList = priceList.reduce((sum, value) => sum + value, 0);
  const totalPriceString = document.querySelector('.total-price');
  totalPriceString.innerText = totalPriceList;
}

function cartItemClickListener({ target }) {
  // coloque seu código aqui
  document.querySelector('.cart__items').removeChild(target);
  sumAsync();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingPage() {
  const itemSection = document.querySelector('.items');
  const loading = document.createElement('p');
  loading.innerText = 'loading...';
  loading.className = 'loading';
  itemSection.appendChild(loading);
}

async function apiItens() {
  loadingPage();
  const comp = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  document.querySelector('.loading').remove();
  const fetchComp = await comp.json();
  fetchComp.results.forEach((product) => document.querySelector('.items')
  .appendChild(createProductItemElement(product)));
  await sumAsync();
}

async function addToCart(id) {
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const fechItem = await item.json();
  const liItem = document.querySelector('.cart__items');
  liItem.appendChild(createCartItemElement(fechItem));
  await sumAsync();
}

document.addEventListener('click', ({ target }) => {
  if (target.classList.contains('item__add')) {
    return addToCart(getSkuFromProductItem(target.parentElement));
  }
  if (target.classList.contains('empty-cart')) {
    document.querySelector('section .cart__items').innerHTML = '';
  }
  sumAsync();
});

window.onload = () => {
  apiItens();
};
