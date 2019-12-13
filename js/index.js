(function(){

  var toggleSwitchStatus = true;
  var clientOsUpdate = false;
  var clientLink = 'https://portal.cirrushosting.com/admin/index.php?cmd=clients&action=show&id=';
  var serviceLink = 'https://portal.cirrushosting.com/admin/index.php?cmd=accounts&action=edit&id=';
  var openTicketLink = 'https://portal.cirrushosting.com/admin/index.php?cmd=tickets&action=new&client_id=';
  var VMLink = 'https://cloud.cirrushosting.com/virtual_machines/';
  var clientData = {};
  var clients = [];
  var date = '';

  var activeClient = '';

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
        lastCall();
      });

    });
  };

  function initUI(){
    $('#tabs').tabs({active: 0});
    validateAndList();
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

  function validateAndList(){
    let pattern = RegExp('.*Client Server OS Update.*|Send OS update','ig');
    if(pattern.test($('#SPFieldText').text())){
      clientOsUpdate = true;
      getClientList();
    }
    else{
      $('#tabs-1 p').html('No client available.');
    }
  }

  function getClientList(){
    chrome.runtime.sendMessage({cmd: 'app.listClient'}, function(data){
      clientData = data;
      let body = $('#SPFieldNote div').html();
      Object.keys(clientData).forEach(function(item) {
        var regex = RegExp('.*'+item+'.*','ig');
        if(regex.test(body)){
          body = body.replace(item, '<span class="highlight">'+item+'</span>');
          clients.push(item);
        }
      });
      $('#SPFieldNote div').html(body);
      addClienttoUI();
      getDate();
    });
  }

  function addClienttoUI(){

    let ui = '';
    i = 0
    clients.forEach(function(item) {
      ui=ui+'<div class="inputGroup2"><input id="radio-'+i+'" name="client" type="radio" value="'+item+'" /><label for="radio-'+i+'">'+item+'</label></div>';
      i++
    });

    $('#tabs-1').html(ui);

    selectClient();
  }

  function selectClient(){
    $('#tabs-1').on('click', '.inputGroup2', function(){
      activeClient = $(this).children('input').val();
      addDetailsUI();
    });
  }

  function addDetailsUI(){
    if(activeClient=='')
      return;
    let details = clientData[activeClient];

    ui = '<p style="font-size: 14px;"><strong>Client :</strong> '+activeClient+'<br> <strong>Client id :</strong> '+details['client_id']+'<br> <strong>Service id :</strong> '+details['service_id']+'<br> <strong>Type :</strong> '+details['type']+'<br><strong>VM id :</strong> '+details['vm_id']+'<br><strong>Note :</strong> '+details['note']+'<br> <strong>Date :</strong> '+date+'</p>';

    ui = ui+'<div style="text-align:center"><a target="_blank" href="'+clientLink+''+details['client_id']+'" class="links">Client Profile<a/> <a target="_blank" href="'+serviceLink+''+details['service_id']+'" class="links">Service Profile<a/>';
    if(details['vm_id'])
      ui=ui+' <a target="_blank" href="'+VMLink+''+details['vm_id']+'" class="links">VM<a/>';
    ui=ui+'</div>';
    $('#tabs-2').html(ui);
    
    addOptionUI(details);
  }

  function addOptionUI(details){
    let ticketopener = openTicketLink+''+details['client_id'];

    date = date.substr(0,date.indexOf(' ')+1);

    details['template'] = details['template'].replace("$DATE", date);

    chrome.runtime.sendMessage({cmd: 'app.setTemplate', data: { 'ticketopener': ticketopener, 'template': details['template'], 'cc': details['cc'], 'subject': details['subject'] } });

    ui='<textarea style="width:100%; height:150px;text-size: 14px;" disabled>'+details['template']+'</textarea>';
    if(details['cc'])
      ui=ui+'<textarea style="width:100%; height:50px;text-size: 14px;" disabled>'+details['cc']+'</textarea>';
    ui=ui+'<div style="text-align:center"><a target="_blank" href="'+ticketopener+'" class="button">Open Ticket<a/></div>';
    $('#tabs-3').html(ui);
  }

  function getDate() {
  	date = $('#SPFieldDateTime').text().trim();
  }

  return {
    init: init
  };

})().init();
