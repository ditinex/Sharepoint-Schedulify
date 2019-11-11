var API = (function(){

  var URL = 'https://keywordseverywhere.com/service/1/';
  var _apiKey;
  var _country = 'global';
  var _currency = 'usd';
  var _dataSource = 'cli';


  var init = function( apiKey, country, currency, dataSource ){
    if (typeof apiKey !== 'undefined') _apiKey = apiKey;
    if (typeof country !== 'undefined') _country = country;
    if (typeof currency !== 'undefined') _currency = currency;
    if (typeof dataSource !== 'undefined') _dataSource = dataSource;
  };


  var isOnline = function(cbProcessResponse){
    var url = URL + 'isOnline.php';
    $.getJSON(url)
      .done(function(json){
        delete localStorage.tsNoReplySince;
        if (typeof json === 'object' && json[0] === true) {
          cbProcessResponse({error: false, data: true});
        }
        else {
          cbProcessResponse({
            error: false,
            data: false,
            message: 'Keywords Everywhere is currently undergoing maintenance.'
          });
        }
      })
      .fail(function(){
        var now = Date.now();
        var diff;
        if (localStorage.tsNoReplySince) {
          diff = now - localStorage.tsNoReplySince;
        }
        else {
          localStorage.tsNoReplySince = now;
        }
        var message = 'Something has gone wrong.'
        if (diff > 24*3600*1000) message += ' Please re-install the extension.';
        if (diff > 10000) message += ' Please re-install the extension.';
        cbProcessResponse({
          error: true,
          data: false,
          message: message
        });
      });
  };


  var getParams = function(){
    return {
      apiKey: _apiKey,
      country: _country,
      currency: _currency,
      dataSource: _dataSource
    };
  };


  var getCredits = function(cbProcessResponse){
    var url = URL + 'getCredits.php';
    if (!_apiKey) {
      cbProcessResponse({
        ext_error: 'Please setup a valid API key'
      });
      return;
    }
    $.getJSON(url, {
      apiKey: _apiKey,
      t: Date.now()
    })
      .done(function(json){
        cbProcessResponse({error: '', data: json[0]});
      })
      .fail(function(jqXHR, textStatus, errorThrown){
        cbProcessResponse({error: true, data: textStatus});
      });
  };


  var getKeywordData = function( params, cbProcessResponse ){
    var keywords = params.keywords;
    var src = params.src;
    var useGlobal = params.global;
    var url = URL + 'getKeywordData.php';
    if (!_apiKey) {
      cbProcessResponse({
        ext_error: 'Please setup a valid API key'
      });
      return;
    }
    var data = {
      apiKey: _apiKey,
      country: useGlobal ? '' : _country,
      currency: _currency,
      dataSource: _dataSource,
      source: src,
      kw: keywords,
      t: Date.now()
    };
    if (params.from) data.from = params.from;
    if (params.seed) data.seed = params.seed;
    $.getJSON( url, data )
      .done(function(json){
        if (json.data) {
          formatResponse(json);
        }
        cbProcessResponse(json);
      });
  };


  var getCountries = function(cbProcessResponse){
    var url = 'https://keywordseverywhere.com/service/getCountries.php';
    $.getJSON(url).done(function(json){
      cbProcessResponse(json);
    });
  };


  var getCurrencies = function(cbProcessResponse){
    var url = 'https://keywordseverywhere.com/service/getCurrencies.php';
    $.getJSON(url).done(function(json){
      cbProcessResponse(json);
    });
  };





  var checkApiKey = function(key, cbProcessResponse){
    var url = URL + 'checkApiKey.php';
    $.getJSON(url, {
      apiKey: key
    })
      .done(function(json){
        cbProcessResponse({error: '', data: json[0]});
      })
      .fail(function(jqXHR, textStatus, errorThrown){
        cbProcessResponse({error: true, data: textStatus});
      });
  };


  var formatResponse = function(json){
    for (var key in json.data) {
      var item = json.data[key];
      var cpc = item.cpc;
      var vol = parseFloat(item.vol);
      item.cpc = typeof cpc !== 'undefined' ? cpc : '-';
      item.vol = typeof vol !== 'undefined' ? Number( vol ).toLocaleString() : '-';
    }
  };


  var addKeywords = function(keywords, cbProcessResponse){
    var url = URL + 'addKeywords.php?apiKey=' + _apiKey;
    $.post(url, {
      kw: keywords
    })
      .done(function(json){
        cbProcessResponse({error: false, data: json});
      })
      .fail(function(){
        cbProcessResponse({error: true});
      });
  };


  var deleteKeywords = function(keywords, cbProcessResponse){
    var url = URL + 'deleteKeywords.php?apiKey=' + _apiKey;
    $.post(url, {
      kw: keywords
    })
      .done(function(response){
        cbProcessResponse({error: false, data: response});
      })
      .fail(function(){
        cbProcessResponse({error: true});
      });
  };


  var getFavoriteKeywords = function(cbProcessResponse){
    var url = URL + 'getFavoriteKeywords.php?apiKey=' + _apiKey;
    $.get(url, {
      country: _country,
      currency: _currency
    })
      .done(function(response){
        cbProcessResponse({error: false, data: response});
      })
      .fail(function(){
        cbProcessResponse({error: true});
      });
  };


  var getBulkConfig = function(cbProcessResponse){
    var url = URL + 'getBulkConfig.php?apiKey=' + _apiKey;
    $.getJSON(url)
      .done(function(response){
        cbProcessResponse({error: false, data: response});
      })
      .fail(function(){
        cbProcessResponse({error: true});
      });
  };


  return {
    init: init,
    isOnline: isOnline,
    getCredits: getCredits,
    getParams: getParams,
    getKeywordData: getKeywordData,
    getCountries: getCountries,
    getCurrencies: getCurrencies,
    checkApiKey: checkApiKey,
    addKeywords: addKeywords,
    deleteKeywords: deleteKeywords,
    getFavoriteKeywords: getFavoriteKeywords,
    getBulkConfig: getBulkConfig
  };

})();
