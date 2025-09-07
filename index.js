console.log("Initializing App...");

const spinner = document.getElementById("spinner");
const showSpinner = () => {
  spinner.classList.remove("hidden");
  console.log("Spinner: Showing");
};
const hideSpinner = () => {
  spinner.classList.add("hidden");
  console.log("Spinner: Hidden");
};

let activeCategoryId = "all";
const setActiveCategory = (id) => {
  activeCategoryId = id;
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("bg-green-500", "text-white");
    btn.classList.add("bg-green-200");
    if (btn.dataset.id === id) {
      btn.classList.add("bg-green-500", "text-white");
    }
  });
  console.log("Active category set:", id);
};

const fetchWithSpinner = async (url) => {
  showSpinner();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to load data. Please try again later.");
    return null;
  } finally {
    hideSpinner();
  }
};

// ==============================
// Step 1: Load Categories
// ==============================
const loadCategories = async () => {
  console.log("Step 1: Loading categories...");
  const data = await fetchWithSpinner(
    "https://openapi.programming-hero.com/api/categories"
  );
  if (!data) return;

  const categories = data.categories || [];
  const categoriesContainer = document.getElementById("categories");
  categoriesContainer.innerHTML = "";

  // Add "All Trees" button
  const allBtn = document.createElement("button");
  allBtn.textContent = "All Trees";
  allBtn.className = "category-btn bg-green-200 p-2 rounded";
  allBtn.dataset.id = "all";
  categoriesContainer.appendChild(allBtn);

  // Dynamic category buttons
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.category_name;
    btn.className = "category-btn bg-green-200 p-2 rounded";
    btn.dataset.id = cat.id;
    categoriesContainer.appendChild(btn);
  });

  setActiveCategory("all");
  loadTreesByCategory("all");
};

// ==============================
// Step 2: Load Trees by Category
// ==============================
const loadTreesByCategory = async (id) => {
  console.log("Step 2: Loading trees for category:", id);
  let url = "https://openapi.programming-hero.com/api/plants";
  if (id !== "all")
    url = `https://openapi.programming-hero.com/api/category/${id}`;

  const data = await fetchWithSpinner(url);
  if (!data) return;

  const trees = data.plants || [];
  const treeContainer = document.getElementById("tree-cards");
  treeContainer.innerHTML = "";

  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded p-2 shadow flex flex-col items-center";

    const description = tree.description || "No description available";
    const price = tree.price || 10;

    card.innerHTML = `
      <img src="${tree.image || "https://via.placeholder.com/150"}" alt="${
      tree.name
    }" class="w-32 h-32 object-cover mb-2"/>
      <h2 class="font-bold text-lg cursor-pointer">${tree.name}</h2>
      <p class="text-gray-500">${description}</p>
      <p class="font-bold" data-price="${price}">$${price}</p>
      <button class="add-to-cart bg-yellow-400 px-4 py-1 rounded mt-2 hover:bg-yellow-500">Add to Cart</button>
    `;
    treeContainer.appendChild(card);

    // Modal click
    card.querySelector("h2").onclick = () => showTreeModal(tree);
  });
};

// ==============================
// Step 3: Cart Functionality
// ==============================
let cart = [];
const updateCart = () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500">No items added yet.</p>`;
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "space-y-2";

  let total = 0;
  cart.forEach((item, index) => {
    total += Number(item.price);

    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-green-50 p-2 rounded";
    li.innerHTML = `
      <span>${item.name}</span>
      <span class="flex items-center space-x-2">
        <span>$${item.price}</span>
        <button class="text-red-500 font-bold remove-btn" data-index="${index}">&times;</button>
      </span>
    `;
    ul.appendChild(li);
  });

  cartContainer.appendChild(ul);

  const totalEl = document.createElement("p");
  totalEl.className = "mt-2 font-bold text-right";
  totalEl.textContent = `Total: $${total}`;
  cartContainer.appendChild(totalEl);

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.onclick = () => {
      const idx = btn.getAttribute("data-index");
      console.log("Removing item from cart:", cart[idx].name);
      cart.splice(idx, 1);
      updateCart();
    };
  });
};

document.getElementById("tree-cards").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest("div");
    const name = card.querySelector("h2").textContent;
    const price = Number(card.querySelector("[data-price]").dataset.price);

    const treeItem = { name, price };
    cart.push(treeItem);
    console.log("Added to cart:", treeItem);
    updateCart();
  }
});

// ==============================
// Step 4: Modal Functionality
// ==============================
const modal = document.getElementById("tree-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");

const showTreeModal = (tree) => {
  const description = tree.description || "No description available";
  const price = tree.price || 10;

  modalContent.innerHTML = `
    <h2 class="font-bold text-xl mb-2">${tree.name}</h2>
    <img src="${tree.image || "https://via.placeholder.com/150"}" alt="${
    tree.name
  }" class="w-full mb-2"/>
    <p>${description}</p>
    <p class="font-bold mt-2">$${price}</p>
  `;
  modal.classList.remove("hidden");
};

closeModalBtn.onclick = () => modal.classList.add("hidden");

// ==============================
// Step 5: Category Click Events
// ==============================
document.getElementById("categories").addEventListener("click", (e) => {
  if (e.target.classList.contains("category-btn")) {
    const id = e.target.dataset.id;
    setActiveCategory(id);
    loadTreesByCategory(id);
  }
});

// ==============================
// Step 6: Form Validation (Footer)
// ==============================
const donateForm = document.querySelector("footer form") || null;
if (donateForm) {
  donateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = donateForm.querySelector('input[type="text"]').value.trim();
    const email = donateForm.querySelector('input[type="email"]').value.trim();
    const trees = donateForm.querySelector("select").value;

    if (!name || !email || trees === "Number of Trees") {
      alert("Please fill all fields correctly.");
      return;
    }

    alert(`Thank you ${name}! You have donated ${trees} tree(s).`);
    donateForm.reset();
  });
}
document.getElementById("tree-cards").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest("div");
    const name = card.querySelector("h2").textContent;
    const price =
      Number(
        card.querySelector("p:nth-of-type(2)").textContent.replace("$", "")
      ) || 10;

    const treeItem = { name, price };
    cart.push(treeItem);
    console.log("Added to cart:", treeItem);
    updateCart();

    // ✅ Alert added
    alert(`🌳 "${name}" added to cart!`);
  }
});

// Initialize App
loadCategories();
// Hamburger Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
const logoName = document.getElementById("logo-name");
const logoImg = document.getElementById("logo-img");

logoName.addEventListener("mouseenter", () => {
  // Zoom + jhilimili
  logoName.classList.add("scale-125", "jhilimili");
  // Show image
  logoImg.classList.remove("opacity-0");
  logoImg.classList.add("opacity-100");
});

logoName.addEventListener("mouseleave", () => {
  // Remove zoom + jhilimili
  logoName.classList.remove("scale-125", "jhilimili");
  // Hide image
  logoImg.classList.remove("opacity-100");
  logoImg.classList.add("opacity-0");
});
