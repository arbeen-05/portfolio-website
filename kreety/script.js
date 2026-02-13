const noBtn = document.getElementById("noBtn");

if(noBtn){
noBtn.addEventListener("mouseover", ()=>{
    noBtn.style.top = Math.random()*200 + "px";
    noBtn.style.left = Math.random()*200 + "px";
    spawnHearts(10);
});
}

function showPage(id){
spawnHearts(25);
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
document.querySelectorAll(".gift").forEach(el=>el.classList.add("showGift"));
}

function playMusic(){
let music=document.getElementById("bgMusic");
music.play().catch(()=>{});
spawnHearts(40);
}

function spawnHearts(num){
for(let i=0;i<num;i++){
    let heart=document.createElement("div");
    heart.className="heart";
    heart.innerHTML="❤️";
    heart.style.left=Math.random()*100+"%";
    heart.style.bottom="0px";
    heart.style.fontSize=(Math.random()*20+15)+"px";
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),2000);
}
}