$(document).ready(function() {
 
    // delete the entry once we have confirmed that it should be deleted
    $('.delete').click(function(e) {
        var answer = confirm ("Are you sure you want to delete from the database?");
        if (answer)
        {
          var parent = $(this).closest('tr');
          $.ajax({
              type: 'DELETE',
              url: '/forms', // <- replace this with your url here
              data: 'id=' + $(this).attr('f-id'),
              beforeSend: function() {
                  parent.animate({'backgroundColor':'#fb6c6c'},300);
              },
              success: function() {
                  parent.fadeOut(300,function() {
                      parent.remove();
                  });
              }
          });
        } else{
          e.preventDefault();
        }


    });


    
 
});

function responseLoad(form_id) {
      $("#load_image").show();
      a = self.location["href"];
      var options={
        url     : ''+a.slice(0,-5)+'responses/'+form_id,
        success : onresponse,
        type    : 'GET'
      };
      $(this).ajaxSubmit(options);
      return false;
    }

function onresponse(response,status){
  $("#load_image").hide();
  $("#onresponsemsg").html("Status :<b>"+status+'</b><br><br>Response Data :<div id="msg" style="border:5px solid #CCC;padding:15px;">'+response+'</div>');  
}

