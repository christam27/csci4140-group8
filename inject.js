var count = 0;
function onclick(){
    var items = document.getElementById("items-stamp");
    var alldelebtn = items.getElementsByTagName("button");

    for(var i = 0; i < alldelebtn.length; i++){
        alldelebtn[i].click();
    }

    if(count < 50){
        onclick();
    }
}

console.log("running improve youtube context script");
var playlist = document.getElementById("playlist-actions");
console.log(playlist);

var delebtn = document.createElement("button");
var btnid = document.createAttribute("id");
btnid.value = "deleteplaylist";
delebtn.setAttributeNode(btnid);
delebtn.innerHTML = "Delete Playlist";
delebtn.addEventListener("click",onclick);

playlist.appendChild(delebtn);


console.log("running improve youtube context script");