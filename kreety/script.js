
function nextPage(page){
spawnHearts(30);
setTimeout(()=>window.location.href=page,700);
}

/* Persistent music across pages */
function initMusic(){
let music=document.getElementById("bgMusic");
if(localStorage.getItem("musicPlaying")==="true"){
music.play().catch(()=>{});
}
}

function playMusic(){
let music=document.getElementById("bgMusic");
music.loop=true;
music.play().then(()=>{
localStorage.setItem("musicPlaying","true");
}).catch(()=>{});
spawnHearts(40);
}

window.addEventListener("load",()=>{
initMusic();
document.querySelectorAll(".gift").forEach(el=>el.classList.add("showGift"));
});

/* Yes button */
const yesBtn=document.getElementById("yesBtn");
if(yesBtn){yesBtn.onclick=()=>nextPage("index2.html");}

/* Running No button */
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
