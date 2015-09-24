function genericErrorAlert(textError){
  $.gritter.add({
    title: 'Error',
    text: '<h4>'+textError+'</h4>',
    image: '/img/error.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-error'
  });
}

function genericWarningAlert(textError){
  $.gritter.add({
    title: 'Alert',
    text: '<h4>'+textError+'</h4>',
    image: '/img/error.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-warning'
  });
}

function genericSuccessAlert(textAlert,icon){
  $.gritter.add({
    title: "Success",
    text: '<h4>'+textAlert+'</h4>',
    image: '/img/'+icon+'.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-success'
    });
}