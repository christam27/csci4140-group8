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
var channels_link = [];
for(var i = 0; i < channels_access.length; i++){
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
          var tempauthoruri = tempauthor[0].getElementsByTagName("uri");
          var authoruri = tempauthoruri[0].innerHTML;
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
          channels_link.push([author,authoruri]);
        }
        // console.log(videos)
      }
    }
    xhr2.send();
  }
}
console.log(channels_link);

videolist.sort(sortfunction);
console.log(videolist);

function sortfunction(a, b) {
  if(a[3].getTime() === b[3].getTime()){
    return 0;
  }else{
    return (a[3].getTime() > b[3].getTime()) ? -1 : 1;
  }
}

var page = 1;
// default
clickpage(1);

function clickpage(e){
  console.log("set page");
  page = e;
  console.log(page);
  switch(page){
    case 1:
      // default
      var show = document.getElementById("showjs");
      show.innerHTML = "";
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
      break;
    case 2:
      // group
      var show = document.getElementById("showjs");
      show.innerHTML = "";
      var headtitle = document.createElement("h4");
      headtitle.innerHTML = "Tech Channel:";
      show.appendChild(headtitle);
      var grouplist = [];

      var groupmember = ["Linus Tech Tips","Austin Evans","Dave Lee","feverSound com","Jonathan Morrison","Lok Cheung HK","Marques Brownlee","Matthew Moniz","The Tech Chap"];
      for(var i = 0; i < videolist.length; i++){
        if(groupmember.includes(videolist[i][0])){
          grouplist.push(videolist[i]);
        }
      }

      for(var i = 0; i < 15; i++){
        var div = document.createElement("div");
        var att = document.createAttribute("class");
        att.value = "card";
        div.setAttributeNode(att);

        var header = document.createElement("h5");
        var att2 = document.createAttribute("class");
        att2.value = "card-header";
        header.setAttributeNode(att2);
        header.innerHTML = grouplist[i][0];
        div.appendChild(header);

        var divbody = document.createElement("div");
        var att3 = document.createAttribute("class");
        att3.value = "card-body";
        divbody.setAttributeNode(att3);

        var header2 = document.createElement("h6");
        var att3 = document.createAttribute("class");
        att3.value = "card-title";
        header2.setAttributeNode(att3);
        header2.innerHTML = grouplist[i][1];
        divbody.appendChild(header2);

        var alink = document.createElement("a");
        var att4 = document.createAttribute("href");
        att4.value = grouplist[i][2];
        alink.setAttributeNode(att4);
        alink.innerHTML = grouplist[i][2];
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
      break;
    case 3:
      // preference
      var show = document.getElementById("showjs");
      show.innerHTML = "";
      var headtitle = document.createElement("h4");
      chrome.storage.sync.get(['preference'], function(result) {
        console.log('Value currently is ' + result.preference);
        var preferencemember = result.preference;
        headtitle.innerHTML = "Preference: " + preferencemember;
        show.appendChild(headtitle);
        var preferencelist = [];

        for(var i = 0; i < 100; i++){
          if(preferencemember === (videolist[i][0])){
              preferencelist.push(videolist[i]);
          }
        }

        for(var i = 0; i < 15; i++){
          if(!preferencelist.includes(videolist[i])){
            preferencelist.push(videolist[i]);
          }
        }

        for(var i = 0; i < 15; i++){
          var div = document.createElement("div");
          var att = document.createAttribute("class");
          att.value = "card";
          div.setAttributeNode(att);

          var header = document.createElement("h5");
          var att2 = document.createAttribute("class");
          att2.value = "card-header";
          header.setAttributeNode(att2);
          header.innerHTML = preferencelist[i][0];
          div.appendChild(header);

          var divbody = document.createElement("div");
          var att3 = document.createAttribute("class");
          att3.value = "card-body";
          divbody.setAttributeNode(att3);

          var header2 = document.createElement("h6");
          var att3 = document.createAttribute("class");
          att3.value = "card-title";
          header2.setAttributeNode(att3);
          header2.innerHTML = preferencelist[i][1];
          divbody.appendChild(header2);

          var alink = document.createElement("a");
          var att4 = document.createAttribute("href");
          att4.value = preferencelist[i][2];
          alink.setAttributeNode(att4);
          alink.innerHTML = preferencelist[i][2];
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
      });

      break;
    case 4:
      var show = document.getElementById("showjs");
      show.innerHTML = "<h4>unsibscribe recommend</h4>";
      var unsublist = [];
      var goodlist = [];
      var theday = new Date();
      var thedaynum = theday.getTime();
      theday = theday - 31536000000;
      console.log(thedaynum)
      for(var i = 0; i < videolist.length; i++){
        if(!goodlist.includes(videolist[i][0]) && !unsublist.includes(videolist[i][0])){
          if(videolist[i][3].getTime() > theday){
            goodlist.push(videolist[i][0]);
          }else{
            unsublist.push(videolist[i][0]);
          }
        }
      }
      // for(var i = 0; i < channels_names.length; i++){
      //   if(!goodlist.includes(channels_names[i]) && !unsublist.includes(channels_names[i])){
      //     unsublist.push(channels_names[i]);
      //   }
      // }
      // console.log(unsublist);
      for(var i = 0; i < unsublist.length; i++){
        for(var j = 0; j < channels_link.length; j++){
          if(channels_link[j][0] == unsublist[i]){
            console.log(unsublist[i]);
            console.log(channels_link[j][1]);
            var div = document.createElement("div");
            var att = document.createAttribute("class");
            att.value = "card";
            div.setAttributeNode(att);

            var header = document.createElement("h5");
            var att2 = document.createAttribute("class");
            att2.value = "card-header";
            header.setAttributeNode(att2);
            header.innerHTML = unsublist[i];
            div.appendChild(header);

            var divbody = document.createElement("div");
            var att3 = document.createAttribute("class");
            att3.value = "card-body";
            divbody.setAttributeNode(att3);

            var alink = document.createElement("a");
            var att4 = document.createAttribute("href");
            att4.value = channels_link[j][1];
            alink.setAttributeNode(att4);
            alink.innerHTML = channels_link[j][1];
            divbody.appendChild(alink);

            div.appendChild(divbody)
            show.appendChild(div);
            break;
          }
        }
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

      break;
    case 5:
      var show = document.getElementById("showjs");
      show.innerHTML = "<h4>Setting</h4>";

      chrome.storage.sync.get(['preference'], function(result) {
          if(typeof result.preference === undefined){
              chrome.storage.sync.set({'preference': ""}, function() {
                console.log('Value is set to ' + "null");
              });
          }
          var preference_text = result.preference;

          function update() {
            preference = document.getElementById("preferencetext").value;
            if (!preference) {
              console.log('error');
              return;
            }
            chrome.storage.sync.set({'preference': preference}, function() {
              console.log('Value is set to ' + preference);
            });
            chrome.storage.sync.get(['preference'], function(result) {
              console.log('Value currently is ' + result.preference);
            });
          }

          var input = document.createElement("input");
          input.setAttribute('type', 'text');
          input.setAttribute('id', 'preferencetext');
          input.setAttribute("value", preference_text);
          show.appendChild(input);

          var button = document.createElement("button");
          button.innerHTML = "Save";
          button.setAttribute("id", "savebutton");
          button.addEventListener("click", update);
          show.appendChild(button);


      });

      break;
  }
}

var defaultbutton = document.getElementById("default");
var groupbutton = document.getElementById("group");
var preferencebutton = document.getElementById("preference");
var unsubbutton = document.getElementById("unsub");
var settingbutton = document.getElementById("setting");
// console.log(defaultbutton);
// console.log(groupbutton);
// console.log(preferencebutton);
// console.log(unsubbutton);
defaultbutton.addEventListener('click',clickpage.bind(this,1));
groupbutton.addEventListener('click',clickpage.bind(this,2));
preferencebutton.addEventListener('click',clickpage.bind(this,3));
unsubbutton.addEventListener('click',clickpage.bind(this,4));
setting.addEventListener('click',clickpage.bind(this,5));
