
let products = JSON.parse(localStorage.getItem("products") || "[]");
const addForm = document.getElementById("addProductForm");
if(addForm){
    addForm.addEventListener("submit", function(e){
        e.preventDefault();
        let name = document.getElementById("productName").value;
        let rate = parseFloat(document.getElementById("productRate").value);
        let stock = parseInt(document.getElementById("productStock").value);
        products.push({name,rate,stock});
        localStorage.setItem("products", JSON.stringify(products));
        alert("Product Added!");
        addForm.reset();
    });
}

const productSelect = document.getElementById("productSelect");
const editName = document.getElementById("editName");
const editRate = document.getElementById("editRate");
const editStock = document.getElementById("editStock");
const updateBtn = document.getElementById("updateProduct");
if(productSelect){
    function loadProducts(){
        productSelect.innerHTML = "";
        products.forEach((p,i)=>{
            let option = document.createElement("option");
            option.value=i;
            option.text=p.name;
            productSelect.add(option);
        });
    }
    loadProducts();
    productSelect.addEventListener("change", function(){
        let i = productSelect.value;
        if(products[i]){
            editName.value = products[i].name;
            editRate.value = products[i].rate;
            editStock.value = products[i].stock;
        }
    });
    updateBtn.addEventListener("click", function(){
        let i = productSelect.value;
        products[i].name = editName.value;
        products[i].rate = parseFloat(editRate.value);
        products[i].stock = parseInt(editStock.value);
        localStorage.setItem("products", JSON.stringify(products));
        alert("Product Updated!");
        loadProducts();
    });
}
