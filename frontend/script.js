document.addEventListener("DOMContentLoaded", () => {
  const menu = [
    "Soda", "Coffee", "Beer", "Wings", "Nachos", "Salad", "Steak",
    "Grilled Chicken", "Plantains", "Tilapia Fish"
  ];

  const menuButtonsDiv = document.getElementById("menuButtons");
  const quantityDisplay = document.getElementById("quantity");
  const tableInput = document.getElementById("table");
  const kitchenOrdersList = document.getElementById("kitchenOrders");
  const refreshBtn = document.getElementById("refreshOrders");

  const inventoryList = document.getElementById("inventoryList");
  const addItemForm = document.getElementById("addItemForm");
  const filterInput = document.getElementById("filterInput");
  const exportBtn = document.getElementById("exportBtn");

  const managerLogin = document.getElementById("managerLogin");
  const managerPanel = document.getElementById("managerPanel");
  const loginBtn = document.getElementById("loginBtn");
  const loginMsg = document.getElementById("loginMsg");
  const passwordInput = document.getElementById("managerPassword");

  let quantity = 1;
  let orders = [];
  let inventoryData = [];

  // ✅ Color Map
  const colorMap = {
    "soda": "menu-soda",
  "coffee": "menu-coffee",
  "beer": "menu-beer",
  "wings": "menu-wings",
  "nachos": "menu-nachos",
  "salad": "menu-salad",
  "steak": "menu-steak",
  "grilled-chicken": "menu-chicken",
  "plantains": "menu-plantains",
  "tilapia-fish": "menu-tilapia"
  };

  // ✅ POS Buttons
  menu.forEach(item => {
    const button = document.createElement("button");
    button.textContent = item;
    button.classList.add("menu-button");

    const key = item.toLowerCase().replace(/\s+/g, "-"); // convert to kebab-case
    if (colorMap[key]) {
      button.classList.add(colorMap[key]);
    }

    button.addEventListener("click", () => {
      const table = parseInt(tableInput.value);
      if (!table) return alert("Please enter table number");
      orders.push({ item, quantity, table });
      alert(`${quantity} x ${item} added for Table ${table}`);
    });

    menuButtonsDiv.appendChild(button);
  });

  // Quantity controls
  document.getElementById("increase").onclick = () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  };

  document.getElementById("decrease").onclick = () => {
    if (quantity > 1) quantity--;
    quantityDisplay.textContent = quantity;
  };

  // Send orders
  document.getElementById("send").addEventListener("click", () => {
    if (orders.length === 0) return alert("No orders to send.");
    let promises = orders.map(order =>
      fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      })
    );

    Promise.all(promises).then(() => {
      alert("✅ Orders sent.");
      orders = [];
      fetchKitchenOrders(); // Auto-refresh kitchen ticket
    });
  });

  // Kitchen ticket
  function fetchKitchenOrders() {
    fetch("http://localhost:3000/orders")
      .then(res => res.json())
      .then(data => {
        kitchenOrdersList.innerHTML = "";
        data.forEach(order => {
          const li = document.createElement("li");
          li.textContent = `${order.quantity} x ${order.item} (Table ${order.table})`;
          kitchenOrdersList.appendChild(li);
        });
      });
  }

  refreshBtn.addEventListener("click", fetchKitchenOrders);
  fetchKitchenOrders();

  // Manager login
  loginBtn.addEventListener("click", () => {
    const pass = passwordInput.value.trim();
    if (pass === "clubit2025") {
      managerLogin.style.display = "none";
      managerPanel.style.display = "block";
    } else {
      loginMsg.textContent = "Incorrect password.";
    }
  });

  // Inventory
  function loadInventory() {
    fetch("http://localhost:3000/inventory")
      .then(res => res.json())
      .then(data => {
        inventoryData = data;
        renderInventory(data);
      });
  }

  function renderInventory(data) {
    inventoryList.innerHTML = "";
    data.forEach(item => {
      let badgeClass = "green";
      if (item.stock < 10) badgeClass = "red";
      else if (item.stock < 20) badgeClass = "yellow";

      const li = document.createElement("li");
      li.innerHTML = `
        <b>${item.name}</b> — 
        <input type="number" value="${item.stock}" data-id="${item.id}" class="stock-input" />
        <span class="badge ${badgeClass}">${item.stock}</span>
        <button data-id="${item.id}" class="update-btn">Update</button>
        <button data-id="${item.id}" class="delete-btn">Delete</button>
      `;
      inventoryList.appendChild(li);
    });
  }

  // Filter
  filterInput.addEventListener("input", () => {
    const query = filterInput.value.toLowerCase();
    const filtered = inventoryData.filter(i => i.name.toLowerCase().includes(query));
    renderInventory(filtered);
  });

  // CSV Export
  exportBtn.addEventListener("click", () => {
    const rows = [["ID", "Name", "Stock"]];
    inventoryData.forEach(item => {
      rows.push([item.id, item.name, item.stock]);
    });
    const csvContent = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Add new item
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("newName").value;
    const stock = parseInt(document.getElementById("newStock").value);

    fetch("http://localhost:3000/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, stock })
    }).then(() => {
      addItemForm.reset();
      loadInventory();
    });
  });

  // Update/Delete inventory
  inventoryList.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");

    if (e.target.classList.contains("update-btn")) {
      const input = e.target.parentElement.querySelector(".stock-input");
      const stock = parseInt(input.value);
      fetch(`http://localhost:3000/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock })
      }).then(loadInventory);
    }

    if (e.target.classList.contains("delete-btn")) {
      fetch(`http://localhost:3000/inventory/${id}`, {
        method: "DELETE"
      }).then(loadInventory);
    }
  });

  loadInventory();
});
