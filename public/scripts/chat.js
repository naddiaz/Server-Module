$('#text').keypress(
  function(e){
    if( e.keyCode==13 ){
      send();
    } 
  }
);

function send(){
  send_message();
  $('#text').val('');
  scrolled = true;
}


var scrolled = true;
var last_message = 0;
(function() {
  setInterval(
    function(){
      if($('#messages').scrollTop() == $("#messages").prop("scrollHeight")-250){
        $('#chat-ad').html("Messages");
      }
      update_messages();
    },
  1000);
})();


function send_message(){
  var data = {
    location: LOCATION,
    name: NAME,
    id_person: PERSON,
    origin: 'server',
    content: $('#text').val()
  }
  $.ajax({
    url:"/messages/send/server",
    type:"POST",
    data: data,
    success:function(data) {
      
    }
  });
}

function update_messages(){
  var data = {
    location: LOCATION,
    name: NAME,
    id_person: PERSON,
    last_message: last_message
  }
  $.ajax({
    url:"/messages/update/server",
    type:"POST",
    data: data,
    success:function(data) {
      var new_messages = $('#chat-box');
      var origin = 0;
      for(i in data.messages){
        var d = data.messages[i].send_at;
        d = new Date(d);
        var date = [(d.getMonth()+1).padLeft(),
             d.getDate().padLeft(),
             d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
             d.getMinutes().padLeft(),
             d.getSeconds().padLeft()].join(':');
        new_messages.append("<li class='" + data.messages[i].origin + "'><div>" + data.messages[i].content + "</div><div class='date'>" + date + "</div></li>");
        if(i == data.messages.length-1)
          last_message = data.messages[i].send_at;
        if(data.messages[i].origin != 'server')
          origin++;
      }
      if(data.messages.length > 0 && origin > 0){
        $('#chat-ad').html("Tiene mesajes nuevos");
      }
      if(scrolled){
        $('#messages').scrollTop($("#messages").prop("scrollHeight"));
        scrolled = false;
      }
    }
  });
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}