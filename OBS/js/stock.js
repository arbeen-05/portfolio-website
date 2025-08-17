function addStock(){
  let n=document.getElementById('itemName').value;
  let r=document.getElementById('itemRate').value;
  let q=document.getElementById('itemQty').value;
  let stock=JSON.parse(localStorage.getItem('obs_stock')||'[]');
  stock.push({name:n,rate:r,qty:q});
  localStorage.setItem('obs_stock',JSON.stringify(stock));
  showStock();
}
function showStock(){
  let stock=JSON.parse(localStorage.getItem('obs_stock')||'[]');
  let html='<table border=1><tr><th>Name</th><th>Rate</th><th>Qty</th></tr>';
  stock.forEach(s=>{ html+='<tr><td>'+s.name+'</td><td>'+s.rate+'</td><td>'+s.qty+'</td></tr>'; });
  html+='</table>'; document.getElementById('stockList').innerHTML=html;
}
window.onload=showStock;