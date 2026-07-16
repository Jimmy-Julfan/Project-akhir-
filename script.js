// ============================================================
//  JIM'S SPORT — E-Commerce Script Berkelas
// ============================================================

// ---------- DATA PRODUK (Gambar menggunakan folder lokal) ----------
let productsData = [
    {
        id: 1,
        name: "Kemeja Olahraga Pria",
        category: "pria",
        price: 299000,
        image: "image/kemeja-olahraga-pria.jpg",
        rating: 4.5,
        stock: 10,
        visible: true
    },
    {
        id: 2,
        name: "Kaos Sport Wanita",
        category: "wanita",
        price: 189000,
        image: "image/kaos-sport-wanita.jpg",
        rating: 4.3,
        stock: 15,
        visible: true
    },
    {
        id: 3,
        name: "Jaket Running Pria",
        category: "pria",
        price: 459000,
        image: "image/jaket-running-pria.jpg",
        rating: 4.7,
        stock: 8,
        visible: true
    },
    {
        id: 4,
        name: "Legging Yoga Wanita",
        category: "wanita",
        price: 249000,
        image: "image/legging-yoga-wanita.jpg",
        rating: 4.6,
        stock: 12,
        visible: true
    },
    {
        id: 5,
        name: "Hoodie Sport Unisex",
        category: "pria",
        price: 389000,
        image: "image/hoodie-sport-unisex.jpg",
        rating: 4.4,
        stock: 7,
        visible: true
    },
    {
        id: 6,
        name: "Tank Top Wanita",
        category: "wanita",
        price: 159000,
        image: "image/tank-top-wanita.jpg",
        rating: 4.2,
        stock: 20,
        visible: true
    },
    {
        id: 7,
        name: "Sepatu Lari Pria",
        category: "pria",
        price: 599000,
        image: "image/sepatu-lari-pria.jpg",
        rating: 4.8,
        stock: 5,
        visible: true
    },
    {
        id: 8,
        name: "Topi Olahraga Wanita",
        category: "wanita",
        price: 129000,
        image: "image/topi-olahraga-wanita.jpg",
        rating: 4.6,
        stock: 25,
        visible: true
    }
];

// ---------- STATE ----------
let cart = [];
let currentFilter = "all";
let currentSort = "default";

// ---------- LOAD/SAVE LOKAL (Diubah ke V2 untuk mereset memori lama) ----------
const loadData = () => {
    // Membaca versi 2 agar tidak bentrok dengan link internet yang lama
    const saved = localStorage.getItem("jimsport_products_v2");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) productsData = parsed;
        } catch (e) {}
    }
};
const saveData = () => { 
    localStorage.setItem("jimsport_products_v2", JSON.stringify(productsData)); 
};
loadData();

// ---------- DOM REFS ----------
const productGrid = document.getElementById("productGrid");
const filterContainer = document.getElementById("filterContainer");
const sortSelect = document.getElementById("sortSelect");
const cartBadge = document.getElementById("cartBadge");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutOverlay");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutForm = document.getElementById("checkoutForm");

// Success Modal Refs
const successOverlay = document.getElementById("successOverlay");
const btnBackToHome = document.getElementById("btnBackToHome");

const hamburgerToggle = document.getElementById("hamburgerToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelectorAll(".navbar__links a, .navbar__mobile a, .logo-link, .hero__cta");
const pages = document.querySelectorAll(".page");

// Admin Refs
const adminLoginMessage = document.getElementById("adminLoginMessage");
const adminDashboard = document.getElementById("adminDashboard");
const openLoginBtn = document.getElementById("openLoginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const totalProductsSpan = document.getElementById("totalProducts");
const adminProductTableBody = document.getElementById("adminProductTableBody");

const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// ---------- UTILITY ----------
const formatRupiah = (number) => "Rp" + number.toLocaleString("id-ID");

// ---------- ROUTING ----------
const navigateTo = (pageId) => {
    pages.forEach(p => p.classList.remove("active"));
    const target = document.getElementById("page-" + pageId);
    if (target) target.classList.add("active");

    document.querySelectorAll(".navbar__links a").forEach(link => {
        link.classList.remove("active");
        if (link.dataset.page === pageId) link.classList.add("active");
    });

    mobileMenu.classList.remove("open");
    window.scrollTo(0, 0);

    if (pageId === "admin") checkAdminAccess();
};

navLinks.forEach(el => {
    el.addEventListener("click", (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        if (page) navigateTo(page);
    });
});

// ---------- ADMIN ACCESS ----------
const checkAdminAccess = () => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
        adminLoginMessage.style.display = "none";
        adminDashboard.style.display = "block";
        renderAdminDashboard();
    } else {
        adminLoginMessage.style.display = "block";
        adminDashboard.style.display = "none";
    }
};

openLoginBtn.addEventListener("click", () => {
    loginOverlay.classList.add("open");
    loginError.style.display = "none";
});
loginClose.addEventListener("click", () => loginOverlay.classList.remove("open"));
loginOverlay.addEventListener("click", (e) => { if (e.target === loginOverlay) loginOverlay.classList.remove("open"); });

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("adminLoggedIn", "true");
        loginOverlay.classList.remove("open");
        loginForm.reset();
        navigateTo("admin");
    } else {
        loginError.style.display = "block";
    }
});

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigateTo("admin");
    showToast("Anda telah logout.");
});

// ---------- RENDER ADMIN DASHBOARD ----------
const renderAdminDashboard = () => {
    totalProductsSpan.textContent = productsData.length;
    adminProductTableBody.innerHTML = productsData.map(p => `
        <tr>
            <td><strong>#${p.id}</strong></td>
            <td>${p.name}</td>
            <td>${p.category === "pria" ? "👔 Pria" : "👗 Wanita"}</td>
            <td><input type="number" class="admin-price" data-id="${p.id}" value="${p.price}" step="1000" /></td>
            <td><input type="number" class="admin-stock" data-id="${p.id}" value="${p.stock}" min="0" style="width:60px;" /></td>
            <td>⭐ ${p.rating.toFixed(1)}</td>
            <td><button class="btn-toggle ${p.visible ? 'visible' : ''}" data-id="${p.id}">${p.visible ? 'Tampil' : 'Sembunyi'}</button></td>
            <td>
                <button class="btn-edit admin-save" data-id="${p.id}"><i class="fa-solid fa-floppy-disk"></i></button>
                <button class="btn-delete admin-delete" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("");

    document.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const product = productsData.find(p => p.id === Number(btn.dataset.id));
            if (product) {
                product.visible = !product.visible;
                saveData(); renderAdminDashboard(); renderProducts();
            }
        });
    });

    document.querySelectorAll(".admin-save").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const product = productsData.find(p => p.id === id);
            const price = parseInt(document.querySelector(`.admin-price[data-id="${id}"]`).value);
            const stock = parseInt(document.querySelector(`.admin-stock[data-id="${id}"]`).value);
            if (product && !isNaN(price) && !isNaN(stock)) {
                product.price = price; product.stock = stock;
                saveData(); renderAdminDashboard(); renderProducts();
                showToast("✅ Data berhasil disimpan!");
            }
        });
    });

    document.querySelectorAll(".admin-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            if (confirm(`Hapus produk ID ${id}?`)) {
                productsData = productsData.filter(p => p.id !== id);
                saveData(); renderAdminDashboard(); renderProducts();
                showToast("🗑️ Produk dihapus!");
            }
        });
    });
};

// ---------- RENDER PRODUK ----------
const renderProducts = () => {
    let filtered = productsData.filter(p => p.visible === true);

    if (currentFilter !== "all") filtered = filtered.filter(p => p.category === currentFilter);

    switch (currentSort) {
        case "price-low": filtered.sort((a, b) => a.price - b.price); break;
        case "price-high": filtered.sort((a, b) => b.price - a.price); break;
        case "rating": filtered.sort((a, b) => b.rating - a.rating); break;
    }

    if (filtered.length === 0) {
        productGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--color-gray);"><i class="fa-solid fa-box-open" style="font-size:3rem; opacity:0.3; margin-bottom:16px; display:block;"></i><p>Tidak ada produk yang tersedia saat ini.</p></div>`;
        return;
    }

    productGrid.innerHTML = filtered.map(product => {
        const inCart = cart.some(item => item.id === product.id);
        const stockStatus = product.stock <= 0 ? "Habis" : `${product.stock} Tersisa`;
        
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card__img-wrap">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" />
                </div>
                <div class="product-card__info">
                    <div class="product-meta">
                        <span class="category">${product.category === "pria" ? "PRIA" : "WANITA"}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${product.rating.toFixed(1)}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="price">${formatRupiah(product.price)}</div>
                    <div class="stock-info">Stok: ${stockStatus}</div>
                    <button class="add-to-cart ${inCart ? 'in-cart' : ''}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" ${product.stock <= 0 ? 'disabled' : ''}>
                        ${product.stock <= 0 ? 'Stok Habis' : (inCart ? '<i class="fa-solid fa-check"></i> Di Keranjang' : 'Tambah ke Keranjang')}
                    </button>
                </div>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const product = productsData.find(p => p.id === id);
            if (product && product.stock > 0) addToCart(id, btn.dataset.name, Number(btn.dataset.price), btn.dataset.image);
        });
    });
};

// ---------- FILTER & SORT ----------
filterContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;
    filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    renderProducts();
});

sortSelect.addEventListener("change", () => { currentSort = sortSelect.value; renderProducts(); });

// ---------- CART SYSTEM ----------
const addToCart = (id, name, price, image) => {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, name, price, image, quantity: 1 });
    updateCartUI(); renderProducts(); openCart();
};

const updateCartQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const product = productsData.find(p => p.id === id);
    
    if (delta > 0 && product && item.quantity >= product.stock) {
        showToast("Maksimal stok tercapai!");
        return;
    }

    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI(); renderProducts();
};

const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "flex" : "none";
    
    if (cart.length === 0) {
        cartBody.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-cart-arrow-down"></i><p>Keranjangmu masih kosong.<br />Yuk, temukan gayamu!</p></div>`;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item__info">
                    <h4>${item.name}</h4>
                    <div class="price">${formatRupiah(item.price)}</div>
                    <div class="cart-item__qty">
                        <button class="qty-decr" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-incr" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item__remove" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `).join("");

        document.querySelectorAll(".qty-incr").forEach(btn => btn.addEventListener("click", () => updateCartQuantity(Number(btn.dataset.id), 1)));
        document.querySelectorAll(".qty-decr").forEach(btn => btn.addEventListener("click", () => updateCartQuantity(Number(btn.dataset.id), -1)));
        document.querySelectorAll(".cart-item__remove").forEach(btn => btn.addEventListener("click", () => {
            cart = cart.filter(i => i.id !== Number(btn.dataset.id));
            updateCartUI(); renderProducts();
        }));
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatRupiah(totalPrice);
};

// ---------- SIDEBAR & MODAL ----------
const openCart = () => { cartSidebar.classList.add("open"); cartOverlay.classList.add("open"); document.body.style.overflow = "hidden"; };
const closeCart = () => { cartSidebar.classList.remove("open"); cartOverlay.classList.remove("open"); document.body.style.overflow = ""; };
cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

const openCheckout = () => {
    if (cart.length === 0) { showToast("Keranjang kosong!"); return; }
    closeCart(); checkoutModal.classList.add("open"); document.body.style.overflow = "hidden";
};
const closeCheckout = () => { checkoutModal.classList.remove("open"); document.body.style.overflow = ""; document.querySelectorAll(".form-error").forEach(el => el.classList.remove("visible")); };
checkoutBtn.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);

// ---------- CHECKOUT PROCESS & SUCCESS INVOICE ----------
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const address = document.getElementById("address");
    const paymentMethod = document.getElementById("paymentMethod");

    const nameError = document.getElementById("nameError");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");

    [nameError, addressError, paymentError].forEach(el => el.classList.remove("visible"));

    let isValid = true;
    if (!fullName.value.trim()) { nameError.classList.add("visible"); isValid = false; }
    if (!address.value.trim()) { addressError.classList.add("visible"); isValid = false; }
    if (!paymentMethod.value) { paymentError.classList.add("visible"); isValid = false; }

    if (!isValid) return;

    closeCheckout();
    loadingOverlay.classList.add("active");

    setTimeout(() => {
        loadingOverlay.classList.remove("active");

        // Kurangi stok
        cart.forEach(item => {
            const product = productsData.find(p => p.id === item.id);
            if (product) product.stock = Math.max(0, product.stock - item.quantity);
        });
        saveData();

        // Hitung total & Setup struk
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const paymentLabel = paymentMethod.options[paymentMethod.selectedIndex].text;
        
        document.getElementById("receiptOrderId").textContent = "#ORD-" + Math.floor(Math.random() * 90000 + 10000);
        document.getElementById("receiptName").textContent = fullName.value.trim();
        document.getElementById("receiptMethod").textContent = paymentLabel;
        document.getElementById("receiptTotal").textContent = formatRupiah(total);

        // Buka Success Modal
        successOverlay.classList.add("open");
        document.body.style.overflow = "hidden";

        // Reset
        cart = []; updateCartUI(); renderProducts(); checkoutForm.reset();
    }, 2000);
});

// Tutup success modal & kembali ke beranda
btnBackToHome.addEventListener("click", () => {
    successOverlay.classList.remove("open");
    document.body.style.overflow = "";
    navigateTo("home");
});

// ---------- TOAST ----------
const showToast = (message) => {
    toastMessage.textContent = message; toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
};

// ---------- MOBILE MENU & UTILS ----------
hamburgerToggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (cartSidebar.classList.contains("open")) closeCart();
        if (checkoutModal.classList.contains("open")) closeCheckout();
        if (loginOverlay.classList.contains("open")) loginOverlay.classList.remove("open");
        if (successOverlay.classList.contains("open")) { successOverlay.classList.remove("open"); document.body.style.overflow = ""; }
    }
});

// ---------- INIT ----------
renderProducts();
updateCartUI();
navigateTo("home");