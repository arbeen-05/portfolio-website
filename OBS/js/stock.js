
function getStock(){ return JSON.parse(localStorage.getItem('obs_stock')||'[]'); }
function setStock(s){ localStorage.setItem('obs_stock', JSON.stringify(s)); }
function addStock(){
  const n = document.getElementById('itemName').value.trim();
  const r = Number(document.getElementById('itemRate').value||0);
  const q = Number(document.getElementById('itemQty').value||0);
  if(!n){ alert('Item name required'); return; }
  const s = getStock();
  const idx = s.findIndex(x=>x.name.toLowerCase()===n.toLowerCase());
  if(idx>-1){ s[idx].rate = r; s[idx].qty = (Number(s[idx].qty)||0) + q; } else { s.push({name:n,rate:r,qty:q}); }
  setStock(s); showStock(); document.getElementById('stockForm').reset();
}
function editRow(i){
  const s=getStock();
  const r=prompt('New rate for '+s[i].name, s[i].rate);
  if(r===null) return;
  const q=prompt('New quantity for '+s[i].name, s[i].qty);
  if(q===null) return;
  s[i].rate = Number(r)||0; s[i].qty = Number(q)||0; setStock(s); showStock();
}
function removeRow(i){
  const s=getStock(); if(!confirm('Remove '+s[i].name+'?')) return; s.splice(i,1); setStock(s); showStock();
}
function showStock(){
  const s=getStock();
  let html = '<table class="table"><thead><tr><th>#</th><th>Name</th><th>Rate</th><th>Qty</th><th>Actions</th></tr></thead><tbody>';
  s.forEach((it,idx)=>{
    html += `<tr><td>${idx+1}</td><td>${it.name}</td><td>${it.rate}</td><td>${it.qty}</td>
             <td class="actions"><button onclick="editRow(${idx})">Edit</button><button class="ghost" onclick="removeRow(${idx})">Remove</button></td></tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('stockList').innerHTML = html;
}
window.addEventListener('load', showStock);
