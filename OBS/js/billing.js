
const productsList = JSON.parse(localStorage.getItem("products") || "[]");
const username = localStorage.getItem("username");
const tbody = document.querySelector("#productsTable tbody");
productsList.forEach((p,i)=>{
    let row = tbody.insertRow();
    row.insertCell(0).innerText = p.name;
    row.insertCell(1).innerText = p.rate;
    let qtyCell = row.insertCell(2);
    let qtyInput = document.createElement("input");
    qtyInput.type="number"; qtyInput.value=0; qtyInput.min=0;
    qtyCell.appendChild(qtyInput);
    let amountCell = row.insertCell(3);
    qtyInput.addEventListener("input", function(){
        amountCell.innerText = (qtyInput.value * p.rate).toFixed(2);
        calculateTotal();
    });
});
function calculateTotal(){
    let total=0;
    tbody.querySelectorAll("tr").forEach(row=>{
        let amount = parseFloat(row.cells[3].innerText)||0;
        total += amount;
    });
    document.getElementById("total").innerText=total.toFixed(2);
    let vat = parseFloat(document.getElementById("vat").value)||0;
    let discount = parseFloat(document.getElementById("discount").value)||0;
    let final = total + (total*vat/100) - (total*discount/100);
    document.getElementById("finalTotal").innerText=final.toFixed(2);
    calculateReturn();
}
function showPaymentOptions(){
    let method = document.getElementById("paymentMethod").value;
    document.getElementById("cashDiv").style.display = method=="cash"?"block":"none";
    document.getElementById("onlineDiv").style.display = method=="online"?"block":"none";
}
function calculateReturn(){
    let final = parseFloat(document.getElementById("finalTotal").innerText)||0;
    let given = parseFloat(document.getElementById("amountGiven").value)||0;
    document.getElementById("returnAmount").innerText = (given-final).toFixed(2);
}
function printBill(){
    let billContent = document.querySelector(".billing-container").innerHTML;
    let win = window.open("", "PrintBill");
    win.document.write("<html><head><title>Bill</title></head><body>");
    win.document.write("<h2>Bill</h2>");
    win.document.write(billContent);
    win.document.write("<p>Printed by: "+username+"</p>");
    let date = new Date();
    win.document.write("<p>Date: "+date.toLocaleString()+"</p>");
    win.document.write("</body></html>");
    win.document.close();
    win.print();
}
