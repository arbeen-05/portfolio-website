function getStock(){ return JSON.parse(localStorage.getItem('obs_stock')||'[]'); }
function setStock(s){ localStorage.setItem('obs_stock', JSON.stringify(s)); }

function addStock(){
  const code=document.getElementById('itemCode').value.trim();
  const name=document.getElementById('itemName').value.trim();
  const rate=Number(document.getElementById('itemRate').value||0);
  const qty=Number(document.getElementById('itemQty').value||0);
  if(!code||!name){ alert('Code and Name required'); return; }
  const s=getStock();
  const idx=s.findIndex(x=>String(x.code).toLowerCase()===code.toLowerCase());
  if(idx>-1){
    // update
    s[idx].name=name; s[idx].rate=rate; s[idx].qty=(Number(s[idx].qty)||0)+qty;
  }else{
    s.push({code,name,rate,qty});
  }
  setStock(s); document.getElementById('stockForm').reset(); showStock();
}

function editRow(i){
  const s=getStock(); const it=s[i];
  const name=prompt('Edit name', it.name); if(name===null) return;
  const rate=prompt('Edit rate', it.rate); if(rate===null) return;
  const qty=prompt('Edit quantity', it.qty); if(qty===null) return;
  it.name=name; it.rate=Number(rate)||0; it.qty=Number(qty)||0; setStock(s); showStock();
}
function removeRow(i){
  const s=getStock(); if(!confirm('Remove item '+s[i].name+'?')) return; s.splice(i,1); setStock(s); showStock();
}
function showStock(){
  const s=getStock();
  let html='<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th><th>Rate</th><th>Qty</th><th>Actions</th></tr></thead><tbody>';
  s.forEach((it,idx)=>{
    html+=`<tr><td>${idx+1}</td><td>${it.code}</td><td>${it.name}</td><td>${it.rate}</td><td>${it.qty}</td>
      <td><button onclick="editRow(${idx})">Edit</button> <button class="ghost" onclick="removeRow(${idx})">Remove</button></td></tr>`;
  });
  html+='</tbody></table>';
  document.getElementById('stockList').innerHTML=html;
}
window.addEventListener('load', showStock);
