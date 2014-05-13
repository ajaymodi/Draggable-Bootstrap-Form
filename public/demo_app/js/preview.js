$('.date-picker').mouseenter(function() {
  var type = $(this).parent().find( "span" ).text();
  if (typeof type !== "undefined") {
    if(type=="MM/DD/YYYY") {
      $(this).datetimepicker({
        pickTime: false
      });
    } else{
      $(this).datetimepicker();
    }

  }
});  

$("#form_save").click(function(){
  data= ($($('pre')[0]).text());
  data = {"0":data};
  
  $.post(''+self.location+'form_save', data, function(response) {
    console.log(response);
  });
});