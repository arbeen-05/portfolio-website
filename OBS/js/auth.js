function login(){
  let u=document.getElementById('username').value;
  let p=document.getElementById('password').value;
  let users=JSON.parse(localStorage.getItem('obs_users')||'[]');
  let user=users.find(x=>x.username===u && x.password===p);
  if(user){ localStorage.setItem('obs_currentUser',u); window.location='obs_dashboard.html'; }
  else alert('Invalid');
}
function register(){
  let u=document.getElementById('username').value;
  let p=document.getElementById('password').value;
  let users=JSON.parse(localStorage.getItem('obs_users')||'[]');
  users.push({username:u,password:p});
  localStorage.setItem('obs_users',JSON.stringify(users));
  alert('Registered! Now login.');
}
function logout(){ localStorage.removeItem('obs_currentUser'); }