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
  $("#onsavemsg").html("Status :<b>"+status+'</b><br><br>Response Data :<div id="msg" style="border:5px solid #CCC;padding:15px;">'+response+'</div>');  
  if(status=="success"){
    $("#redirect").removeAttr('disabled');

  }

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

$('form').validate();

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

$(".response_submit").click(function(e){
  url = document.URL;
  temp = url.split("/");
  if($.isNumeric(temp[temp.length-1])){
    if($('form').valid()){
      id = temp[temp.length-1];
      data = $('form').serialize()+"&form_id="+id;
      $('form').append( "<div class='loadImage'/>" );
      $.ajax({
        url: $('form').attr("action"), 
        type: 'POST',
        data: data,
        success: function(data){
          $('form').removeClass( "loadImage" );
          window.location.href = '/forms';
        },error: function(error){
          console.log(error);
        }
      });
    }else{
      e.preventDefault();
      return false;
    }
  }else{
    e.preventDefault();
  }
});
