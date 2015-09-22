
var user_name = null;
var chat_room = null;
var created_at = null;
var unread = -1;
var ws = null;
var was_me = 0;
var active_groups= new Array();

var strip_tags = function(data) {
  return data.replace(/<(?:.|\n)*?>/gm, '');
}

var clean_chat_room = function(data) {
  data = strip_tags(data);
  return data.replace(/[^\w]/g, '');
}

var clean_user_name = function(data) {
  data = strip_tags(data);
  return data.replace(/[^\w\ ]/g, '');
}

var init_enter_chat_room_form = function(){
  $('#enter_chat_room').submit(function(){

    $form = $(this);
    $chat_room_field = $('#chat_room', $form);
    $user_name_field = $('#user_name', $form);
    chat_room = $chat_room_field.val();
    user_name = $user_name_field.val();

    // clean data
    chat_room = clean_chat_room(chat_room);
    user_name = clean_user_name(user_name);

    // update field vals
    $chat_room_field.val( '' );
    $user_name_field.val( user_name );

    // validate
    if (chat_room == '') {
      alert('Chat room is required.');
      return false;
    }
    if (user_name == '') {
      alert('Name is required.');
      return false;
    }

    if( $.inArray(chat_room, active_groups) !== -1){
      alert('Group name already in use. choose another..');
      return false;
    }

    // hide chat/user form, show message form
    //$form.hide();

    //init_chat_session();
    //$new_channel="<div ><a class='group' href='#'>"+chat_room+"</a></div>";
    //menu label on left side
    $("#channels").append("<div ><a class='group' href='#'>"+chat_room+"</a></div>");

    //body of the conversation
    $("#groups").append("<dl id='"+chat_room+"' class='dl-horizontal wrap_group close_it'></dl>");

    //create new group
    
    transit_group($(".group").last());
    start_conversation(chat_room);
    //init_add_members_form();
    return false;

  });
}

var init_add_members_form = function(){

  $('#add_members_to_group').show();
  $("#add_members_to_group").submit(function(){
    $form = $(this);
    $member_filed = $('#member_name', $form);
    member = $member_filed.val();

    member = strip_tags(member);
    $member_filed.val('');
    if(member == ''){
      return false;
    }
    if(member == null){
      return false;
    }
    data={
      member: member
    }
    try{

    }
    catch(err){
      console.debug(err);
    }
    return false;

  });
}
var init_send_message_form = function(){

  // show message form
  $('#send_message').show();

  $('#chat_room_ro', $('#send_message')).val( chat_room );

  // submit handler
  $('#send_message').submit(function(){

    unread = -1;
    $form = $(this);
    $message_field = $('#message', $form);
    message = $message_field.val();

    // clean data
    message = strip_tags(message);

    // update field vals
    $message_field.val('');

    // validate
    if (message == '') {
      //alert('Message is required.');
      return false;
    }

    if( user_name == null){
      user_name = $("#user_name").val();
    }

    data = {
      user_name: user_name,
      chat_room: chat_room,
      message: message,
      created_at: new Date().toUTCString()
    }

    // send message
    try {
      ws.send( JSON.stringify(data) );
      was_me = 1;
    }
    catch(err) {
      // debug
      console.debug(err);
    }

    return false;
  });

};
var add_data_to_group=function($chat_room,data){
  
  //datetime_title=(new Date(data['created_at'])).toUTCString().split(" GMT")[0];
  
  datetime_title=data['created_at'].replace(/-/g,'/');
  datetime_title=new Date(datetime_title).toString();
  datetime_title=datetime_title.split(" GMT")[0];

  //new_message = "<dt>"+data['user_name']+"</dt><dd>"+data['message']+"</dd><dd class='timedate' title='"+datetime_title+"'>"+new Date(data['created_at'])+"</dd>";
  
  new_message = "<div class='message-row'><dt>"+data['user_name']+"</dt><dd>"+data['message']+"<br><span class='timedate' title='"+datetime_title+"' data-livestamp='"+datetime_title+"' class='pull-right'></span></dd></div>";
  
  //console.log(datetime_title);
  $("#"+$chat_room).append( new_message );


}

var notification_on=function(channel){
  $(".group").each(function(){
      $that = $(this);
      if ($that.html() == channel && !($that.hasClass('active'))){
        $that.addClass("hightlight_it");
      }
  });
}
var init_chat_session = function($chat_room){

  // open web socket
  ws = new WebSocket("ws://em-mslack-server.herokuapp.com:9364/" + $chat_room);

  ws.onerror = function(error){};

  ws.onclose = function(){};

  ws.onopen = function(){
    //load prev. conversation
    $.ajax({
        url: '/chatroom/conversation',
        type: 'GET',
        data: {
        chat_room: $chat_room,
        },

        success: function(resp){  // <------ this is called
          //alert('data successfully recieced!'+$chat_room);
          
          //add_data_to_group($chat_room, resp);
          //alert(JSON.parse(resp['json']));
          //console.log(resp);
          $.each(resp,function(key, item){
            //console.log(item);
            add_data_to_group($chat_room, item);
          });
        },

        error: function(resp){
          alert('unable to load data!');
        }
      });
    //init_send_message_form();
    active_groups.push($chat_room);
  };

  ws.onmessage = function (e) {
    
    data = JSON.parse(e.data);
    //inject to $chat_room div
    datetime_title=(new Date(data.created_at)).toString().split(" GMT")[0];

    new_message = "<div class='message-row'><dt>"+data.user_name+"</dt><dd>"+data.message+"<br><span class='timedate' title='"+datetime_title+"' data-livestamp='"+datetime_title+"'></span></dd></div>";
    if($chat_room == "notifications"){
      $("#"+$chat_room).prepend(new_message);
      //$("#"+$chat_room).animate({"scrollTop": 0px }, "slow");
    
    }
    else{
      unread= unread + 1;

      if(was_me == 0){
        notification_on($chat_room);
      }
      was_me = 0;
      $("#"+$chat_room).append( new_message );
      $("#"+$chat_room).animate({"scrollTop": $("#"+$chat_room)[0].scrollHeight}, "slow");
    
    }
    //$("#"+$chat_room).animate({ scrollTop: $(".group").attr("scrollHeight") }, 3000);
    //$("#"+$chat_room).animate({ scrollTop: $("#"+$chat_room).height() }, 1000);

    
  };

}

var transit_group=function($group){
    $(".group").removeClass('active');
    $group.addClass('active');
    group=$group;
    //$.timeago($("dd.timedate"));
     
    
}



var start_conversation = function($group_name){
    init_send_message_form();
    $("#message").focus();
    var cur_channel=$group_name;
    chat_room = cur_channel;

    
    $("#conversation_group").html(chat_room);
    
    if( $.inArray(chat_room, active_groups) == -1){
      init_chat_session(chat_room);//start only if new group added
    }
    close_all_groups();
    display_this_group();
    
    $("#"+$group_name).animate({"scrollTop": $("#"+$group_name)[0].scrollHeight}, "fast");
    
    /* notify times */
    /*
    $("#"+chat_room+""+" dd.timedate").each(function(){
      element= $(this)[0];
      in_words= jQuery.timeago(new Date(element.title));
      console.log(element.textContent = in_words );
      
    });

    */

    

    $('#send_message').show();
    $('#chat_room_ro', $('#send_message')).val( chat_room );

}
var close_all_groups=function(){
    $(".wrap_group").addClass("close_it");

}
var display_this_group=function(){
    $('#'+chat_room).removeClass('close_it');
}
var init_all_groups=function(){
    $("dl").each(function(){
      $element=$(this);
      group_name=$element.attr("id");
      init_chat_session(group_name);
    });

    //notification group
    init_chat_session("notifications");
}
$(document).ready(function(){

  init_enter_chat_room_form();
  
  //initialize all groups
  //setInterval(init_all_groups, 200);
  init_all_groups();
  //get feed
  //get unread
  //init_chat_session();
  //console.log("I'm first");
  $(".group").live("click", function(){
    //alert('group changed');
    //$.timeago($("dd.timedate"));

    transit_group($(this));
    start_conversation($(this).text());
    $(this).removeClass("hightlight_it");
    //fetch_data($(this));
  });

  function check(){
    //console.log($.timeago($("dd.timedate")));
    //console.log("I am here?");
    if(document.hasFocus() == lastFocus) return;
    lastFocus = !lastFocus;
    
    if(unread > 0){
      $("#notification").html(""+unread+" new messages");
    }  
    
  }
  window.lastFocus = document.hasFocus();
  check();
  setInterval(check, 20);
  $("#message, .group").click(function(){
      $("#notification").html("");
      unread = -1;

  });


});
