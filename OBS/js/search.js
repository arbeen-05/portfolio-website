function searchTransaction(){
  const id=document.getElementById('searchId').value.trim();
  const txns=JSON.parse(localStorage.getItem('obs_transactions')||'[]');
  const txn=txns.find(x=>x.id===id);
  const out=document.getElementById('searchResult');
  if(txn){ out.innerHTML=txn.html; } else { out.innerHTML='<div class="notice">Not found</div>'; }
}
function listRecent(){
  const txns=(JSON.parse(localStorage.getItem('obs_transactions')||'[]')).slice(-50).reverse();
  let html='<table class="table"><thead><tr><th>Txn ID</th><th>Buyer</th><th>Total</th><th>Date</th></tr></thead><tbody>';
  txns.forEach(t=>{ html+=`<tr onclick="document.getElementById('searchId').value='${t.id}'; searchTransaction()"><td>${t.id}</td><td>${t.buyer||''}</td><td>${(t.total||0).toFixed(2)}</td><td>${t.when||''}</td></tr>`; });
  html+='</tbody></table>';
  document.getElementById('recentList').innerHTML=html;
}
window.addEventListener('load', listRecent);
