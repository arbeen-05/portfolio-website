
// Simple client-side billing system using localStorage
const LS = {
  users: 'billing_users',
  current: 'billing_current_user',
  shop: 'billing_shop',
  stock: 'billing_stock',
  bills: 'billing_bills'
};

function uid(){ return 'TX-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8).toUpperCase(); }

function loadJSON(key, def){ try { return JSON.parse(localStorage.getItem(key)) || def; } catch(e){ return def; } }
function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function init(){
  if(!localStorage.getItem(LS.users)) saveJSON(LS.users, {});
  if(!localStorage.getItem(LS.stock)) saveJSON(LS.stock, {});
  if(!localStorage.getItem(LS.bills)) saveJSON(LS.bills, []);
  bindUI();
  refreshStockList();
  refreshTransactions();
  updateCurrentUserUI();
}

function bindUI(){
  document.getElementById('btn-login').addEventListener('click',()=>showModal('login'));
  document.getElementById('btn-shop').addEventListener('click',()=>showShopModal());
  document.getElementById('btn-show-register').addEventListener('click',()=>toggleAuth('register'));
  document.getElementById('btn-show-login').addEventListener('click',()=>toggleAuth('login'));
  document.getElementById('btn-modal-close').addEventListener('click',()=>closeModal());
  document.getElementById('btn-do-register').addEventListener('click',doRegister);
  document.getElementById('btn-do-login').addEventListener('click',doLogin);

  document.getElementById('btn-add-stock').addEventListener('click',addOrUpdateStock);
  document.getElementById('btn-add-item').addEventListener('click',addItemToCart);
  document.getElementById('btn-clear-cart').addEventListener('click',clearCart);
  document.getElementById('btn-save-bill').addEventListener('click',saveAndPrint);
  document.getElementById('btn-save').addEventListener('click',saveBill);
  document.getElementById('payment-method').addEventListener('change',onPaymentChange);
  document.getElementById('amount-given').addEventListener('input',calcReturn);
  document.getElementById('btn-new').addEventListener('click',newBill);
  document.getElementById('btn-search').addEventListener('click',doSearch);
  document.getElementById('search-tx').addEventListener('keypress',(e)=>{ if(e.key==='Enter') doSearch(); });
  document.getElementById('btn-view-trans').addEventListener('click',refreshTransactions);
  document.getElementById('btn-save-shop').addEventListener('click',saveShopDetails);
  document.getElementById('btn-close-shop').addEventListener('click',()=>closeShopModal());
}

function showModal(mode='login'){
  document.getElementById('modal').style.display='flex';
  toggleAuth(mode);
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
function toggleAuth(mode){
  document.getElementById('modal-title').textContent = mode==='login'?'Login':'Register';
  document.getElementById('login-form').style.display = mode==='login'?'block':'none';
  document.getElementById('register-form').style.display = mode==='register'?'block':'none';
}

function doRegister(){
  const u = document.getElementById('reg-user').value.trim();
  const name = document.getElementById('reg-name').value.trim() || u;
  const p = document.getElementById('reg-pass').value;
  if(!u || !p){ alert('username and password required'); return; }
  const users = loadJSON(LS.users,{});
  if(users[u]){ alert('username exists'); return; }
  users[u] = {username:u, name, pass:p};
  saveJSON(LS.users, users);
  alert('Account created. You can now login.');
  toggleAuth('login');
}

function doLogin(){
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const users = loadJSON(LS.users,{});
  if(!users[u] || users[u].pass !== p){ alert('invalid credentials'); return; }
  localStorage.setItem(LS.current, JSON.stringify(users[u]));
  updateCurrentUserUI();
  closeModal();
}

function updateCurrentUserUI(){
  const cur = loadJSON(LS.current, null);
  const el = document.getElementById('current-user');
  el.textContent = cur?cur.name:'Guest';
}

function showShopModal(){
  const shop = loadJSON(LS.shop, {});
  document.getElementById('shop-name').value = shop.name || '';
  document.getElementById('shop-address').value = shop.address || '';
  document.getElementById('shop-pan').value = shop.pan || '';
  document.getElementById('shop-phone').value = shop.phone || '';
  document.getElementById('modal-shop').style.display='flex';
}
function closeShopModal(){ document.getElementById('modal-shop').style.display='none'; }
function saveShopDetails(){
  const shop = {
    name: document.getElementById('shop-name').value.trim(),
    address: document.getElementById('shop-address').value.trim(),
    pan: document.getElementById('shop-pan').value.trim(),
    phone: document.getElementById('shop-phone').value.trim()
  };
  saveJSON(LS.shop, shop);
  alert('Shop details saved.');
  closeShopModal();
}

function addOrUpdateStock(){
  const name = document.getElementById('stock-name').value.trim();
  const rate = parseFloat(document.getElementById('stock-rate').value) || 0;
  const qty = parseFloat(document.getElementById('stock-qty').value) || 0;
  if(!name){ alert('item name required'); return; }
  const stock = loadJSON(LS.stock,{});
  stock[name] = {name, rate, qty};
  saveJSON(LS.stock, stock);
  document.getElementById('stock-name').value=''; document.getElementById('stock-rate').value=''; document.getElementById('stock-qty').value='';
  refreshStockList();
}

function refreshStockList(){
  const stock = loadJSON(LS.stock,{});
  const tbody = document.querySelector('#stock-table tbody');
  tbody.innerHTML='';
  const select = document.getElementById('select-stock');
  select.innerHTML = '<option value="">-- select item --</option>';
  Object.keys(stock).forEach(k=>{
    const it = stock[k];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.name}</td><td>${it.rate}</td><td>${it.qty}</td><td class="actions">
      <button onclick='editStock("${encodeURIComponent(it.name)}")' class="small">Edit</button>
      <button onclick='removeStock("${encodeURIComponent(it.name)}")' class="small">Remove</button></td>`;
    tbody.appendChild(tr);

    const opt = document.createElement('option');
    opt.value = it.name;
    opt.textContent = it.name + ' - ' + it.rate + ' (Stock:'+it.qty+')';
    select.appendChild(opt);
  });
}

function editStock(nameEnc){
  const name = decodeURIComponent(nameEnc);
  const stock = loadJSON(LS.stock,{});
  if(!stock[name]) return;
  document.getElementById('stock-name').value = stock[name].name;
  document.getElementById('stock-rate').value = stock[name].rate;
  document.getElementById('stock-qty').value = stock[name].qty;
}

function removeStock(nameEnc){
  const name = decodeURIComponent(nameEnc);
  if(!confirm('Remove item '+name+'?')) return;
  const stock = loadJSON(LS.stock,{});
  delete stock[name];
  saveJSON(LS.stock, stock);
  refreshStockList();
}

// CART handling
let CART = [];
function addItemToCart(){
  const sel = document.getElementById('select-stock').value;
  const qty = parseFloat(document.getElementById('item-qty').value) || 1;
  if(!sel){ alert('select item'); return; }
  const stock = loadJSON(LS.stock,{});
  const it = stock[sel];
  if(!it){ alert('item not found'); return; }
  const existing = CART.find(c=>c.name===it.name);
  if(existing) existing.qty += qty;
  else CART.push({name:it.name, rate: it.rate, qty: qty});
  renderCart();
}

function renderCart(){
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML='';
  CART.forEach((c,idx)=>{
    const amt = (c.rate*c.qty).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.rate}</td><td>${c.qty}</td><td>${amt}</td><td><button onclick='removeCartItem(${idx})' class="small">X</button></td>`;
    tbody.appendChild(tr);
  });
  recalcTotals();
}

function removeCartItem(i){ CART.splice(i,1); renderCart(); }
function clearCart(){ CART=[]; renderCart(); }

function recalcTotals(){
  const subtotal = CART.reduce((s,i)=>s + (i.rate*i.qty),0);
  const vatP = parseFloat(document.getElementById('vat-percent').value) || 0;
  const discP = parseFloat(document.getElementById('discount-percent').value) || 0;
  const vat = subtotal * (vatP/100);
  const disc = subtotal * (discP/100);
  const total = Math.max(0, subtotal + vat - disc);
  document.getElementById('total-amount').value = total.toFixed(2);
  calcReturn();
}

function onPaymentChange(){
  const v = document.getElementById('payment-method').value;
  document.getElementById('online-qr').style.display = v==='online' ? 'block' : 'none';
}

function calcReturn(){
  const total = parseFloat(document.getElementById('total-amount').value) || 0;
  const given = parseFloat(document.getElementById('amount-given').value) || 0;
  const returned = given - total;
  document.getElementById('amount-returned').value = returned>=0 ? returned.toFixed(2) : '';
}

// Save bill (without print)
function saveBill(){
  if(CART.length===0){ alert('cart empty'); return; }
  const cur = loadJSON(LS.current,null);
  const buyer = document.getElementById('buyer-name').value.trim();
  const addr = document.getElementById('buyer-address').value.trim();
  const shop = loadJSON(LS.shop,{});
  const total = parseFloat(document.getElementById('total-amount').value) || 0;
  const payment = document.getElementById('payment-method').value;
  const bill = {
    id: uid(),
    created: new Date().toISOString(),
    buyer, addr,
    items: CART.slice(),
    vatP: parseFloat(document.getElementById('vat-percent').value)||0,
    discP: parseFloat(document.getElementById('discount-percent').value)||0,
    total,
    payment,
    user: cur?cur.name:'Guest'
  };
  const bills = loadJSON(LS.bills,[]);
  bills.unshift(bill);
  saveJSON(LS.bills, bills);
  alert('Saved. Transaction id: '+bill.id);
  refreshTransactions();
  return bill;
}

function saveAndPrint(){
  const bill = saveBill();
  if(bill) printBill(bill);
}

function printBill(bill){
  const shop = loadJSON(LS.shop,{name:'Shop',address:'',pan:''});
  const cur = loadJSON(LS.current,null);
  const dt = new Date(bill.created);
  const dtStr = dt.toLocaleString();
  let itemsHtml = '<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left">Item</th><th>Rate</th><th>Qty</th><th style="text-align:right">Amount</th></tr>';
  bill.items.forEach(it=>{
    itemsHtml += `<tr><td>${it.name}</td><td>${it.rate}</td><td>${it.qty}</td><td style="text-align:right">${(it.rate*it.qty).toFixed(2)}</td></tr>`;
  });
  itemsHtml += '</table>';
  const printedBy = bill.user || (cur?cur.name:'Guest');
  const html = `
    <div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:12px">
      <div style="text-align:center"><strong>${shop.name || 'Shop Name'}</strong><br>${shop.address||''}<br>PAN: ${shop.pan||''}</div>
      <hr>
      <div>Transaction ID: ${bill.id}</div>
      <div>Buyer: ${bill.buyer||''}</div>
      <div>Address: ${bill.addr||''}</div>
      <div style="margin-top:8px">${itemsHtml}</div>
      <hr>
      <div style="display:flex;justify-content:space-between">
        <div>VAT: ${bill.vatP}%</div>
        <div>Discount: ${bill.discP}%</div>
        <div><strong>Total: ${bill.total.toFixed(2)}</strong></div>
      </div>
      <div style="margin-top:6px">Payment: ${bill.payment}</div>
      <div style="margin-top:12px;display:flex;justify-content:space-between">
        <div>${new Date().toLocaleString()}</div>
        <div>Printed by: ${printedBy}</div>
      </div>
    </div>
  `;
  const printArea = document.getElementById('print-bill');
  printArea.innerHTML = html;
  document.getElementById('print-area').style.display='block';
  setTimeout(()=>{ window.print(); }, 300);
}

// Transactions list
function refreshTransactions(){
  const bills = loadJSON(LS.bills,[]);
  const el = document.getElementById('transactions-list');
  el.innerHTML = '';
  bills.slice(0,40).forEach(b=>{
    const d = new Date(b.created);
    const div = document.createElement('div');
    div.style.padding='8px';
    div.style.borderBottom='1px solid #f0f0f0';
    div.innerHTML = `<strong>${b.id}</strong> | ${b.buyer||''} | ${b.total.toFixed(2)} | ${d.toLocaleString()} 
      <div style="margin-top:6px"><button class="small" onclick='viewBill("${b.id}")'>View</button>
      <button class="small" onclick='deleteBill("${b.id}")'>Delete</button></div>`;
    el.appendChild(div);
  });
}

function viewBill(id){
  const bills = loadJSON(LS.bills,[]);
  const b = bills.find(x=>x.id===id);
  if(!b) return alert('not found');
  printBill(b);
}

function deleteBill(id){
  if(!confirm('Delete transaction '+id+'?')) return;
  let bills = loadJSON(LS.bills,[]);
  bills = bills.filter(x=>x.id!==id);
  saveJSON(LS.bills, bills);
  refreshTransactions();
}

function doSearch(){
  const q = document.getElementById('search-tx').value.trim().toLowerCase();
  if(!q) return refreshTransactions();
  const bills = loadJSON(LS.bills,[]);
  const res = bills.filter(b=> (b.id||'').toLowerCase().includes(q) || (b.buyer||'').toLowerCase().includes(q));
  const el = document.getElementById('transactions-list');
  el.innerHTML = '';
  res.forEach(b=>{
    const d = new Date(b.created);
    const div = document.createElement('div');
    div.style.padding='8px';
    div.style.borderBottom='1px solid #f0f0f0';
    div.innerHTML = `<strong>${b.id}</strong> | ${b.buyer||''} | ${b.total.toFixed(2)} | ${d.toLocaleString()} 
      <div style="margin-top:6px"><button class="small" onclick='viewBill("${b.id}")'>View</button>
      <button class="small" onclick='deleteBill("${b.id}")'>Delete</button></div>`;
    el.appendChild(div);
  });
}

// new bill
function newBill(){
  CART = [];
  renderCart();
  document.getElementById('buyer-name').value='';
  document.getElementById('buyer-address').value='';
  document.getElementById('amount-given').value='';
  document.getElementById('amount-returned').value='';
  document.getElementById('total-amount').value='';
  document.getElementById('online-qr').style.display='none';
}

// expose some functions to window for inline onclick
window.editStock = editStock;
window.removeStock = removeStock;
window.viewBill = viewBill;
window.deleteBill = deleteBill;

init();
