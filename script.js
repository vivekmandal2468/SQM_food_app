// Initialize Swiper only if present on the page
if (document.querySelector(".mySwiper")) {
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
      nextEl: "#next",
      prevEl: "#previous",
    },
  });
}

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const threeDot = document.querySelector(".threeDot");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

if (cartIcon && cartTab) {
  cartIcon.addEventListener("click", () =>
    cartTab.classList.add("cart-tab-active")
  );
}
if (closeBtn && cartTab) {
  closeBtn.addEventListener("click", () =>
    cartTab.classList.remove("cart-tab-active")
  );
}
if (threeDot && mobileMenu) {
  threeDot.addEventListener("click", () =>
    mobileMenu.classList.toggle("mobile-menu-active")
  );
}

if (threeDot && bars) {
  threeDot.addEventListener("click", () => bars.classList.toggle("fa-xmark"));
}

let productList = [];
let cartProduct = [];

const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent
    );

    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("$", "")
    );
    totalPrice += price;
    totalQuantity += quantity;
  });

  if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  if (cartValue) cartValue.textContent = totalQuantity;
};

const showCards = () => {
  if (!cardList) return;
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");
    orderCard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" />
      </div>
      <h4 class="product--name">${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn atc-btn">Add to Cart</a>
    `;
    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();

      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);
  if (existingProduct) {
    alert("Item already in your cart!!");
    return;
  }
  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
     <div class="item-image">
                  <img src="${product.image}" >
                </div>
                <div class="detail">
                  <h4>${product.name}</h4>
                  </div>
                  <h4 class="item-total">${product.price}</h4>
                <div class="flex">
                  <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
                  <h4 class="quantity-value">${quantity}</h4>
                  <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
                </div>
              
  `;
  cartList.appendChild(cartItem);

  updateTotals();

  const plusBtn = cartItem.querySelector(".plus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");
  const minusBtn = cartItem.querySelector(".minus");

  plusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)} `;
    updateTotals();
  });

  minusBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      updateTotals();
    } else {
      cartItem.classList.add("slide-out");

      setTimeout(() => {
        cartItem.remove();
        cartProduct = cartProduct.filter((item) => item.id !== product.id);
        updateTotals();
      }, 300);
    }
  });
};

const initApp = () => {
  if (cardList) {
    fetch("products.json")
      .then((Response) => Response.json())
      .then((data) => {
        productList = data;
        showCards();
      });
  }
};
initApp();

// ---------------------- AUTH: Sign In / Sign Out ----------------------
const signinDesktop = document.getElementById("signin-link");
const signinMobile = document.getElementById("signin-link-mobile");

function getUser() {
  try {
    const raw = localStorage.getItem("foodiUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem("foodiUser", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("foodiUser");
}

function applyAuthUI() {
  const user = getUser();
  const setSignOut = (el) => {
    if (!el) return;
    el.textContent = "Sign out";
    el.href = "#";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      clearUser();
      location.reload();
    });
  };
  const setSignIn = (el) => {
    if (!el) return;
    el.innerHTML = 'Sign in&nbsp;<i class="fa-solid fa-arrow-right-from-bracket"></i>';
    el.href = "login.html";
  };

  if (user) {
    setSignOut(signinDesktop);
    setSignOut(signinMobile);
  } else {
    setSignIn(signinDesktop);
    setSignIn(signinMobile);
  }
}
applyAuthUI();

// Handle login form submission if on login page
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
    const password = loginForm.querySelector('input[type="password"]')?.value;

    // Simple client-side validation
    if (!email || !password) {
      showAuthError("Please enter email and password.");
      return;
    }
    // Demo "working" login; accept any non-empty credentials
    const name = email.split("@")[0] || "User";
    setUser({ email, name });
    // Optional: show success then redirect
    const redirect = loginForm.getAttribute("data-redirect") || "home.html";
    window.location.href = redirect;
  });
}

function showAuthError(message) {
  const errorBox = document.getElementById("auth-error");
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
  } else {
    alert(message);
  }
}