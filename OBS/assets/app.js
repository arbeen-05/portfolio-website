
/* ========== OBS Shared Utilities ========== */
const OBS_KEYS = {
  USERS: 'obs_users',
  SESSION: 'obs_session',
  STOCK: 'obs_stock',
  TXNS: 'obs_transactions',
  COMPANY: 'obs_company'
};
function getJSON(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch(e){ return fallback; }
}
function setJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function nowStamp(){
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function requireAuth(){
  const s = getJSON(OBS_KEYS.SESSION, null);
  if(!s || !s.username){
    window.location.href = 'obs_login.html?next=' + encodeURIComponent(location.pathname.split('/').pop());
  }
  return s;
}
function uid(){
  const rand = Math.random().toString(36).slice(2,6).toUpperCase();
  return `OBS-${Date.now()}-${rand}`;
}
function money(n){
  if(isNaN(n)) return '0.00';
  return Number(n).toFixed(2);
}
function toast(msg, type='info'){
  const t = document.createElement('div');
  t.textContent = msg;
  t.className = 'toast ' + type;
  Object.assign(t.style, {
    position:'fixed',bottom:'24px',right:'24px',padding:'12px 14px',
    background:type==='error'?'#ef4444':(type==='success'?'#22c55e':'#0ea5e9'),
    color:'#03121f',borderRadius:'12px',fontWeight:'700',boxShadow:'0 10px 20px #0006',zIndex:9999
  });
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2200);
}
/* ========== Auth Helpers ========== */
function registerUser(username, password, displayName){
  const users = getJSON(OBS_KEYS.USERS, []);
  if(users.find(u=>u.username===username)) return {ok:false, msg:'Username already exists'};
  users.push({username, password, displayName});
  setJSON(OBS_KEYS.USERS, users);
  return {ok:true};
}
function loginUser(username, password){
  const users = getJSON(OBS_KEYS.USERS, []);
  const u = users.find(u=>u.username===username && u.password===password);
  if(!u) return {ok:false, msg:'Invalid credentials'};
  setJSON(OBS_KEYS.SESSION, {username:u.username, displayName:u.displayName});
  return {ok:true, user:u};
}
function logout(){
  localStorage.removeItem(OBS_KEYS.SESSION);
  window.location.href = 'obs_login.html';
}
/* ========== Company Details ========== */
function saveCompanyDetails(data){
  setJSON(OBS_KEYS.COMPANY, data);
}
function getCompanyDetails(){
  return getJSON(OBS_KEYS.COMPANY, {name:'', address:'', pan:''});
}
/* ========== Stock ========== */
function getStock(){ return getJSON(OBS_KEYS.STOCK, []); }
function setStock(s){ setJSON(OBS_KEYS.STOCK, s); }
function upsertStock(item){ // item: {code, name, rate}
  const s = getStock();
  const idx = s.findIndex(x=>x.code===item.code);
  if(idx>=0) s[idx] = item; else s.push(item);
  setStock(s); return true;
}
function deleteStock(code){
  setStock(getStock().filter(x=>x.code!==code));
}
function findStockByCode(code){
  return getStock().find(x=>x.code===code) || null;
}
/* ========== Transactions ========== */
function getTxns(){ return getJSON(OBS_KEYS.TXNS, []); }
function setTxns(t){ setJSON(OBS_KEYS.TXNS, t); }
function saveTxn(txn){ // txn object with full details
  const t = getTxns(); t.push(txn); setTxns(t); return true;
}
function searchTxns({name='', billNo='', txnId=''}){
  name = name.trim().toLowerCase(); billNo = billNo.trim().toLowerCase(); txnId = txnId.trim().toLowerCase();
  return getTxns().filter(tx=>{
    const byName = name? (tx.customer?.name||'').toLowerCase().includes(name) : true;
    const byBill = billNo? String(tx.billNo||'').toLowerCase().includes(billNo) : true;
    const byId = txnId? String(tx.txnId||'').toLowerCase().includes(txnId) : true;
    return byName && byBill && byId;
  }).sort((a,b)=>b.createdAt - a.createdAt);
}
/* Download text helper */
function downloadText(filename, text){
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
