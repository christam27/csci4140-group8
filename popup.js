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

        var videoid = videolist[i][2].slice(32);
        console.log(videoid);

        var playeriframe = document.createElement("iframe");
        playersrc = "https://www.youtube.com/embed/" + videoid;
        playeriframe.src = playersrc;
        playeriframe.width = "320";
        playeriframe.height = "180";
        playeriframe.frameborder = "0";
        playeriframe.allowfullscreen = "allowfullscreen";
        divbody.appendChild(playeriframe);

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
      chrome.storage.sync.get(['groupname'], function(result) {
        console.log('Value currently is ' + result.groupname);
        headtitle.innerHTML = result.groupname + ":";
      }); 
      show.appendChild(headtitle);
      var grouplist = [];

      chrome.storage.sync.get(['list'], function(result) {
        console.log('groupmem Value currently is ' + result.list);
        var groupmember = result.list;
        for(var i = 0; i < videolist.length; i++){
          if(groupmember.includes(videolist[i][0])){
            grouplist.push(videolist[i]);
          }
        }

        if(groupmember.length > 0){
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

            var videoid = grouplist[i][2].slice(32);
            console.log(videoid);

            var playeriframe = document.createElement("iframe");
            playersrc = "https://www.youtube.com/embed/" + videoid;
            playeriframe.src = playersrc;
            playeriframe.width = "320";
            playeriframe.height = "180";
            playeriframe.frameborder = "0";
            playeriframe.allowfullscreen = "allowfullscreen";
            divbody.appendChild(playeriframe);

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
        }
      });

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

            var videoid = preferencelist[i][2].slice(32);
            console.log(videoid);

            var playeriframe = document.createElement("iframe");
            playersrc = "https://www.youtube.com/embed/" + videoid;
            playeriframe.src = playersrc;
            playeriframe.width = "320";
            playeriframe.height = "180";
            playeriframe.frameborder = "0";
            playeriframe.allowfullscreen = "allowfullscreen";
            divbody.appendChild(playeriframe);

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
      show.innerHTML = "<h4>Setting:</h4><br><h5>preference channel:</h5>";

      chrome.storage.sync.get(['preference'], function(result) {
          if(typeof result.preference === undefined){
              chrome.storage.sync.set({'preference': ""}, function() {
                console.log('Value is set to ' + "null");
              });
          }
          var preference_text = result.preference;

          function update_p() {
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
          button.addEventListener("click", update_p);
          show.appendChild(button);

          var br = document.createElement("br");
          show.appendChild(br);

          var grouptitle = document.createElement("h5");
          grouptitle.innerHTML = "group name:";
          show.appendChild(grouptitle);


          chrome.storage.sync.get(['groupname'], function(result) {
            if(typeof result.groupname === undefined){
                chrome.storage.sync.set({'groupname': ""}, function() {
                  console.log('groupname Value is set to ' + "null");
                });
            }
            var groupname_text = result.groupname;
            console.log('groupname Value currently is ' + result.groupname);
            var input_2 = document.createElement("input");
            input_2.setAttribute('type', 'text');
            input_2.setAttribute('id', 'groupname');
            input_2.setAttribute("value", groupname_text);
            show.appendChild(input_2);

            function update_g() {
              var groupname = document.getElementById("groupname").value;
              if (!groupname) {
                console.log('error');
                return;
              }
              chrome.storage.sync.set({'groupname': groupname}, function() {
                console.log('groupname Value is set to ' + groupname);
              });
              chrome.storage.sync.get(['groupname'], function(result) {
                console.log('groupname Value currently is ' + result.groupname);
              });
            }

            var button_2 = document.createElement("button");
            button_2.innerHTML = "Save";
            button_2.setAttribute("id", "savebutton_2");
            button_2.addEventListener("click", update_g);
            show.appendChild(button_2);

            var br2 = document.createElement("br");
            show.appendChild(br2);
            var addchanneltext = document.createElement("h5");
            addchanneltext.innerHTML = "add new channel into group:"
            show.appendChild(addchanneltext);
            chrome.storage.sync.get(['list'], function(result) {
              if(typeof result.list === 'undefined'){
                  result.list = []
                  chrome.storage.sync.set({'list':result.list}, function() {
                    console.log('groupname Value is set to (null)' + result.list);
                  });
              }
              console.log('groupmem Value currently is ' + result.list);

              var groupmem = result.list;
              console.log('groupmem Value currently is ' + result.list);
              var input_3 = document.createElement("input");
              input_3.setAttribute('type', 'text');
              input_3.setAttribute('id', 'groupmem');
              show.appendChild(input_3);

              function update_m() {
                var newmem = document.getElementById("groupmem").value;
                if (!newmem) {
                  console.log('error');
                  return;
                }else{
                    result.list.push(newmem);
                    chrome.storage.sync.set({'list':result.list}, function() {
                      console.log('groupmem Value is set to ' + result.list);
                    });
                    chrome.storage.sync.get(['list'], function(result) {
                      console.log('groupmem Value currently is ' + result.list);
                    });
                }
                var gmdiv = document.getElementById("groupmemdiv");
                gmdiv.innerHTML = "group member: <br>";
                for(var i = 0; i < result.list.length; i++){
                  gmdiv.innerHTML += result.list[i] + "<br>";
                }

              }

              function update_r() {
                result.list = []
                chrome.storage.sync.set({'list':result.list}, function() {
                  console.log('groupname Value is set to (null)' + result.list);
                });
                var gmdiv = document.getElementById("groupmemdiv");
                gmdiv.innerHTML = "group member: <br>";
                for(var i = 0; i < result.list.length; i++){
                  gmdiv.innerHTML += result.list[i] + "<br>";
                }
              }

              var button_3 = document.createElement("button");
              button_3.innerHTML = "Add";
              button_3.setAttribute("id", "savebutton_3");
              button_3.addEventListener("click", update_m);
              show.appendChild(button_3);

              var button_4 = document.createElement("button");
              button_4.innerHTML = "Reset group";
              button_4.setAttribute("id", "savebutton_4");
              button_4.addEventListener("click", update_r);
              show.appendChild(button_4);

              var br3 = document.createElement("br");
              show.appendChild(br3);
              var groupmemdiv = document.createElement("div");
              groupmemdiv.id = "groupmemdiv";
              groupmemdiv.innerHTML = "group member: <br>";
              for(var i = 0; i < result.list.length; i++){
                groupmemdiv.innerHTML += result.list[i] + "<br>";
              }
              show.appendChild(groupmemdiv);

            });

          });
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
