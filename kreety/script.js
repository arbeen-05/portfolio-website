
function nextPage(page){
spawnHearts(30);
setTimeout(()=>window.location.href=page,800);
}

const yesBtn=document.getElementById("yesBtn");
if(yesBtn){yesBtn.onclick=()=>nextPage("index2.html");}

const noBtn=document.getElementById("noBtn");
if(noBtn){
noBtn.addEventListener("mouseover",moveNo);
noBtn.addEventListener("touchstart",moveNo);
}
function moveNo(){
noBtn.style.position="fixed";
noBtn.style.left=Math.random()*80+"vw";
noBtn.style.top=Math.random()*70+"vh";
spawnHearts(10);
}

function playMusic(){
const music=document.getElementById("bgMusic");
music.play().catch(()=>{});
spawnHearts(40);
}

function spawnHearts(count){
for(let i=0;i<count;i++){
let h=document.createElement("div");
h.className="heart";
h.innerHTML="❤";
h.style.left=Math.random()*100+"vw";
h.style.animationDuration=2+Math.random()*2+"s";
document.body.appendChild(h);
setTimeout(()=>h.remove(),4000);
}
}

window.addEventListener("load",()=>{
document.querySelectorAll(".gift").forEach(el=>el.classList.add("showGift"));
});
