(function init(){
  sendMessage();
  var messages = [];
  var last = [0];
  setInterval(function(){
    updateMessages(messages, last);
    showMessages(messages, last);
  },1000);
  $("#chat-clear").click(function(){
      clearMessages();
  });
})();

function sendMessage(){
  $(".chat > .input > button.send").click(function(){
    var text = $(".chat > .input > textarea.write").val();
    if(text != ''){
      saveDatabase(text);
      $(".chat > .input > textarea.write").val('');
    }
  });
  $(".chat > .input > textarea.write").keypress(function(e) {
    if(e.which == 13) {
      var text = $(this).val();
      if(text != ''){
        saveDatabase(text);
        $(this).val('');
      }
      return false;
    }
  });
}

function showMessages(messages,last){
  var chatContent = $(".chat > .messages > .content");
  for(var i=last[0];i<messages.length;i++){
    if(i > 0){
      var date1 = new Date(messages[i-1].created_at);
      var date2 = new Date(messages[i].created_at);
      if(date1.getFullYear() == date2.getFullYear()
        && date1.getMonth() == date2.getMonth()
        && date1.getDate() != date2.getDate())
      {
        var date = moment(date2).format("DD / MM / YYYY");
        chatContent.append("<div class='new-date'>"+date+"</div>");
      }
    }
    else if(i==0){
      var date = moment(new Date(messages[i].created_at)).format("DD / MM / YYYY");
      chatContent.append("<div class='new-date'>"+date+"</div>");
    }
    buildMessage(messages[i].text,messages[i].from,messages[i].created_at);
  }
}
function buildMessage(text,from,now){
  var types = ['admin-message','employee-message']
  var date = moment(new Date(now)).format("HH:mm");
  var chatContent = $(".chat > .messages > .content");
  chatContent.append("<div class='"+types[from]+"'>" + text + "<div class='time'>"+date+"</div></div><div class='message-separator'></div>");
  chatContent.scrollTop(chatContent.prop('scrollHeight'));
}

function saveDatabase(text){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE,
    id_admin: ADMIN_ID,
    from: 0,
    text: text
  }
  $.ajax({
    url:"/chat/send",
    type:"POST",
    data: data,
    success:function(data) {
      console.log(data);
    }
  });
}

function updateMessages(messages, last){
  var lastDate = (messages.length > 0)? messages[messages.length-1].created_at : 0;
  var date = new Date(lastDate);
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE,
    id_admin: ADMIN_ID,
    last: date.toUTCString()
  }
  $.ajax({
    url:"/chat/update",
    type:"POST",
    data: data,
    success:function(data) {
      last[0] = messages.length;
      for(i in data.messages){
        if(!isIncluded(data.messages[i],messages)){
          messages.push({
            text: data.messages[i].text,
            from: data.messages[i].from,
            created_at: data.messages[i].created_at
          });
        }
      }
    }
  });
}

function isIncluded(message,messages){
  var i = 0;
  while(i < messages.length){
    if(messages[i].created_at.toString() == message.created_at.toString()){
      return true;
    }
    i++;
  }
  return false;
}

function clearMessages(){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE,
    id_admin: ADMIN_ID
  }
  $.ajax({
    url:"/chat/clear",
    type:"POST",
    data: data,
    success:function(data) {
      console.log(data);
      if(data.status)
        $(".chat > .messages > .content")
        .html("<div class='admin-message'>Messages were cleaned successful</div><div class='message-separator'></div>");
    }
  });
}