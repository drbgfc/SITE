
var parsleyOptions = {
		trigger: 'change',
		successClass: "has-success",
		errorClass: "alert alert-danger",
		classHandler: function (el) {
			return el.$element.closest(".form-group").children(".infoArea");
		},
		errorsContainer: function (el) {
			return el.$element.closest(".form-group").children(".infoArea");
		},
		errorsWrapper: '<ul></ul>',
		errorElem: '<li></li>'
};

function progressorHandlingFunction(e){
    if(e.lengthComputable){
    	//var progressorval = floorFigure(e.loaded/e.total*100,0);
    	/*
    	if(progressorval < 99)
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Uploading...');
    		$('.blockMsg .progressorpanel .progressor').text( floorFigure(e.loaded/e.total*100,0).toString()+"%" );
    	}
    	else
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Validating...');
    		$('.blockMsg .progressorpanel .progressor').text('');
    	}
    	*/
    }
}

$('#smtpsearchform').parsley(parsleyOptions).unsubscribe('parsley:form:validate');
$('#smtpsearchform').parsley(parsleyOptions).subscribe('parsley:form:validate',function(formInstance){     	
	if(formInstance.isValid()==true){
		blockSmtpSearchWidget();
		$.ajax({
			url: $('#smtpsearchform').attr('action'),
			type: 'POST',
			data: $('#smtpsearchform').serializefiles(),
			success: function(data){
				var results = JSON.parse(data);
				var iconurl = (results.searchResults.length > 0)? window.currentContextPath + "/images/icn_alert_success.png" :
					window.currentContextPath + "/images/icn_alert_error.png" ;

				$('#smtpsearchwidget .blockMsg .progressorpanel img').attr('src',iconurl);
				if(results.searchResults.length > 0){
					$('#smtpsearchwidget .blockMsg .progressorpanel .lbl').text("found " + results.searchResults.length + " results");
				}else{
					$('#smtpsearchwidget .blockMsg .progressorpanel .lbl').text("no messages found.");
				}

				if(window.smtpSearchWdgt)
				{
					window.smtpSearchTimeout = setTimeout(function(){
						window.smtpSearchWdgt.unbind("click");
						window.smtpSearchWdgt.unblock();
					},10000);

					window.smtpSearchWdgt.bind("click", function() { 
						window.smtpSearchWdgt.unbind("click");
						clearTimeout(window.smtpSearchTimeout);
						window.smtpSearchWdgt.unblock(); 
						window.smtpSearchWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
					});
				}

				Liferay.Portlet.refresh("#p_p_id_Statistics_WAR_siteportalstatisticsportlet_"); // refresh the counts

				if(results.searchResults.length > 0){
					var count = 0;
					var tabHtml1 = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
					$.each(results.searchResults, function(key,value) {
						var messageSubject = value.messageSubject;
						var messageFrom = value.messageFrom;
						var messageBody = value.messageBody;
						var messageSentDate = new Date(value.messageSentDate);
						var messageReceivedDate = value.messageReceivedDate;
						var attachments = value.attachments;
						var attachmentName = attachments[0].attachmentName;
						var attachmentBody = attachments[0].attachmentBody;
						tabHtml1 += '<div class="panel panel-default" id="accordion'+count+'">';
						tabHtml1 += ' <div class="panel-heading" role="tab" id="heading'+count+'">';
						tabHtml1 += '  <h4 class="panel-title">';
						tabHtml1 += '    <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#accordion'+count+'collapse" aria-expanded="false" aria-controls="accordion'+count+'collapse" >';
						tabHtml1 += '<div class="clearfix"><div class="col-lg-2"><strong>DATE SENT: </strong>' + messageSentDate.toLocaleString() + '</div><div  class="col-lg-10"><strong> ATTACHMENT NAME: </strong>' + attachmentName + '</div></div>';
						tabHtml1 += '    </a>';
						tabHtml1 += '  </h4>';
						tabHtml1 += ' </div>';
						tabHtml1 += ' <div id="accordion'+count+'collapse" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+count+'">';
						tabHtml1 += '	<div class="panel-body">' + attachmentBody + '</div>';
						tabHtml1 += ' </div>';
						tabHtml1 += '</div>';

						count++;
					}); 
					tabHtml1 += "</div>";

					$("#SMTPSearchResult").html(tabHtml1);
					$("#resultsDialog").modal("show");
				}
			},
			error: function (request, status, error) {
				var iconurl = window.currentContextPath + "/images/icn_alert_error.png" ;
				$('#smtpsearchwidget .blockMsg .progressorpanel img').attr('src',iconurl);
				$('#smtpsearchwidget .blockMsg .progressorpanel .lbl').text('Encountered and error while searching.');

				if(window.smtpSearchWdgt)
				{
					window.smtpSearchTimeout = setTimeout(function(){
						window.smtpSearchWdgt.unbind("click");
						window.smtpSearchWdgt.unblock();
					},10000);


					window.smtpSearchWdgt.bind("click", function() { 
						window.smtpSearchWdgt.unbind("click");
						clearTimeout(window.smtpSearchTimeout);
						window.smtpSearchWdgt.unblock(); 
						window.smtpSearchWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
					});

				}
			},
			//Options to tell JQuery not to process data or worry about content-type
			cache: false,
			contentType: false,
			processData: false
		});
	}
	formInstance.submitEvent.preventDefault();
});

$('#precannedForm').parsley(parsleyOptions).unsubscribe('parsley:form:validate');
$('#precannedForm').parsley(parsleyOptions).subscribe('parsley:form:validate',function(formInstance){     	
	if(formInstance.isValid()==true){
		blockDirectReceiveWidget();
		var formData = $('#precannedForm').serializefiles();
		$.ajax({
			url: $('#precannedForm').attr('action'),
			type: 'POST',
			xhr: function() {  // custom xhr
				myXhr = $.ajaxSettings.xhr();
//				if(myXhr.upload){ // check if upload property exists
//					myXhr.upload.addEventListener('progressor', progressorHandlingFunction, false); // for handling the progressor of the upload
//				}
				return myXhr;
			},
			success: function(data){
				var results = JSON.parse(data);
				var iconurl = (results.body.IsSuccess == "true")? window.currentContextPath + "/images/icn_alert_success.png" :
					window.currentContextPath + "/images/icn_alert_error.png" ;

				$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
				$('#directreceivewidget .blockMsg .progressorpanel .lbl').text(results.body.ErrorMessage);
				if(window.directReceiveWdgt){
					window.directReceiveUploadTimeout = setTimeout(function(){
						window.directReceiveWdgt.unbind("click");
						window.directReceiveWdgt.unblock();
					},10000);

					window.directReceiveWdgt.bind("click", function() { 
						window.directReceiveWdgt.unbind("click");
						clearTimeout(window.directReceiveUploadTimeout);
						window.directReceiveWdgt.unblock(); 
						window.directReceiveWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
					});
				}
				Liferay.Portlet.refresh("#p_p_id_Statistics_WAR_siteportalstatisticsportlet_"); // refresh the counts
			},

			error: function (request, status, error) {
				var iconurl = window.currentContextPath + "/images/icn_alert_error.png" ;
				$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
				$('#directreceivewidget .blockMsg .progressorpanel .lbl').text('Error sending sample C-CDA file.');

				if(window.directReceiveWdgt){
					window.directReceiveUploadTimeout = setTimeout(function(){
						window.directReceiveWdgt.unbind("click");
						window.directReceiveWdgt.unblock();
					},10000);

					window.directReceiveWdgt.bind("click", function() { 
						window.directReceiveWdgt.unbind("click");
						clearTimeout(window.directReceiveUploadTimeout);
						window.directReceiveWdgt.unblock(); 
						window.directReceiveWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
					});

				}
			},
			// Form data
			data: formData,
			//Options to tell JQuery not to process data or worry about content-type
			cache: false,
			contentType: false,
			processData: false
		});
	}
	formInstance.submitEvent.preventDefault();
});

(function($) {
	$.fn.serializefiles = function() {
		var obj = $(this);
		/* ADD FILE TO PARAM AJAX */
		var formData = new FormData();
		$.each($(obj).find("input[type='file']"), function(i, tag) {
			$.each($(tag)[0].files, function(i, file) {
				formData.append(tag.name, file);
			});
		});
		var params = $(obj).serializeArray();
		$.each(params, function (i, val) {
			formData.append(val.name, val.value);
		});
		return formData;
	};
})(jQuery);

function blockDirectReceiveWidget(){
	var ajaximgpath = window.currentContextPath + "/images/ajax-loader.gif";
	window.directReceiveWdgt = $('#directreceivewidget  .well');
	window.directReceiveWdgt.block({ 
		css: { 
			border: 'none', 
			padding: '15px', 
			backgroundColor: '#000', 
			'-webkit-border-radius': '10px', 
			'-moz-border-radius': '10px', 
			opacity: .5, 
			color: '#fff' 
		},
		message: '<div class="progressorpanel">' +
		'<img src="'+ ajaximgpath + '" alt="loading">'+
		'<div class="lbl">Sending...</div></div>',
	});
}

function unblockDirectReceiveWidget(){
	if(window.directReceiveWdgt)
		window.directReceiveWdgt.unblock();
}

function blockSmtpSearchWidget(){
	var ajaximgpath = window.currentContextPath + "/images/ajax-loader.gif";
	window.smtpSearchWdgt = $('#smtpsearchwidget  .well');
	window.smtpSearchWdgt.block({ 
		css: { 
			border: 'none', 
			padding: '15px', 
			backgroundColor: '#000', 
			'-webkit-border-radius': '10px', 
			'-moz-border-radius': '10px', 
			opacity: .5, 
			color: '#fff' 
		},
		message: '<div class="progressorpanel">' +
		'<img src="'+ ajaximgpath + '" alt="loading">'+
		'<div class="lbl">Searching...</div></div>',
	});
}

function unblockSmtpSearchWidget(){
	if(window.smtpSearchWdgt)
		window.smtpSearchWdgt.unblock();
}

$(function() {
	$('.dropdown-menu').click(function (e) {
		e.stopPropagation();
	});

	$('#directMessageType a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	$('#precannedemail').bind('change',function(){
		$('#ccdauploademail').val($(this).val());
	});

	$('#ccdauploademail').bind('change',function(){
		$('#precannedemail').val($(this).val());
	});

	$('.module_content #uploadccdainput').filestyle({ 
		image: window.currentContextPath + "/images/button_upload.png",
		imageheight : 24,
		imagewidth : 115,
		width : 250,
		isdisabled: true
	});

	$("#ccdafiletreepanel").jstree({
		"json_data" : {
			"ajax" : {
				"url" : sampleCCDATreeURL,
				"type" : "post",
			}
		},
		"types" : {
			"valid_children" : [ "all" ],
			"type_attr" : "ref",
			"types" : {
				"root" : {
					"icon" : {
						"image" : window.currentContextPath + "/images/root.png"
					},
					"valid_children" : [ "file","folder" ],
					"max_depth" : 2,
					"hover_node" : false,
					"select_node" : function (e) {
						this.toggle_node(e);
						return false;
					}
				},
				"file" : {
					"icon" : {
						"image" : window.currentContextPath + "/images/file.png"
					},
					"valid_children" : [ "none" ],
					"deselect_node" : function (node,e) {
						//$('#precannedForm .formError').hide(0);
						$('#precannedfilepath.infoArea').hide();
						var textValue = $('#precannedemail').val();
						$('#precannedForm').trigger('reset');
						$('#precannedCCDAsubmit').unbind("click");
						$('#precannedfilePathOutput').empty();
						$('#precannedfilepath').val('');
						$('#precannedemail').val(textValue);
					},
					"select_node" : function (node,e) {
						$('#precannedfilepath.infoArea').hide();
						//$('#precannedForm .formError').hide(0);
						//populate the textbox
						$("#precannedfilepath").val(node.data("serverpath"));
						$("#precannedfilePathOutput").text($("#precannedfilepath").val());
						//hide the drop down panel
						$('[data-toggle="dropdown"]').parent().removeClass('open');
						//hide all the errors
						$('#dLabel').focus();
						$('#dLabel').dropdown("toggle");

					}
				},
				"folder" : {
					"icon" : {
						"image" : window.currentContextPath + "/images/folder.png"
					},
					"valid_children" : [ "file" ],
					"select_node" : function (e) {
						e.find('a:first').focus();
						this.toggle_node(e);
						return false;
					}
				}
			}
		},
		"plugins" : [ "themes", "json_data", "ui", "types" ]
	}).bind('loaded.jstree', function(e, data) {
		isfiletreeloaded = true;

		$('#ccdafiletreepanel').find('a').each(function() {
			$(this).attr('tabindex', '1');
		});
	});
	
	

	

});