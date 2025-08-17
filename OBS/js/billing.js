function addItem(){
  let div=document.createElement('div');
  div.innerHTML='<input type="text" placeholder="Item"><input type="number" placeholder="Rate"><input type="number" placeholder="Qty">';
  document.getElementById('items').appendChild(div);
}
function togglePaymentFields(){
  let val=document.getElementById('payment').value;
  document.getElementById('cashFields').style.display=(val==='Cash')?'block':'none';
  document.getElementById('onlineFields').style.display=(val==='Online')?'block':'none';
}
function generateBill(){
  let name=document.getElementById('custName').value;
  let addr=document.getElementById('custAddress').value;
  let items=document.querySelectorAll('#items div');
  let vat=+document.getElementById('vat').value;
  let disc=+document.getElementById('discount').value;
  let total=0,html='<h2>Bill</h2><p>'+new Date().toLocaleString()+'</p>';
  html+='<p>Customer: '+name+'<br>Address: '+addr+'</p><table border=1><tr><th>Item</th><th>Rate</th><th>Qty</th><th>Amt</th></tr>';
  items.forEach(div=>{
    let i=div.querySelectorAll('input');
    let amt=i[1].value*i[2].value; total+=amt;
    html+='<tr><td>'+i[0].value+'</td><td>'+i[1].value+'</td><td>'+i[2].value+'</td><td>'+amt+'</td></tr>';
  });
  total=total+(total*vat/100)-(total*disc/100);
  html+='</table><h3>Total: '+total+'</h3>';
  let user=localStorage.getItem('obs_currentUser')||'Unknown';
  html+='<p>Printed by: '+user+'</p>';
  document.getElementById('billOutput').innerHTML=html;
  document.getElementById('total').value=total;
}