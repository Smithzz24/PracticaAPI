let urlProducts = "http://localhost:3000/products";


async function getAllProducts() {
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }
  let response = await fetch(urlProducts, {
    method: "GET",
    headers: headersList
  });


  let products = await response.json();
  console.log(products);

  var container = document.getElementById("container");
  container.innerHTML = "";
  products.forEach(product => {
    tableLoad(product);
  });


}
async function getFindProduct(event) {
  event.preventDefault();
  var input = document.getElementById("searchProductInput");
  var search = input.value.trim();
  var select = document.getElementById("selectFilter").value;
  let response;
  switch (select) {
    case "id":
      response = await fetch(urlProducts + "/" + search);
      break;
    case "name":
      response = await fetch(urlProducts + "?title=" + search);
      break;
    case "price":
      let min = Number(search);
      let max = min + 0.99;

      response = await fetch(urlProducts + "?price_gte=" + min + "&price_lte=" + max);
      break;
    default:
      alert("Select a filter");
      return;
  }
  let products = await response.json();
  var container = document.getElementById("container");
  container.innerHTML = "";
  if (!Array.isArray(products)) {
    tableLoad(products);
    console.log(products);
  } else {
    products.forEach(product => {
      tableLoad(product);
    });
  }
  input.value = "";
  select.value = "";
}

function registerProduct() {
  const title = document.getElementById("nameRegister").value;
  const price = document.getElementById("priceRegister").value;

  fetch(urlProducts, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, price }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Product registered:", data);
      getAllProducts();
      const modal = bootstrap.Modal.getInstance(document.getElementById('RegisterModal'));
      modal.hide();
    })
    .catch(error => console.error("Error registering product:", error));
}

function tableLoad(product) {
  var container = document.getElementById("container");
  var register = document.createElement("tr");
  var cellId = document.createElement("td");
  var cellTitle = document.createElement("td");
  var cellPrice = document.createElement("td");
  var cellOptions = document.createElement("td");
  cellId.innerText = product.id;
  cellTitle.innerText = product.title;
  cellPrice.innerText = product.price;
  cellOptions.innerHTML = "<button class='btn btn-danger' onclick='deleteProduct(event, \"" + product.id + "\")'>Delete</button> \
<button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#UpdateModal' onclick='loadUpdateData(\"" + product.id + "\")'>Update</button>";

  register.appendChild(cellId);
  register.appendChild(cellTitle);
  register.appendChild(cellPrice);
  register.appendChild(cellOptions);
  container.appendChild(register);
}

async function deleteProduct(event, id) {
  event.preventDefault();
  let response = await fetch(urlProducts + "/" + id, {
    method: "DELETE",
  });

  console.log("Product " + id + " deleted");

  container.innerHTML = '';
  getAllProducts();
};


function loadUpdateData(id) {
  fetch(urlProducts + "/" + id)
    .then(response => response.json())
    .then(product => {
      document.getElementById("idUpdate").value = product.id;
      document.getElementById("nameUpdate").value = product.title;
      document.getElementById("priceUpdate").value = product.price;
    })
    .catch(error => console.error("Error loading product data:", error));
}

async function updateProduct(event) {
  event.preventDefault();
  const id = document.getElementById("idUpdate").value;
  const title = document.getElementById("nameUpdate").value;
  const price = document.getElementById("priceUpdate").value;

  const response = await fetch(urlProducts + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, price }),
  });

  if (response.ok) {
    console.log("Product updated successfully");
    getAllProducts();
    const modal = bootstrap.Modal.getInstance(document.getElementById('UpdateModal'));
    modal.hide();
  } else {
    console.error("Error updating product");
  }
}

async function registerProduct() {
  const title = document.getElementById("nameRegister").value;
  const price = document.getElementById("priceRegister").value;

  const response = await fetch(urlProducts, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, price }),
  });

  if (response.ok) {
    console.log("Product registered successfully");
    getAllProducts();
    document.getElementById("nameRegister").value = "";
    document.getElementById("priceRegister").value = "";
    const modal = bootstrap.Modal.getInstance(document.getElementById('RegisterModal'));
    modal.hide();
  } else {
    console.error("Error registering product");
  }
}
