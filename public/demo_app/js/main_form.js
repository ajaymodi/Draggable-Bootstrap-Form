  function makeDraggable() {
    $(".selectorField").draggable({ helper: "clone",stack: "div",cursor: "move", cancel: null  });
  }

  var _ctrl_index = 1001;
  function docReady() {
    console.log("document ready");
    compileTemplates();
    
    makeDraggable();
    
    $( ".droppedFields" ).droppable({
        activeClass: "activeDroppable",
        hoverClass: "hoverDroppable",
        accept: ":not(.ui-sortable-helper)",
        drop: function( event, ui ) {
        //console.log(event, ui);
        var draggable = ui.draggable;
        draggable = $(ui.draggable).find(".modele").clone();
          // draggable = draggable.clone();
        draggable.removeClass("modele");
        draggable.removeClass("selectorField");
        draggable.addClass("droppedField");
        draggable[0].id = "CTRL-DIV-"+(_ctrl_index++); // Attach an ID to the rendered control
        draggable.appendTo(this);       
        
        /* Once dropped, attach the customization handler to the control */
        draggable.click(function () {          
                    // The following assumes that dropped fields will have a ctrl-defined. 
                    //   If not required, code needs to handle exceptions here. 
                    var me = $(this)
                    var ctrl = me.find("[class*=ctrl]")[0];
                    var ctrl_type = $.trim(ctrl.className.match("ctrl-.*")[0].split(" ")[0].split("-")[1]);
                    customize_ctrl(ctrl_type, this.id);
                    //window["customize_"+ctrl_type](this.id);
                });

        makeDraggable();
      }
    });   

    /* Make the droppedFields sortable and connected with other droppedFields containers*/
    $( ".droppedFields" ).sortable({
                    cancel: null, // Cancel the default events on the controls
                    connectWith: ".droppedFields"
    }).disableSelection();


    // Affichage du div pour la suppression d'un tableau
    $("#divDeleteTableau").hide();
    $('.droppedFields').mouseenter(function () {
      tableauToDelete = this;
      $("#divDeleteTableau").show();
      $("#divDeleteTableau").position({
        my: "right top",
        at: "right top",
        of: $(this).parent().children().last()
      });
    });
    $('.droppedFields').mouseleave(function () {
      $("#divDeleteTableau").hide();
    });
    $('#divDeleteTableau').mouseenter(function () {
      $("#divDeleteTableau").show();
    });

    $("#sliderNbColonne").slider({
      min: 1,
      max: 5,
      value: 1,
      slide: function (event, ui) {
        $("#nbColonne").html(ui.value);
      }
    });
    $("#nbColonne").html($("#sliderNbColonne").slider("value"));


    // // Permet le trie des "tableaux"
    // $("#selected-content").sortable({
    //   cancel: null,      
    //   start: function (event, ui) {
    //     $("#divDeleteTableau").hide();
    //   }
    // }).disableSelection();
  }
  

  // Ajout de tableau
  function ajouterTableau() {
    var bValid = true;          
    if (bValid) {
      var nbColonne = $("#sliderNbColonne").slider("value");
      var contentToAdd = "<div class=\"row-fluid\">";
      var largeurSpan = 12 / nbColonne;
      for (var i = 0; i < nbColonne; i++) {
        contentToAdd += "<div class=\"span" + largeurSpan + " well droppedFields\"></div>";
      }
      contentToAdd += "</div>";
      $('#dialog-form-nombre-colonne').modal('hide');
      $("#selected-content").append(contentToAdd);
      docReady();
    }
  }
  // Suppression de tableau 
  var tableauToDelete = null;
  function supprimerTableau() {
    if (tableauToDelete) {      
      if (window.confirm("Are you sure ?")) {
        $("body").append($("#divDeleteTableau")); // Sinon il r�apparait ...
        $(tableauToDelete).parent().remove();
        tableauToDelete = null;
        $("#divDeleteTableau").hide();
      }
    }
  }


  /*
    Preview the customized form 
      -- Opens a new window and renders html content there.
  */
  function preview() {
    console.log('Preview clicked');
    
    // Sample preview - opens in a new window by copying content -- use something better in production code
    var selected_content = $("#selected-content").clone();
    selected_content.find("div").each(function(i,o) {
                var obj = $(o)
                obj.removeClass("draggableField ui-draggable well ui-droppable ui-sortable");
              });
    var legend_text = $("#form-title")[0].value;
    
    if(legend_text=="") {
      legend_text="Form builder demo";
    }
    selected_content.find("#form-title-div").remove();
    
    var selected_content_html = selected_content.html();
    
    var dialogContent = '<!DOCTYPE HTML>\n<html lang="en-US">\n<head>\n<meta charset="UTF-8">\n<title></title>\n';
    dialogContent+= '<link href="/demo_app/css/bootstrap.min.css" rel="stylesheet" media="screen">\n';
    dialogContent+= '<link href="/demo_app/css/bootstrap-datetimepicker.css" rel="stylesheet" media="screen">\n';
    dialogContent+= '<script type="text/javascript" src="/demo_app/js/jquery-2.1.1.min.js"></script>\n';
    dialogContent+= '<script type="text/javascript" src="/demo_app/js/moment.min.js"></script>\n';
    dialogContent+= '<script type="text/javascript" src="/demo_app/js/bootstrap-datetimepicker.js"></script>\n';
    // dialogContent+= '<script type="text/javascript" src="/demo_app/js/preview.js"></script>\n';
    dialogContent+='<style>\n'+$("#content-styles").html()+'\n</style>\n';
      
    dialogContent+= '</head>\n<body>';
    dialogContent+= '<legend>'+legend_text+'</legend>';
    dialogContent+= selected_content_html;
    dialogContent+= '<script type="text/javascript" src="/demo_app/js/preview.js"></script>\n';
    // dialogContent+= '<script>\n $(".date-picker").focus(function() {var type = $(this).parent().find( "span" ).text();if (typeof type !== "undefined") { if(type=="DD/MM/YYYY") {$(".date-picker").datetimepicker({pickTime: false});} else{$(".date-picker").datetimepicker();}}});\n</script>\n';
    dialogContent+= '\n</body></html>';
    dialogContent+='<br/><br/><b>Source code: </b><pre>'+$('<div/>').text(dialogContent).html();+'</pre>\n\n';
    dialogContent = dialogContent.replace('\n</body></html>','');
    dialogContent+= '\n</body></html>';
    
    var win = window.open("about:blank");
    win.document.write(dialogContent);
  }
    
  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}}
  
  /* Delete the control from the form */
  function delete_ctrl() {
    if(window.confirm("Are you sure ?")) {
      var ctrl_id = $("#theForm").find("[name=forCtrl]").val()
      console.log(ctrl_id);
      $("#"+ctrl_id).remove();
    }
  }
  
  /* Compile the templates for use */
  function compileTemplates() {
    window.templates = {};
    window.templates.common = Handlebars.compile($("#control-customize-template").html());
    
    /* HTML Templates required for specific implementations mentioned below */
    
    // Mostly we donot need so many templates
    window.templates.textbox = Handlebars.compile($("#textbox-template").html());
    window.templates.passwordbox = Handlebars.compile($("#textbox-template").html());
    window.templates.combobox = Handlebars.compile($("#combobox-template").html());
    window.templates.selectmultiplelist = Handlebars.compile($("#combobox-template").html());
    window.templates.radiogroup = Handlebars.compile($("#combobox-template").html());
    window.templates.checkboxgroup = Handlebars.compile($("#combobox-template").html());
    window.templates.textarea = Handlebars.compile($("#textarea-template").html());
    window.templates.date = Handlebars.compile($("#date-template").html());    
  }
  
  // Object containing specific "Save Changes" method
  save_changes = {};
  
  // Object comaining specific "Load Values" method. 
  load_values = {};
  
  /* Common method for all controls with Label and Name */
  load_values.common = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#"+ctrl_id);    

    // Gestion du chargement champs sp�cifiques
    form.find("[name=label]").val(div_ctrl.find('.control-label').text())
    var specific_load_method = load_values[ctrl_type];
    if(typeof(specific_load_method)!='undefined') {
      specific_load_method(ctrl_type, ctrl_id);   
    }
  }
  
  /* Specific method to load values from a textbox control to the customization dialog */
  load_values.textbox = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#" + ctrl_id);    
    var ctrlText = div_ctrl.find("input[type=text]")[0];
    form.find("[name=name]").val(ctrlText.name);
    form.find("[name=placeholder]").val(ctrlText.placeholder);
  }
  
  load_values.passwordbox = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#" + ctrl_id);    
    var ctrl = div_ctrl.find("input[type=password]")[0];
    form.find("[name=name]").val(ctrl.name);
    form.find("[name=placeholder]").val(ctrl.placeholder);
  }
  
  /* Specific method to load values from a combobox control to the customization dialog  */
  load_values.combobox = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#"+ctrl_id);
    var ctrl = div_ctrl.find("select")[0];
    form.find("[name=name]").val(ctrl.name)
    var options= '';
    $(ctrl).find('option').each(function(i,o) { options+=o.text+'\n'; });
    form.find("[name=options]").val($.trim(options));
  }
  // Multi-select combobox has same customization features
  load_values.selectmultiplelist = load_values.combobox;
  
  /* Specific method to load values from a radio group */
  load_values.radiogroup = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#"+ctrl_id);
    var options= '';
    var ctrls = div_ctrl.find("div").find("span");
    var radios = div_ctrl.find("div").find("input");
    
    ctrls.each(function(i,o) { options+=$(o).text()+'\n'; });
    form.find("[name=name]").val(radios[0].name)
    form.find("[name=options]").val($.trim(options));
  }
  
  // Checkbox group  customization behaves same as radio group
  load_values.checkboxgroup = load_values.radiogroup;
  
  /* Specific method to load values from a button */
  load_values.btn = function(ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#"+ctrl_id);
    var ctrl = div_ctrl.find("button")[0];
    form.find("[name=name]").val(ctrl.name)   
    form.find("[name=label]").val($(ctrl).text().trim())    
  }

  /* Specific method to load values from a text to the customization dialog */
  load_values.textarea = function (ctrl_type, ctrl_id) {    
    var form = $("#theForm");
    var div_ctrl = $("#" + ctrl_id);
    var ctrlText = div_ctrl.find(".ctrl-textarea");
    form.find("[name=name]").val(ctrlText[0].name);
    form.find("[name=textarea]").val(ctrlText.text());
  }

  /* Specific method to load values from a date to the customization dialog */
  load_values.date = function (ctrl_type, ctrl_id) {
    var form = $("#theForm");
    var div_ctrl = $("#" + ctrl_id);    
    var ctrlText = div_ctrl.find(".ctrl-date");
    $("#handlebars-textbox-formatdate").val($(ctrlText[0]).text());
    // form.append('<p><input type="text" id="'+ctrl_id+'"input "> </input></p>');
  }

  
  /* Common method to save changes to a control  - This also calls the specific methods */
  save_changes.common = function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    div_ctrl.find('.control-label').text(values.label);


    var specific_save_method = save_changes[values.type];
    if(typeof(specific_save_method)!='undefined') {
      specific_save_method(values);   
    }
  }
  
  /* Specific method to save changes to a text box */
  save_changes.textbox = function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    var ctrlText = div_ctrl.find("input[type=text]")[0];
    // var ctrl = div_ctrl.find("input")[0];
    ctrlText.placeholder = values.placeholder;
    ctrlText.name = values.name;
  }

  // Password box customization behaves same as textbox
  save_changes.passwordbox= function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    var ctrl = div_ctrl.find("input[type=password]")[0];
    ctrl.placeholder = values.placeholder;
    ctrl.name = values.name;
  }

  /* Specific method to save changes to a combobox */
  save_changes.combobox = function(values) {
    console.log(values);
    var div_ctrl = $("#"+values.forCtrl);
    var ctrl = div_ctrl.find("select")[0];
    ctrl.name = values.name;
    $(ctrl).empty();
    $(values.options.split('\n')).each(function(i,o) {
      $(ctrl).append("<option>"+$.trim(o)+"</option>");
    });
  }
  
  /* Specific method to save a radiogroup */
  save_changes.radiogroup = function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    
    var label_template = $(".selectorField .ctrl-radiogroup span")[0];
    var radio_template = $(".selectorField .ctrl-radiogroup input")[0];    
    var ctrl = div_ctrl.find(".ctrl-radiogroup");
    ctrl.empty();
    $(values.options.split('\n')).each(function(i,o) {
      var label = $(label_template).clone().text($.trim(o))
      var radio = $(radio_template).clone();
      radio[0].name = values.name;
      label.prepend(radio);
      $(ctrl).append(label);
    });
  }
  
  /* Same as radio group, but separated for simplicity */
  save_changes.checkboxgroup = function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    
    var label_template = $(".selectorField .ctrl-checkboxgroup span")[0];
    var checkbox_template = $(".selectorField .ctrl-checkboxgroup input")[0];
    
    var ctrl = div_ctrl.find(".ctrl-checkboxgroup");
    ctrl.empty();
    $(values.options.split('\n')).each(function(i,o) {
      var label = $(label_template).clone().text($.trim(o))
      var checkbox = $(checkbox_template).clone();
      checkbox[0].name = values.name;
      label.prepend(checkbox);
      $(ctrl).append(label);
    });
  }
  
  // Multi-select customization behaves same as combobox
  save_changes.selectmultiplelist = save_changes.combobox;
  
  /* Specific method for Button */
  save_changes.btn = function(values) {
    var div_ctrl = $("#"+values.forCtrl);
    var ctrl = div_ctrl.find("button")[0];
    $(ctrl).html($(ctrl).html().replace($(ctrl).text()," "+$.trim(values.label)));
    ctrl.name = values.name;
    //console.log(values);
  }
  
  /* Specific method to save changes to a text box */
  save_changes.textarea = function (values) {
    save_changes_simple_text(values, ".ctrl-textarea", values.textarea)
  }

  /* Specific method to save changes to a text box */
  save_changes.date = function (values) {
    save_changes_simple_text(values, ".ctrl-date", values.dateformat)
  }

  function save_changes_simple_text(values, ctrl, value) {
    var div_ctrl = $("#" + values.forCtrl);
    var ctrlText = div_ctrl.find(ctrl);
    ctrlText.text(value);
    ctrlText[0].name = values.name;
  }

  /* Save the changes due to customization 
    - This method collects the values and passes it to the save_changes.methods
  */
  function save_customize_changes(e, obj) {
    //console.log('save clicked', arguments);
    var formValues = {};
    var val=null;
    $("#theForm").find("input, textarea, select").each(function(i,o) {
      if(o.type=="checkbox"){
        val = o.checked;
      }
      else {
        val = o.value;
      }
      formValues[o.name] = val;
    });

    save_changes.common(formValues);
  }
  
  /*
    Opens the customization window for this
  */
  function customize_ctrl(ctrl_type, ctrl_id) {
    console.log(ctrl_type);
    var ctrl_params = {};

    /* Load the specific templates */
    var specific_template = templates[ctrl_type];
    if(typeof(specific_template)=='undefined') {
      specific_template = function(){return ''; };
    }
    var modal_header = $("#"+ctrl_id).find('.control-label').text();
    
    var template_params = {
      header:modal_header, 
      content: specific_template(ctrl_params), 
      type: ctrl_type,
      forCtrl: ctrl_id,
      displayNom: ctrl_type == 'text' || ctrl_type == 'date' ? 'none' : 'block'
    }
    
    // Pass the parameters - along with the specific template content to the Base template
    var s = templates.common(template_params) + "";
    var arr = s.split('</h3>');
    $(".modal-header").html(arr[0]+"</h3>");
    $(".modal-body").html(arr[1]);
    $('#myModal').css('z-index', '1500');
    $('#myModal').modal({});
    // .modal({});

    setTimeout(function() {
      // For some error in the code  modal show event is not firing - applying a manual delay before load
      load_values.common(ctrl_type, ctrl_id);
    },300);
  }

  function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
      o.addClass("ui-state-error");
      updateTips("Length of " + n + " must be between " +
        min + " and " + max + ".");
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
      o.addClass("ui-state-error");
      updateTips(n);
      return false;
    } else {
      return true;
    }
  }