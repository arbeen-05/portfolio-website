const LS = {
  stock:"stock",
  bills:"bills",
  user:"user"
};

let CART=[];

/* ---------- INIT ---------- */
window.onload=()=>{
  if(!localStorage.getItem(LS.stock)) localStorage.setItem(LS.stock,"{}");
  if(!localStorage.getItem(LS.bills)) localStorage.setItem(LS.bills,"[]");

  bind();
  renderStock();
};

/* ---------- BIND ---------- */
function bind(){

document.getElementById("btn-add-item").onclick=addItem;
document.getElementById("add-stock").onclick=addStock;
document.getElementById("save").onclick=saveBill;
document.getElementById("print").onclick=printBill;

document.getElementById("payment-method").onchange=payChange;

/* ENTER SUPPORT */
document.getElementById("item-search").addEventListener("keypress",e=>{
  if(e.key==="Enter") addItem();
});

document.getElementById("login-btn").addEventListener("click",login);

document.getElementById("login-u").addEventListener("keypress",e=>{
  if(e.key==="Enter") login();
});
document.getElementById("login-p").addEventListener("keypress",e=>{
  if(e.key==="Enter") login();
});

}

/* ---------- STOCK ---------- */
function addStock(){
  let stock=JSON.parse(localStorage.getItem(LS.stock));

  let name=sname.value;
  stock[name]={
    name,
    rate:parseFloat(srate.value),
    qty:parseFloat(sqty.value),
    unlimited:sunlimited.checked
  };

  localStorage.setItem(LS.stock,JSON.stringify(stock));
  renderStock();
}

function renderStock(){
  let stock=JSON.parse(localStorage.getItem(LS.stock));
  stockList.innerHTML="";

  Object.values(stock).forEach(s=>{
    stockList.innerHTML+=`
      <div>${s.name} - ${s.rate} - ${s.unlimited?"Unlimited":"Qty:"+s.qty}</div>
    `;
  });
}

/* ---------- CART ---------- */
function addItem(){
  let stock=JSON.parse(localStorage.getItem(LS.stock));
  let key=itemSearch.value.toLowerCase();

  let item=Object.values(stock).find(i=>
    i.name.toLowerCase().includes(key)
  );

  if(!item) return alert("Not found");

  let qty=parseFloat(itemQty.value);

  if(!item.unlimited && item.qty<qty){
    return alert("Not enough stock");
  }

  CART.push({
    name:item.name,
    rate:item.rate,
    qty
  });

  renderCart();
  itemSearch.value="";
}

function renderCart(){
  cart.innerHTML="";
  let total=0;

  CART.forEach(c=>{
    let amt=c.rate*c.qty;
    total+=amt;
    cart.innerHTML+=`<div>${c.name} | ${c.qty} x ${c.rate} = ${amt}</div>`;
  });

  totalBox.value=total;
}

/* ---------- PAYMENT ---------- */
function payChange(){
  if(paymentMethod.value==="online"){
    qr.style.display="block";
    paymentStatus.value="Pending";
  }else{
    qr.style.display="none";
    paymentStatus.value="Paid";
  }
}

/* ---------- BILL ---------- */
function saveBill(){
  let bills=JSON.parse(localStorage.getItem(LS.bills));

  bills.push({
    id:Date.now(),
    items:CART,
    total:totalBox.value,
    payment:paymentMethod.value,
    status:paymentStatus.value
  });

  localStorage.setItem(LS.bills,JSON.stringify(bills));
  alert("Saved");
}

/* ---------- PRINT (1/3 A4) ---------- */
function printBill(){
  let html=`
    <div>
      <h3>Invoice</h3>
      ${CART.map(c=>`<div>${c.name} ${c.qty}x${c.rate}</div>`).join("")}
      <hr>
      Total: ${totalBox.value}
    </div>
  `;

  printArea.innerHTML=html;
  window.print();
}

/* ---------- LOGIN FIX ---------- */
function login(){
  if(loginU.value && loginP.value){
    currentUser.textContent=loginU.value;
    modal.style.display="none";
  }
}