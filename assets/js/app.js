var endpoint = "http://slide.meguro.ryuzee.com";

$(function(){
  var retrieve_slides = function(url){
    $("ul#slide-list li.slide-item").remove();
    $.getJSON(url, function(data) {
      for (i in data) {
        var item = sprintf('<li class="list-group-item slide-item" id="item%d"><img class="img-circle media-object pull-left" src="%s" width="32" height="32" /><div class="media-body"><a data-id="%d"><strong>%s</strong></a><p>%s</p></div></li>', data[i].id, data[i].thumbnail_url, data[i].id, data[i].name, data[i].description);
        $("#slide-list").append(item);
      }
    }).done(function() {
      console.log('success');
    }).fail(function() {
      alert('failed to retrieve slides');
    });
  };

  retrieve_slides(endpoint + '/api/v1/slides');

  // 検索
  $("#search-text").on('change', function(){
    var txt = $(this).val();
    if (txt != "") {
      retrieve_slides(endpoint + '/api/v1/slides?name=' + txt);
    }
  });

  // 全てのスライドを表示
  $("#show-all").on('click', function(){
    $("#search-text").val("");
    retrieve_slides(endpoint + '/api/v1/slides');
  });

  // 左メニュークリック時
  $('ul.left-navi-list').on('click', 'a', function() {
    id = $(this).attr("data-id");
    if (!id) { return; }
    $("li.slide-item").removeClass('list-active');
    $("li#item" +id).addClass('list-active');
    $(".tab-pane").show();

    // スライド表示
    var $frame = $("#slide-frame");
    $frame.attr("src", endpoint + "/html_player/" + id);
    $frame.on('load', function(){
      $frame.height($frame.width() * 3 / 4);
      $frame.iFrameResize([]);
    });

    // スライド情報取得
    var user_id;
    $.ajaxSetup({async: false});
    $.getJSON(endpoint + '/api/v1/slides/' + id, function(data) {
      $(".slidename").html(data.name);
      $("#description").html(data.description);
      $("#slide-info").html(sprintf("Created by %s Published %s in %s", data.username, data.created_at, data.category_name));
      var tag = "";
      for (i in data.tags) {
        tag = tag + data.tags[i] + " ";
      }
      $("#slide-tag").html(tag);
      user_id = data.user_id;
    }).done(function() {
      console.log('success');
    }).fail(function() {
      alert('failed to retrieve slides');
    });

    // Transcript取得
    $("ul#transcript-list li").remove();
    $.getJSON(endpoint + '/api/v1/slides/' + id + '/transcript', function(data) {
      for (i in data.transcripts) {
        var item = sprintf('<li>%s</li>', data.transcripts[i]);
        $("#transcript-list").append(item);
      }
    }).done(function() {
      console.log('success');
    }).fail(function() {
      alert('failed to retrieve slides');
    });

    // ユーザー情報取得
    $.getJSON(endpoint + '/api/v1/users/' + user_id, function(data) {
      $("#username").html(data.display_name);
      $("#biography").html(data.biography);
    }).done(function() {
      console.log('success');
    }).fail(function() {
      alert('failed to retrieve slides');
    });

    // タブ切り替え
    toggle_tabs(1);
  });

  Mousetrap.bind(['j'], function(e) {
    var cur = $('ul.left-navi-list li.list-active'),
      next = cur.next('li');
    cur.removeClass('list-active');
    next.addClass('list-active');
    next.find('a').trigger('click');
  });

  Mousetrap.bind(['k'], function(e) {
    var cur = $('ul.left-navi-list li.list-active'),
      prev = cur.prev('li');
    cur.removeClass('list-active');
    prev.addClass('list-active');
    prev.find('a').trigger('click');
  });

  var toggle_tabs = function(index) {
    for(i=1; i<=3; i++) {
      $('div#tab' + i).removeClass('active');
      $('div#menu' + i).hide();
    }
    $('div#tab' + index).addClass('active');
    $('div#menu' + index).show();
  };

  $(".tab-item").on('click', function(){
    var index = $(this).attr("data-index");
    toggle_tabs(index);
  });
});
