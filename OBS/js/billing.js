function getStock(){ return JSON.parse(localStorage.getItem('obs_stock')||'[]'); }
function findByCode(code){ const s=getStock(); return s.find(x=>String(x.code).toLowerCase()===String(code).toLowerCase()); }
function loadCompany(){ return JSON.parse(localStorage.getItem('obs_company')||'{}'); }
function pad(n){ return String(n).padStart(2,'0'); }
function fileStamp(){ const d=new Date(); return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds()); }
function currency(n){ return Number(n||0).toFixed(2); }

function addItemRow(prefill){
  const wrap=document.getElementById('items');
  const row=document.createElement('div'); row.className='grid grid-3 item-row card'; row.style.padding='10px';
  row.innerHTML = `
    <div><label>Code</label><input class="it-code" placeholder="Scan or enter code" value="${prefill?.code||''}"></div>
    <div><label>Name</label><input class="it-name" placeholder="Item name" value="${prefill?.name||''}"></div>
    <div><label>Rate</label><input class="it-rate" type="number" placeholder="0" value="${prefill?.rate||''}"></div>
    <div><label>Qty</label><input class="it-qty" type="number" placeholder="1" value="${prefill?.qty||1}"></div>
    <div style="align-self:end"><button class="btn ghost" onclick="removeRow(this)">Remove</button></div>
  `;
  wrap.appendChild(row);

  const code = row.querySelector('.it-code');
  const name = row.querySelector('.it-name');
  const rate = row.querySelector('.it-rate');
  const qty = row.querySelector('.it-qty');

  const autofill = ()=>{ const found = findByCode(code.value.trim()); if(found){ name.value = found.name; rate.value = found.rate; } recalc(); };
  code.addEventListener('input', autofill);
  [name,rate,qty].forEach(el=>el.addEventListener('input', recalc));
  if(prefill?.code) autofill(); recalc();
}

function removeRow(btn){ btn.closest('.item-row').remove(); recalc(); }

function renderStockSide(){
  const el=document.getElementById('stockSide');
  const s=getStock();
  let html='<table class="table"><thead><tr><th>Code</th><th>Name</th><th>Rate</th><th>Qty</th></tr></thead><tbody>';
  s.forEach(it=> html += `<tr onclick="addItemRow({code:'${String(it.code).replace(/'/g,'&#39;')}',name:'${String(it.name).replace(/'/g,'&#39;')}',rate:${it.rate},qty:1})">
    <td>${it.code}</td><td>${it.name}</td><td>${it.rate}</td><td>${it.qty}</td></tr>`);
  html += '</tbody></table>'; el.innerHTML = html;
}

function recalc(){
  const rows = [...document.querySelectorAll('.item-row')];
  let subtotal = 0;
  const lines = [];
  rows.forEach(r=>{
    const code = r.querySelector('.it-code').value.trim();
    const name = r.querySelector('.it-name').value.trim();
    const rate = Number(r.querySelector('.it-rate').value||0);
    const qty = Number(r.querySelector('.it-qty').value||0);
    if(!name || !qty) return;
    const amt = rate * qty; subtotal += amt;
    lines.push({code,name,rate,qty,amt});
  });

  const disc = Number(document.getElementById('discount').value||0);
  const afterDisc = subtotal - (subtotal * disc / 100);
  const vat = Number(document.getElementById('vat').value||0);
  const vatAmt = afterDisc * vat / 100;
  const grand = afterDisc + vatAmt;

  document.getElementById('liveSubtotal').textContent = currency(subtotal);
  document.getElementById('liveAfterDisc').textContent = currency(afterDisc);
  document.getElementById('liveVatAmt').textContent = currency(vatAmt);
  document.getElementById('liveGrand').textContent = currency(grand);
  const totalBox = document.getElementById('total'); if(totalBox) totalBox.value = currency(grand);

  return {lines, subtotal, afterDisc, vatAmt, grand, disc, vat};
}

function nextTxnId(){ const n = Number(localStorage.getItem('obs_lastTxn')||0) + 1; localStorage.setItem('obs_lastTxn', String(n)); return 'TXN-' + String(n).padStart(6,'0'); }
function saveTransaction(obj){ const list = JSON.parse(localStorage.getItem('obs_transactions')||'[]'); list.push(obj); localStorage.setItem('obs_transactions', JSON.stringify(list)); }

function buildBillHTML(txn, when, buyer, lines, totals, method, seller){
  const c = loadCompany();
  const rows = lines.map(l=>`<tr><td>${l.code||''}</td><td>${l.name}</td><td>${currency(l.rate)}</td><td>${l.qty}</td><td>${currency(l.amt)}</td></tr>`).join('');
  return `
    <div id="printBill">
      <h2>${c.name||'Your Company'}</h2>
      <div class="meta">${c.address||''} • PAN: ${c.pan||''} • ${c.contact||''}</div>
      <div class="meta" style="margin-top:10px;"><div><b>Buyer:</b> ${buyer.name||'-'}<br><span style="color:#2b4857">${buyer.address||''}</span></div><div><b>Txn ID:</b> ${txn}<br><b>Date:</b> ${when}</div></div>
      <table><thead><tr><th>Code</th><th>Item</th><th>Rate</th><th>Qty</th><th>Amount</th></tr></thead><tbody>
      ${rows || '<tr><td colspan="5">No items</td></tr>'}
      </tbody>
      <tfoot>
        <tr><td colspan="4">Subtotal</td><td>${currency(totals.subtotal)}</td></tr>
        <tr><td colspan="4">Discount (${totals.disc}%)</td><td>- ${currency(totals.subtotal * totals.disc / 100)}</td></tr>
        <tr><td colspan="4">After Discount</td><td>${currency(totals.afterDisc)}</td></tr>
        <tr><td colspan="4">VAT (${totals.vat}%)</td><td>${currency(totals.vatAmt)}</td></tr>
        <tr><td colspan="4">Grand Total</td><td id="grandTotal" data-value="${totals.grand}">${currency(totals.grand)}</td></tr>
        <tr><td colspan="4">Payment Method</td><td>${method}</td></tr>
      </tfoot></table>
      <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="qrSmall"><img src="images/qr.jpg" alt="QR" style="width:100%;height:100%;object-fit:contain"></div><div style="font-weight:700">Printed by: ${seller}</div></div>
    </div>
  `;
}

function downloadTxtFile(filename, text){ const blob = new Blob([text], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

function generateBill(){
  const res = recalc();
  const buyer = { name: document.getElementById('custName').value.trim(), address: document.getElementById('custAddress').value.trim() };
  const payMethod = document.getElementById('payment').value;
  const seller = localStorage.getItem('obs_currentUser') || 'Unknown';
  const txn = nextTxnId();
  const when = new Date().toLocaleString();
  const lines = res.lines.map(l=>({code:l.code,name:l.name,rate:l.rate,qty:l.qty,amt:l.amt}));
  const totals = { subtotal: res.subtotal, disc: res.disc, afterDisc: res.afterDisc, vat: res.vat, vatAmt: res.vatAmt, grand: res.grand };
  const html = buildBillHTML(txn, when, buyer, lines, totals, payMethod, seller);
  document.getElementById('billOutput').innerHTML = html;
  document.getElementById('total').value = currency(res.grand);
  saveTransaction({ id: txn, html: html, total: res.grand, buyer: buyer.name, address: buyer.address, when: when, seller: seller, method: payMethod });
  const stamp = fileStamp(); const filename = stamp + txn + '.txt';
  let txt = `Transaction ID: ${txn}\nDate: ${when}\nCompany: ${(loadCompany().name||'')}\nBuyer: ${buyer.name}\nAddress: ${buyer.address}\n\nItems:\n`; res.lines.forEach(li=> txt += ` - [${li.code||''}] ${li.name} x ${li.qty} @ ${currency(li.rate)} = ${currency(li.amt)}\n`); txt += `\nSubtotal: ${currency(res.subtotal)}\nDiscount (${res.disc}%): -${currency(res.subtotal * res.disc / 100)}\nAfter Discount: ${currency(res.afterDisc)}\nVAT (${res.vat}%): ${currency(res.vatAmt)}\nGrand Total: ${currency(res.grand)}\nPayment: ${payMethod}\nPrinted by: ${seller}\n`;
  downloadTxtFile(filename, txt);
  alert('Bill generated: ' + txn + '\nSaved as: ' + filename);
}

window.addEventListener('load', ()=>{ addItemRow({qty:1}); renderStockSide(); document.getElementById('payment').addEventListener('change', ()=>{ document.getElementById('onlineFields').style.display = (document.getElementById('payment').value==='Online') ? 'block':'none'; }); document.getElementById('discount').addEventListener('input', recalc); document.getElementById('vat').addEventListener('input', recalc); });
