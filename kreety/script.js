function nextPage(page){
createHearts();
setTimeout(()=>{window.location.href=page;},800);
}

function playMusic(){
document.getElementById("bgMusic").play();
createHearts();
}

function createHearts(){
for(let i=0;i<15;i++){
let heart=document.createElement("div");
heart.innerHTML="";
heart.className="heart";
heart.style.left=Math.random()*100+"vw";
heart.style.top="80vh";
document.body.appendChild(heart);
setTimeout(()=>heart.remove(),2000);
}
}

const noBtn=document.getElementById("noBtn");
if(noBtn){
noBtn.addEventListener("mouseover",()=>{
noBtn.style.position="absolute";
noBtn.style.left=Math.random()*80+"%";
noBtn.style.top=Math.random()*80+"%";
});
}

const declineBtn=document.getElementById("declineBtn");
if(declineBtn){
declineBtn.addEventListener("click",()=>{
declineBtn.innerText="Say Yes ";
declineBtn.style.background="red";
setTimeout(()=>{
declineBtn.style.display="none";
},1500);
});
}