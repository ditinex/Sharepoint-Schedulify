var App = (function(){

  var settings = { enabled: true }
  var page = ''

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

          case 'app.getPage':
            sendResponse(page);
          break;

        }

      });
  };


  return {
    init: init
  };

})();

App.init();
