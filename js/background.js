var App = (function(){

  var settings = { enabled: true }
  var page = ''
  var jsonObj = { 
    '#2105 McLennan Ross LLP': {'client_id': '2105', 'service_id': '3004', 'subject': 'Subject here', 'template': 'Template here', 'cc': 'email@abc.com,email2@abc.com'},
    '#189 CiM Maintenance inc': {'client_id': '189', 'service_id': '207', 'type': 'VM', 'vmid': '299', 'subject': 'Subject here', 'template': 'Template here'}
  }
  var ticketlink=''
  var template = ''
  var cc = ''
  var subject = ''

  var init = function(){
    console.log('Starting App');
    initSettings()
    initMessaging()
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
    });

    $.get("/html/index.html", function (data) {
      page = data
    });

  };

  var initMessaging = function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        var cmd = request.cmd;
        var data = request.data;
        switch(cmd){

          case 'app.getStatus':
            sendResponse(settings.enabled);
          break;

          case 'app.toggleStatus':
            settings.enabled = !settings.enabled
            chrome.storage.local.set({ settings: settings });
            sendResponse(settings.enabled);
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

        }

      });
  };


  return {
    init: init
  };

})();

App.init();
