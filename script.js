// ============================================================
//  JIM'S SPORT — E-Commerce JavaScript (Vanilla)
//  Senior Front-End Developer: clean, modular, well-commented
// ============================================================

// ---------- DATA PRODUK ----------
const productsData = [
    {
        id: 1,
        name: "Kemeja Olahraga Pria",
        category: "pria",
        price: 299000,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "kemeja-olahraga-pria"
    },
    {
        id: 2,
        name: "Kaos Sport Wanita",
        category: "wanita",
        price: 189000,
        image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "kaos-sport-wanita"
    },
    {
        id: 3,
        name: "Jaket Running Pria",
        category: "pria",
        price: 459000,
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "jaket-running-pria"
    },
    {
        id: 4,
        name: "Legging Yoga Wanita",
        category: "wanita",
        price: 249000,
        image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "legging-yoga-wanita"
    },
    {
        id: 5,
        name: "Hoodie Sport Unisex",
        category: "pria",
        price: 389000,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "hoodie-sport-unisex"
    },
    {
        id: 6,
        name: "Tank Top Wanita",
        category: "wanita",
        price: 159000,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "tank-top-wanita"
    }
];

// ---------- STATE ----------
let cart = [];                 // Array { id, quantity }
let currentFilter = "all";    // "all" | "pria" | "wanita"

// ---------- DOM REFS ----------
const productGrid = document.getElementById("productGrid");
const filterContainer = document.getElementById("filterContainer");
const cartBadge = document.getElementById("cartBadge");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutForm = document.getElementById("checkoutForm");
const hamburgerToggle = document.getElementById("hamburgerToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelectorAll(".navbar__links a");

// ---------- UTILITY: format Rupiah ----------
const formatRupiah = (number) => {
    return "Rp" + number.toLocaleString("id-ID");
};

// ---------- RENDER PRODUK (dengan filter) ----------
const renderProducts = () => {
    const filtered = currentFilter === "all"
        ? productsData
        : productsData.filter(p => p.category === currentFilter);

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--color-gray);">
                <i class="fa-solid fa-box-open" style="font-size:2rem; opacity:0.5;"></i>
                <p style="margin-top:8px;">Tidak ada produk untuk kategori ini.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filtered.map(product => {
        // Cek apakah produk sudah di keranjang
        const cartItem = cart.find(item => item.id === product.id);
        const inCart = !!cartItem;

        return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                <div class="product-card__info">
                    <h3>${product.name}</h3>
                    <span class="category">${product.category === "pria" ? "👔 Pria" : "👗 Wanita"}</span>
                    <div class="price">${formatRupiah(product.price)}</div>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                        ${inCart ? "✅ Di Keranjang" : "Tambah ke Keranjang"}
                    </button>
                </div>
            </div>
        `;
    }).join("");

    // Event listener untuk tombol "Tambah ke Keranjang"
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(btn.dataset.id);
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price);
            const image = btn.dataset.image;
            addToCart(id, name, price, image);
        });
    });
};

// ---------- FILTER ----------
filterContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    // Update active class
    filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderProducts();
});

// ---------- CART: TAMBAH ----------
const addToCart = (id, name, price, image) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        // Jika sudah ada, increment quantity
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCartUI();
    renderProducts(); // Refresh tombol (tampilkan "Di Keranjang")
};

// ---------- CART: HAPUS ITEM ----------
const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    renderProducts();
};

// ---------- CART: UPDATE QUANTITY ----------
const updateCartQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        removeFromCart(id);
        return;
    }
    item.quantity = newQty;
    updateCartUI();
    renderProducts();
};

// ---------- CART: UPDATE UI (badge, sidebar, total) ----------
const updateCartUI = () => {
    // Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "flex" : "none";

    // Render sidebar
    renderCartSidebar();

    // Update total di footer sidebar
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatRupiah(totalPrice);

    // Simpan total ke dataset untuk checkout
    checkoutBtn.dataset.total = totalPrice;
};

// ---------- RENDER CART SIDEBAR ----------
const renderCartSidebar = () => {
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fa-regular fa-face-frown"></i>
                <p>Keranjangmu kosong.<br />Yuk, belanja sekarang!</p>
            </div>
        `;
        return;
    }

    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item__info">
                <h4>${item.name}</h4>
                <div class="price">${formatRupiah(item.price)}</div>
                <div class="cart-item__qty">
                    <button class="qty-decr" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-incr" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item__remove" data-id="${item.id}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join("");

    // Event: increment / decrement
    document.querySelectorAll(".qty-incr").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            updateCartQuantity(id, 1);
        });
    });
    document.querySelectorAll(".qty-decr").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            updateCartQuantity(id, -1);
        });
    });
    document.querySelectorAll(".cart-item__remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            removeFromCart(id);
        });
    });
};

// ---------- SIDEBAR: BUKA / TUTUP ----------
const openCart = () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
};

const closeCart = () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
};

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ---------- CHECKOUT MODAL ----------
const openCheckout = () => {
    // Cek apakah keranjang kosong
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Tambahkan produk dulu!");
        return;
    }
    closeCart(); // Tutup sidebar
    checkoutModal.classList.add("open");
    checkoutOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
};

const closeCheckout = () => {
    checkoutModal.classList.remove("open");
    checkoutOverlay.classList.remove("open");
    document.body.style.overflow = "";
    // Reset error state
    document.querySelectorAll(".form-error").forEach(el => el.classList.remove("visible"));
};

checkoutBtn.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);

// ---------- CHECKOUT FORM VALIDASI & SUBMIT ----------
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ambil field
    const fullName = document.getElementById("fullName");
    const address = document.getElementById("address");
    const payment = document.getElementById("payment");

    const nameError = document.getElementById("nameError");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");

    // Reset error
    [nameError, addressError, paymentError].forEach(el => el.classList.remove("visible"));

    let isValid = true;

    if (!fullName.value.trim()) {
        nameError.classList.add("visible");
        isValid = false;
    }
    if (!address.value.trim()) {
        addressError.classList.add("visible");
        isValid = false;
    }
    if (!payment.value) {
        paymentError.classList.add("visible");
        isValid = false;
    }

    if (!isValid) return;

    // ---- Sukses ----
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentLabel = payment.value === "transfer" ? "Transfer Bank" : "COD (Bayar di Tempat)";

    alert(
        `✅ Pesanan Berhasil!\n\n` +
        `Nama: ${fullName.value.trim()}\n` +
        `Alamat: ${address.value.trim()}\n` +
        `Pembayaran: ${paymentLabel}\n` +
        `Total: ${formatRupiah(total)}\n\n` +
        `Terima kasih telah berbelanja di JIM'S SPORT!`
    );

    // Reset form & kosongkan keranjang
    checkoutForm.reset();
    cart = [];
    updateCartUI();
    renderProducts();
    closeCheckout();
});

// ---------- MOBILE HAMBURGER ----------
hamburgerToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

// Tutup mobile menu saat link diklik
mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });
});

// ---------- NAVBAR LINK AKTIF (scroll spy sederhana) ----------
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".navbar__links a, .navbar__mobile a");

const updateActiveLink = () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });
    navAnchors.forEach(anchor => {
        anchor.classList.remove("active");
        if (anchor.getAttribute("href") === `#${current}`) {
            anchor.classList.add("active");
        }
    });
};

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

// ---------- INIT ----------
renderProducts();
updateCartUI();

// Tampilkan badge hanya jika ada item (awal kosong)
cartBadge.style.display = "none";

// ---------- (Opsional) Tutup sidebar dengan tombol ESC ----------
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (cartSidebar.classList.contains("open")) closeCart();
        if (checkoutModal.classList.contains("open")) closeCheckout();
    }
});

console.log("🚀 JIM'S SPORT siap! Selamat berbelanja.");