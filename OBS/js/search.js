function searchTransaction(){
  let id=document.getElementById('searchId').value;
  let txns=JSON.parse(localStorage.getItem('obs_transactions')||'[]');
  let txn=txns.find(x=>x.id===id);
  if(txn) document.getElementById('searchResult').innerHTML=txn.html;
  else document.getElementById('searchResult').innerHTML='Not found';
}