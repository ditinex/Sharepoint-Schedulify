(function(){

  var toggleSwitchStatus = true;

  var init = function(){

    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      if(appStatus == false)
        return;

      var body = $('body');
      chrome.runtime.sendMessage({cmd: 'app.getPage'}, function(data){
        body.prepend(data);
        toggleSwitchImg();
      });

    });
  };

  function toggleSwitchImg(){
    closeimg = browser.runtime.getURL("img/close.png");
    if(toggleSwitchStatus)
      $('toggle-button').html('<img src="'+closeimg+'">')
  }

  function getDate() {
  	
  }

  function restoreOptions() {
  	
  }

  return {
    init: init
  };

})().init();
