
  $('.date-picker').mouseenter(function() {
    var type = $(this).parent().find( "span" ).text();
    if (typeof type !== "undefined") {
      if(type=="MM/DD/YYYY") {
        $('.date-picker').datetimepicker({
          pickTime: false
        });
      } else{
        $('.date-picker').datetimepicker();
      }

    }
  });  

 