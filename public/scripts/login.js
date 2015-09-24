function loginSubmit(){
  var pass = $("input[name='pass']");
  var md5Pass = md5(pass.val());
  pass.val(md5Pass);
  $("form#login").submit();
}