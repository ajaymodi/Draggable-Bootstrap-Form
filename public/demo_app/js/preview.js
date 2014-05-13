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

$.each($('form').find("[name=addressField]"), function( index, value ) {
  if($(value).prop('checked')){
    var me = $(value).parent().parent();
    me.find(".billing").val(me.find(".shipping").val());
    $(me.find(".billing")).prop('disabled', true);
  }
});

$('.checkAddress').click(function () {
    var me = $(this).parent().parent();
    if(this.checked){
      me.find(".billing").val(me.find(".shipping").val());
      $(me.find(".billing")).prop('disabled', true);   
    }else{
      $(me.find(".billing")).prop('disabled', false);   
    }
});

$('.shipping').keyup(function () {
  var parent = $(this).parent();
  if($(parent).find('.checkAddress').prop('checked')){
    $(parent).find(".billing").val($(this).val());
  }
});

