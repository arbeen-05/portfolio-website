function getUsers(){ return JSON.parse(localStorage.getItem('obs_users')||'[]'); }
function setUsers(u){ localStorage.setItem('obs_users', JSON.stringify(u)); }
function login(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  const users=getUsers();
  const user=users.find(x=>x.username===u && x.password===p);
  if(user){ localStorage.setItem('obs_currentUser',u); location.href='obs_dashboard.html'; }
  else alert('Invalid username or password');
}
function register(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  if(!u||!p){alert('Enter username & password');return;}
  const users=getUsers();
  if(users.some(x=>x.username===u)){alert('Username exists');return;}
  users.push({username:u,password:p,createdAt:new Date().toISOString()});
  setUsers(users); alert('Registered! Now login.');
}
function logout(){ localStorage.removeItem('obs_currentUser'); }
