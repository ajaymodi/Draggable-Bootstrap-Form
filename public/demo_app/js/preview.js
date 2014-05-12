$( document ).ready(function() {
  $('.date-picker').focus(function() {
    var type = $(this).parent().find( "span" ).text();
    if (typeof type !== "undefined") {
      if(type=="DD/MM/YYYY") {
        $('.date-picker').datetimepicker({
          pickTime: false
        });
      } else{
        $('.date-picker').datetimepicker();
      }

    }
  });  
}); 
 