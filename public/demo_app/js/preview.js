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


function onsave(response,status){
  $("#load_image").hide();
  $("#onsavesmsg").html("Status :<b>"+status+'</b><br><br>Response Data :<div id="msg" style="border:5px solid #CCC;padding:15px;">'+response+'</div>');  
}

function formSubmit(){
  $("#load_image").show();
  data= ($($('pre')[0]).text());
  data = {"title":$('legend').text(),"data":data};
  var options={
    url     : ''+self.location+'forms',
    data    : data,
    success : onsave,
    type    : 'POST'
  };
  $(this).ajaxSubmit(options);
  return false;
}


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

