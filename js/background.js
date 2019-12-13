var App = (function(){

  var settings = { enabled: true }
  var API = 'http://208.69.57.115/plesk-site-preview/mailqueue.alert/https/208.69.57.115/api/';
  var page = ''
  var jsonObj = {}
  var ticketlink=''
  var template = ''
  var cc = ''
  var subject = ''
  var name = ''
  var key = ''

  var init = function(){
    console.log('Starting App');
    initSettings()
  };

  var initSettings = function(){
    chrome.storage.local.get(null, function( data ){
      // Default - set data and enable app
      if (!data.settings) {
        chrome.storage.local.set({ settings: settings });
      }
      else { // fetch default data
      	settings = data.settings
      }

      if(data.name && data.key) {
        name = data.name
        key = data.key
      }

      $.post(API,
      { cmd: "get", key: key },
      function(data, status, jqXHR) {
        if(data){
          jsonObj = JSON.parse(data);
        }
      });

      $.get("/html/index.html", function (data) {
        page = data
      });

      initMessaging()

    });

  };

  var initMessaging = function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        var cmd = request.cmd;
        var data = request.data;

        if(cmd!='app.getStatus' && cmd!='app.toggleStatus' && cmd!='app.getKey' && cmd!='api.validate' && !name && !key){
          return false;
        }

        switch(cmd){

          case 'app.getStatus':
            sendResponse(settings.enabled);
          break;

          case 'app.toggleStatus':
            settings.enabled = !settings.enabled
            chrome.storage.local.set({ settings: settings });
            sendResponse(settings.enabled);
          break;

          case 'app.getKey':
            if(key=='' && name=='')
              sendResponse(false);
            else
              sendResponse({key: key, name: name});
          break;

          case 'app.getCurrentUrl':
            var gettingCurrent = browser.tabs.getCurrent();
            sendResponse(gettingCurrent);
          break;

          case 'app.getPage':
            sendResponse(page);
          break;

          case 'app.listClient':
            sendResponse(jsonObj);
          break;

          case 'app.setTemplate':
            ticketlink = data.ticketopener;
            template = data.template;
            cc = data.cc;
            subject = data.subject;
            sendResponse(true);
          break;

          case 'app.getTemplate':
            sendResponse([ticketlink,template,cc,subject]);
          break;

          case 'app.getTemplate':
            sendResponse([ticketlink,template,cc,subject]);
          break;

          case 'api.validate':
            $.post(API,
              { key: data.key },
              function(d, status, jqXHR) {
              if(d == true){
                chrome.storage.local.set({ name: data.name });
                chrome.storage.local.set({ key: data.key });
                key = data.key
                name = data.name
               sendResponse(true); 
              }
              else
                sendResponse(false); //debug validate
            });
            return true;
          break;

          case 'api.get':
            $.post(API,
              { cmd: "get", key: key },
              function(data, status, jqXHR) {
              console.log(data)
              if(data){
                jsonObj = JSON.parse(data);
                sendResponse(jsonObj);
              }
            });
            return true;
          break;

          case 'api.delete':
            $.post(API, 
              { cmd: "delete", client: data, key: key }, 
              function(data, status, jqXHR) {
              if(data){
                jsonObj = JSON.parse(data);
                sendResponse(jsonObj);
              }
            });
            return true;
          break;

          case 'api.create':
            data.push({ name: "cmd", value: "create" });
            data.push({ name: "key", value: key });
            $.post(API, 
              data, 
              function(data, status, jqXHR) {
              if(data){
                jsonObj = JSON.parse(data);
                sendResponse(jsonObj);
              }
            });
            return true;
          break;

          case 'api.getnewfeed':
            $.post(API,
              { cmd: "getnewfeed", key: key },
              function(data, status, jqXHR) {
              if(data){
                jsonObj = JSON.parse(data);
                sendResponse(jsonObj);
              }
            });
            return true;
          break;

          case 'api.addnewsfeed':
            d = new Date();
            data.push({ name: "date", value: d });
            data.push({ name: "cmd", value: "addnewsfeed" });
            data.push({ name: "name", value: name });
            data.push({ name: "key", value: key });
            $.post(API, 
              data, 
              function(data, status, jqXHR) {
              if(data){
                jsonObj = JSON.parse(data);
                sendResponse(jsonObj);
              }
            });
            return true;
          break;

          default:
          break;

        }

      });
  };


  return {
    init: init
  };

})();

App.init();
