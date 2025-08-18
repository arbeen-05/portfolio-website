function loadCompany(){ return JSON.parse(localStorage.getItem('obs_company')||'{}'); }
function getStock(){ return JSON.parse(localStorage.getItem('obs_stock')||'[]'); }
function findByCode(code){ const s=getStock(); return s.find(x=>String(x.code).toLowerCase()===String(code).toLowerCase()); }
function currency(n){ return Number(n||0).toFixed(2); }
function nowStr(){
  const d=new Date();
  return d.toLocaleString(undefined,{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

function addItemRow(prefill){
  const wrap=document.getElementById('items');
  const row=document.createElement('div');
  row.className='grid grid-3';
  row.innerHTML=`
    <div><label>Item Code</label><input type="text" class="it-code" placeholder="Scan/Enter code" value="${prefill?.code||''}"></div>
    <div><label>Item Name</label><input type="text" class="it-name" placeholder="Item name" value="${prefill?.name||''}"></div>
    <div><label>Rate</label><input type="number" class="it-rate" placeholder="0" value="${prefill?.rate||''}"></div>
    <div><label>Qty</label><input type="number" class="it-qty" placeholder="1" value="${prefill?.qty||1}"></div>
    <div style="align-self:end"><button type="button" onclick="removeRow(this)" class="ghost">Remove</button></div>
  `;
  wrap.appendChild(row);

  const codeInput=row.querySelector('.it-code');
  const rateInput=row.querySelector('.it-rate');
  const nameInput=row.querySelector('.it-name');
  const qtyInput=row.querySelector('.it-qty');

  const autofill=()=>{
    const item=findByCode(codeInput.value.trim());
    if(item){ nameInput.value=item.name; rateInput.value=item.rate; }
    recalcTotals();
  };
  codeInput.addEventListener('input', autofill);
  [rateInput,nameInput,qtyInput].forEach(el=>el.addEventListener('input', recalcTotals));

  // If prefilled with a code, autofill immediately
  if(prefill?.code){ autofill(); }
  recalcTotals();
}

function removeRow(btn){ btn.closest('.grid-3').remove(); recalcTotals(); }

function renderStockSidebar(){
  const list=document.getElementById('stockSide');
  const stock=getStock();
  let html='<table class="table"><thead><tr><th>Code</th><th>Name</th><th>Rate</th><th>Qty</th></tr></thead><tbody>';
  stock.forEach(s=>{
    html+=`<tr onclick="addItemRow({code:'${String(s.code).replace(/'/g,'&#39;')}',qty:1})" title="Click to add to bill">
      <td>${s.code||''}</td><td>${s.name||''}</td><td>${s.rate||0}</td><td>${s.qty||0}</td></tr>`;
  });
  html+='</tbody></table>';
  list.innerHTML=html;
}

function recalcTotals(){
  const rows=[...document.querySelectorAll('#items .grid-3')];
  let subtotal=0;
  rows.forEach(r=>{
    const rate=Number(r.querySelector('.it-rate').value||0);
    const qty=Number(r.querySelector('.it-qty').value||0);
    subtotal+=rate*qty;
  });
  const disc=Number(document.getElementById('discount').value||0);
  const afterDisc=subtotal - (subtotal*disc/100);
  const vat=Number(document.getElementById('vat').value||0);
  const vatAmt=afterDisc*vat/100;
  const total=afterDisc + vatAmt;

  document.getElementById('liveSubtotal').textContent=currency(subtotal);
  document.getElementById('liveAfterDisc').textContent=currency(afterDisc);
  document.getElementById('liveVatAmt').textContent=currency(vatAmt);
  document.getElementById('liveGrand').textContent=currency(total);
  const totalBox=document.getElementById('total'); if(totalBox) totalBox.value=currency(total);
  const grand=document.getElementById('grandTotal'); if(grand){ grand.dataset.value=total; grand.textContent=currency(total); }

  const pay=document.getElementById('payment').value;
  if(pay==='Cash'){ const given=Number(document.getElementById('given').value||0); document.getElementById('change').value=currency(given-total); }
}

function togglePaymentFields(){
  const val=document.getElementById('payment').value;
  document.getElementById('cashFields').style.display=(val==='Cash')?'grid':'none';
  document.getElementById('onlineFields').style.display=(val==='Online')?'block':'none';
}

function openQrFull(){
  const ov=document.getElementById('qrOverlay');
  ov.style.display='flex';
}
function closeQr(){ document.getElementById('qrOverlay').style.display='none'; }

function nextTxnId(){
  const n=(Number(localStorage.getItem('obs_lastTxn')||0)+1);
  localStorage.setItem('obs_lastTxn',String(n));
  return 'TXN-'+n.toString().padStart(6,'0');
}
function saveTransaction(txn){
  const list=JSON.parse(localStorage.getItem('obs_transactions')||'[]');
  list.push(txn);
  localStorage.setItem('obs_transactions',JSON.stringify(list));
}

function buildBillHTML(txnId, when, lines, totals, buyer, method, seller){
  const c=loadCompany();
  const bodyRows=lines.map(li=>`<tr><td>${li.code||''}</td><td>${li.name}</td><td>${currency(li.rate)}</td><td>${li.qty}</td><td>${currency(li.amount)}</td></tr>`).join('');
  return `
  <div id="printBill">
    <h2>${c.name||'Your Company'}</h2>
    <div class="muted">${c.address||''} • PAN: ${c.pan||''} • ${c.contact||''} ${c.email?('• '+c.email):''}</div>
    <div class="meta"><div><b>Buyer:</b> ${buyer.name||'-'}<br><span class="muted">${buyer.address||''}</span></div><div><b>Txn ID:</b> ${txnId}<br><b>Date:</b> ${when}</div></div>
    <table>
      <thead><tr><th>Code</th><th>Item</th><th>Rate</th><th>Qty</th><th>Amount</th></tr></thead>
      <tbody>${bodyRows || '<tr><td colspan="5">No items</td></tr>'}</tbody>
      <tfoot>
        <tr><td colspan="4">Subtotal</td><td>${currency(totals.subtotal)}</td></tr>
        <tr><td colspan="4">Discount (${totals.disc}%)</td><td>- ${currency(totals.subtotal*totals.disc/100)}</td></tr>
        <tr><td colspan="4">After Discount</td><td>${currency(totals.afterDisc)}</td></tr>
        <tr><td colspan="4">VAT (${totals.vat}%)</td><td>${currency(totals.vatAmt)}</td></tr>
        <tr><td colspan="4">Grand Total</td><td id="grandTotal" data-value="${totals.total}">${currency(totals.total)}</td></tr>
        <tr><td colspan="4">Payment Method</td><td>${method}</td></tr>
      </tfoot>
    </table>
    <div class="bottom-right">Printed by: ${seller}</div>
  </div>`;
}

function downloadTxt(txnId, text){
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=txnId+'.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function generateBill(){
  // collect rows
  const rows=[...document.querySelectorAll('#items .grid-3')];
  const lines=[];
  let subtotal=0;
  rows.forEach(r=>{
    const code=r.querySelector('.it-code').value.trim();
    const name=r.querySelector('.it-name').value.trim();
    const rate=Number(r.querySelector('.it-rate').value||0);
    const qty=Number(r.querySelector('.it-qty').value||0);
    if(!name || !qty) return;
    const amount=rate*qty; subtotal+=amount;
    lines.push({code,name,rate,qty,amount});
  });
  const disc=Number(document.getElementById('discount').value||0);
  const afterDisc=subtotal - (subtotal*disc/100);
  const vat=Number(document.getElementById('vat').value||0);
  const vatAmt=afterDisc*vat/100;
  const total=afterDisc + vatAmt;

  const buyer={ name: document.getElementById('custName').value.trim(), address: document.getElementById('custAddress').value.trim() };
  const method=document.getElementById('payment').value;
  const seller=localStorage.getItem('obs_currentUser')||'Unknown';
  const txnId=nextTxnId();
  const when=nowStr();

  const html=buildBillHTML(txnId, when, lines, {subtotal,disc,afterDisc,vat,vatAmt,total}, buyer, method, seller);
  document.getElementById('billOutput').innerHTML=html;
  document.getElementById('total').value=currency(total);

  // save transaction
  saveTransaction({id:txnId, html, total, buyer:buyer.name, address:buyer.address, when, seller, method});

  // Auto download .txt
  let text=`Transaction ID: ${txnId}
Date: ${when}
Company: ${(loadCompany().name||'')}
Buyer: ${buyer.name}
Address: ${buyer.address}

Items:
`;
  lines.forEach(li=>{ text+=`  - [${li.code}] ${li.name} x ${li.qty} @ ${currency(li.rate)} = ${currency(li.amount)}
`; });
  text+=`
Subtotal: ${currency(subtotal)}
Discount (${disc}%): -${currency(subtotal*disc/100)}
After Discount: ${currency(afterDisc)}
VAT (${vat}%): ${currency(vatAmt)}
Grand Total: ${currency(total)}
Payment: ${method}
Printed by: ${seller}
`;
  downloadTxt(txnId, text);

  alert('Bill generated: '+txnId);
}

function initBilling(){
  addItemRow({qty:1});
  renderStockSidebar();
  document.getElementById('payment').addEventListener('change', togglePaymentFields);
  document.getElementById('given').addEventListener('input', recalcTotals);
  ['discount','vat'].forEach(id=>document.getElementById(id).addEventListener('input', recalcTotals));
  recalcTotals();
  togglePaymentFields();
}

window.addEventListener('load', initBilling);
