let urlProducts = "http://localhost:3000/products";

//function to query all products
async function getAllProducts() {
  //request header
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }
  let response = await fetch("http://localhost:3000/products", {
    //request type
    method: "GET",
    //add header
    headers: headersList
  });


  //conversion of response to json
  let products = await response.json();
  console.log(products);

  var container = document.getElementById("container");
  container.innerHTML = "";
  //loop to display products
  products.forEach(product => {
    tableLoad(product);
  });


}

async function getFindByIdProduct() {
  var input = document.getElementById("idFilter");
  var id = input.value.trim();
  let response = await fetch(urlProducts + "/" + id);
  let product = await response.json();
  var container = document.getElementById("container");
  container.innerHTML = "";
  tableLoad(product);
  input.value = "";
}

async function getFindByTitleProduct() {
  var input = document.getElementById("titleFilter");
  var title = input.value.trim();
  let response = await fetch(urlProducts + "?title=" + title);
  let products = await response.json();
  var container = document.getElementById("container");
  container.innerHTML = "";
  products.forEach(product => {
    tableLoad(product);
  });
  input.value = "";
}

async function getFindByPriceProduct() {
  var input = document.getElementById("priceFilter");
  var price = input.value.trim();
  let response = await fetch(urlProducts + "?price=" + price);
  let products = await response.json();
  var container = document.getElementById("container");
  container.innerHTML = "";
  products.forEach(product => {
    tableLoad(product);
  });
  input.value = "";
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
      getAllProducts(); // Refresh the list
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('RegisterModal'));
      modal.hide();
    })
    .catch(error => console.error("Error registering product:", error));
}

function tableLoad(product) {
  //capture container
  var container = document.getElementById("container");


  //creation of table structure    
  var register = document.createElement("tr");
  var cellId = document.createElement("td");
  var cellTitle = document.createElement("td");
  var cellPrice = document.createElement("td");
  var cellOptions = document.createElement("td");

  //display data in cells
  cellId.innerText = product.id;
  cellTitle.innerText = product.title;
  cellPrice.innerText = product.price;
  cellOptions.innerHTML = "<button class='btn btn-danger' onclick='deleteProduct(event, \"" + product.id + "\")'>Delete</button> \
<button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#UpdateModal' onclick='loadUpdateData(\"" + product.id + "\")'>Update</button>";

  //structure to add elements
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

  container.innerHTML='';
  getAllProducts();
};


function loadUpdateData(id) {
  // Fetch product data and populate the update form
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
    getAllProducts(); // Refresh the list
    // Close the modal
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
    getAllProducts(); // Refresh the list
    // Clear the inputs
    document.getElementById("nameRegister").value = "";
    document.getElementById("priceRegister").value = "";
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('RegisterModal'));
    modal.hide();
  } else {
    console.error("Error registering product");
  }
}
