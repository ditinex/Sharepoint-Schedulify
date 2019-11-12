(function(){

  var toggleSwitchStatus = true;

  var init = function(){

    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      if(appStatus == false)
        return;

      var body = $('body');
      chrome.runtime.sendMessage({cmd: 'app.getPage'}, function(data){
        body.prepend(data);
        initUI()
        toggleSwitchImg();
        toggleSwitch();
      });

    });
  };

  function initUI(){
    $('#tabs').tabs({active: 0});
  }

  function toggleSwitchImg(){
    closeimg = browser.runtime.getURL("img/close.png");
    openimg = browser.runtime.getURL("img/open.png");
    if(toggleSwitchStatus){
      $('.toggle-button').html('<img src="'+closeimg+'">');
      $('.inject-container').removeClass('minimize');
      $('#tabs').fadeIn(400);
    }
    else{
      $('.toggle-button').html('<img src="'+openimg+'">');
      $('.inject-container').addClass('minimize');
      $('#tabs').fadeOut(400);
    }
  }

  function toggleSwitch(){
    $('.toggle-button').on('click',function() {
      toggleSwitchStatus = !toggleSwitchStatus;
      toggleSwitchImg();
    });
  }

  function getDate() {
  	
  }

  function restoreOptions() {
  	
  }

  return {
    init: init
  };

})().init();
