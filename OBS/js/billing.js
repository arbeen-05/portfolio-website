
function currency(n){ return Number(n||0).toFixed(2); }
function todayString(){
  const d = new Date();
  return d.toLocaleString(undefined, {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'});
}
function addItemRow(data){
  const row = document.createElement('div');
  row.className = 'grid grid-3';
  row.innerHTML = `
    <div><label>Item</label><input type="text" class="it-name" value="${data?.name||''}" placeholder="Item name"></div>
    <div><label>Rate</label><input type="number" class="it-rate" value="${data?.rate||''}" placeholder="0"></div>
    <div><label>Qty</label><input type="number" class="it-qty" value="${data?.qty||1}" placeholder="1"></div>
  `;
  document.getElementById('items').appendChild(row);
}
function togglePaymentFields(){
  const val = document.getElementById('payment').value;
  document.getElementById('cashFields').style.display = (val==='Cash')?'block':'none';
  document.getElementById('onlineFields').style.display = (val==='Online')?'block':'none';
}
function recalcChange(){
  const total = Number(document.getElementById('grandTotal').dataset.value||0);
  const given = Number(document.getElementById('given').value||0);
  document.getElementById('change').value = currency(given - total);
}
function loadCompany(){ return JSON.parse(localStorage.getItem('obs_company')||'{}'); }
function nextTxnId(){
  const n = (Number(localStorage.getItem('obs_lastTxn')||0) + 1);
  localStorage.setItem('obs_lastTxn', String(n));
  return 'TXN-' + n.toString().padStart(6,'0');
}
function saveTransaction(txn){
  const list = JSON.parse(localStorage.getItem('obs_transactions')||'[]');
  list.push(txn);
  localStorage.setItem('obs_transactions', JSON.stringify(list));
}
function calcAndRenderBill(){
  const custName = document.getElementById('custName').value.trim();
  const custAddress = document.getElementById('custAddress').value.trim();
  const vat = Number(document.getElementById('vat').value||0);
  const disc = Number(document.getElementById('discount').value||0);
  const seller = localStorage.getItem('obs_currentUser') || 'Unknown';
  const method = document.getElementById('payment').value;

  const rows = [...document.querySelectorAll('#items .grid-3')];
  let subtotal = 0;
  let lineRows = '';
  rows.forEach(r=>{
    const name = r.querySelector('.it-name').value.trim();
    const rate = Number(r.querySelector('.it-rate').value||0);
    const qty = Number(r.querySelector('.it-qty').value||0);
    if(!name || !qty) return;
    const amt = rate*qty;
    subtotal += amt;
    lineRows += `<tr><td>${name}</td><td>${currency(rate)}</td><td>${qty}</td><td>${currency(amt)}</td></tr>`;
  });
  const vatAmt = subtotal*vat/100;
  const discAmt = subtotal*disc/100;
  const total = subtotal + vatAmt - discAmt;

  const company = loadCompany();
  const txnId = nextTxnId();
  const when = todayString();

  const html = `
    <div id="printBill">
      <h2>${company.name||'Your Company'}</h2>
      <div class="muted">${company.address||''} • PAN: ${company.pan||''} • ${company.contact||''} ${company.email?('• '+company.email):''}</div>
      <div class="meta"><div><b>Buyer:</b> ${custName||'-'}<br><span class="muted">${custAddress||''}</span></div><div><b>Txn ID:</b> ${txnId}<br><b>Date:</b> ${when}</div></div>
      <table>
        <thead><tr><th>Item</th><th>Rate</th><th>Qty</th><th>Amount</th></tr></thead>
        <tbody>${lineRows || '<tr><td colspan="4">No items</td></tr>'}</tbody>
        <tfoot>
          <tr><td colspan="3">Subtotal</td><td>${currency(subtotal)}</td></tr>
          <tr><td colspan="3">VAT (${vat}%)</td><td>${currency(vatAmt)}</td></tr>
          <tr><td colspan="3">Discount (${disc}%)</td><td>-${currency(discAmt)}</td></tr>
          <tr><td colspan="3">Grand Total</td><td id="grandTotal" data-value="${total}">${currency(total)}</td></tr>
          <tr><td colspan="3">Payment Method</td><td>${method}</td></tr>
        </tfoot>
      </table>
      <div class="bottom-right">Printed by: ${seller}</div>
    </div>
  `;

  document.getElementById('billOutput').innerHTML = html;
  document.getElementById('total').value = currency(total);
  saveTransaction({ id: txnId, html, total, buyer: custName, address: custAddress, when, seller, method });
  if(method==='Cash'){ recalcChange(); }
  return txnId;
}
function generateBill(){ const txnId = calcAndRenderBill(); alert('Bill generated: ' + txnId); }
window.addEventListener('load', ()=>{
  addItemRow({qty:1});
  document.getElementById('payment').addEventListener('change', togglePaymentFields);
  const given = document.getElementById('given'); if(given){ given.addEventListener('input', recalcChange); }
  togglePaymentFields();
});
