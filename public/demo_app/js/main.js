//login and signup validation
$(document).ready(function() {
  $("#signin").validate();
  $("#signup").validate({
    rules: {
      password: "required",
      checkpassword: {
        equalTo: "#password"
      }
    }
  });
});
