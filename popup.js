var xhr = new XMLHttpRequest();
xhr.open("GET", "subscription_manager.xml", false);
var channels_names = ["0"];
var channels_access = ["0"];
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    xmldata = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
    // console.log(xmldata)
    var channels = xmldata.getElementsByTagName("outline");
    channels_number = channels.length;
    for(var i = 1; i < channels_number; i++){
      // console.log(channels[i].getAttribute("text"));
      // console.log(channels[i].getAttribute("xmlUrl"));
      channels_names.push(channels[i].getAttribute("text"));
      channels_access.push(channels[i].getAttribute("xmlUrl"));
    }
  }
}
xhr.send();

var videolist = [];
for(var i = 0; i < 100; i++){
  if(i > 0){
    // console.log(channels_names[i]);
    // console.log(channels_access[i]);
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", channels_access[i], false);
    xhr2.onreadystatechange = function() {
      if (xhr2.readyState == 4) {
        xmldata = (new DOMParser()).parseFromString(xhr2.responseText,'text/xml');
        // console.log(xmldata)
        var videos = xmldata.getElementsByTagName("entry");
        // console.log(videos[0]);
        for(var j = 0; j < videos.length; j++){
          // publisher
          var tempauthor = videos[j].getElementsByTagName("author");
          var tempauthorname = tempauthor[0].getElementsByTagName("name");
          var author = tempauthorname[0].innerHTML;
          // console.log(tempauthorname[0].innerHTML);
          // title
          var temptitle = videos[j].getElementsByTagName("title");
          var title = temptitle[0].innerHTML; 
          // console.log(temptitle[0].innerHTML);
          // video link 
          var templink = videos[j].getElementsByTagName("link")
          var link = templink[0].getAttribute("href");
          // console.log(templink[0].getAttribute("href"));
          // video publish time
          var temptime = videos[j].getElementsByTagName("published");
          var temptime2 = temptime[0].innerHTML;
          var time = new Date(temptime2);
          // console.log(time);
          // console.log(temptime[0].innerHTML);
          // push to array
          videolist.push([author,title,link,time]);
        }
        // console.log(videos)
      }
    }
    xhr2.send();
  }
}

videolist.sort(sortfunction);
console.log(videolist);

function sortfunction(a, b) {
  if(a[3].getTime() === b[3].getTime()){
    return 0;
  }else{
    return (a[3].getTime() > b[3].getTime()) ? -1 : 1;
  }
}

var show = document.getElementById("showjs");
for(var i = 0; i < 15; i++){
  var div = document.createElement("div");
  var att = document.createAttribute("class");
  att.value = "card";
  div.setAttributeNode(att);

  var header = document.createElement("h5");
  var att2 = document.createAttribute("class");
  att2.value = "card-header";
  header.setAttributeNode(att2);
  header.innerHTML = videolist[i][0];
  div.appendChild(header);

  var divbody = document.createElement("div");
  var att3 = document.createAttribute("class");
  att3.value = "card-body";
  divbody.setAttributeNode(att3);

  var header2 = document.createElement("h6");
  var att3 = document.createAttribute("class");
  att3.value = "card-title";
  header2.setAttributeNode(att3);
  header2.innerHTML = videolist[i][1];
  divbody.appendChild(header2);

  var alink = document.createElement("a");
  var att4 = document.createAttribute("href");
  att4.value = videolist[i][2];
  alink.setAttributeNode(att4);
  alink.innerHTML = videolist[i][2];
  divbody.appendChild(alink);

  div.appendChild(divbody)
  show.appendChild(div);
}

var addlink = document.getElementsByTagName("a");


function clicklink(e){
  // console.log(e);
  chrome.tabs.create({url: e})
}
// console.log(addlink);
for(var i = 0; i< addlink.length; i++){
  var e = addlink[i].innerHTML;
  console.log(e);
  addlink[i].addEventListener('click',clicklink.bind(this,e));
}