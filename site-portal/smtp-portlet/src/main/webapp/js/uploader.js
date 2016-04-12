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

//Set Parsley Validators
$(function(){
	// Parsley validator to validate xml extension.
	window.ParsleyValidator.addValidator('filetype',function(value,requirement){
		var ext=value.split('.').pop().toLowerCase();
		return ext === requirement;	
	},32).addMessage('en','filetype','The selected C-CDA file must be an xml file(.xml)');
	
	
	// parsley Validator to validate the file size
	window.ParsleyValidator.addValidator('maxsize',function(value,requirement){
		var file_size=$('#ccdauploadfile')[0].files[0];
		return file_size.size < requirement*1024*1024;
	},32).addMessage('en','maxsize','The uploaded file size exceeds the maximum file size of 3 MB.');
	
});

$(function() {
	'use strict';
	// Change this to the location of your server-side upload handler:
	$('#ccdauploadprogress').hide();
	$('#ccdauploadfile').fileupload({
		url : $( '#ccdauploadform' ).attr( 'action' ),
		dataType : 'json',
		autoUpload : false,
		type : 'POST',
		contenttype : false,
		replaceFileInput : false,
		error: function (e, data) {
			var iconurl = window.currentContextPath + "/images/icn_alert_error.png" ;
			$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
        	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text('Error uploading file.');
			
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
		done : function(e, data) {
			var results = data.result.body;
        	var iconurl = (results.IsSuccess == "true")? window.currentContextPath + "/images/icn_alert_success.png" :
        									window.currentContextPath + "/images/icn_alert_error.png" ;
        	$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
        	
        	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text(results.ErrorMessage);
        	
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

			window.setTimeout(function() {
				$('#ccdauploadprogress').fadeOut(400, function() {
					$('#ccdauploadprogress .progress-bar').css('width', '0%');
				});
			}, 1000);
		},
		progressall : function(e, data) {
			var progressval = parseInt(data.loaded / data.total * 100, 10);
			if(progressval < 99){
		    	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text('Uploading...');
		   		$('#directreceivewidget .blockMsg .progressorpanel .progressor').text( floorFigure(data.loaded/data.total*100,0).toString()+"%" );
		    }else{
		    	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text('Sending...');
		    	$('#directreceivewidget .blockMsg .progressorpanel .progressor').text('');
		    }
		}
	}).on('fileuploadadd', function(e, data) {
		$('#ccdauploadsubmit').unbind("click");
		$('#ccdauploadfiles').empty();
		data.context = $('<div/>').appendTo('#ccdauploadfiles');
		$.each(data.files, function(index, file) {
			var node = $('<p/>').append($('<span/>').text(file.name));
			node.appendTo(data.context);
		});
		data.context = $('#ccdauploadsubmit').click(function(e) {
			// unsubscribe callbacks from previous uploads
			$('#ccdauploadform').parsley(parsleyOptions).unsubscribe('parsley:form:validate');
			// calling the Parsley Validator.
			$('#ccdauploadform').parsley(parsleyOptions).subscribe('parsley:form:validate',function(formInstance){
				
				formInstance.submitEvent.preventDefault();
				if(formInstance.isValid()==true){
					blockDirectReceiveWidget();
					data.submit();
				}
			});
		});
	}).prop('disabled', !$.support.fileInput).parent().addClass(
			$.support.fileInput ? undefined : 'disabled');

	$('#ccdauploadfile').bind('fileuploaddrop', function(e, data) {
		e.preventDefault();
	}).bind('fileuploaddragover', function(e) {
		e.preventDefault();
	});
	
	$('#ccdauploadsubmit').click(function(e) {
		
		// unsubscribe callbacks from previous uploads
		$('#ccdauploadform').parsley(parsleyOptions).unsubscribe('parsley:form:validate');
		// calling the Parsley Validator.
		$('#ccdauploadform').parsley(parsleyOptions).subscribe('parsley:form:validate',function(formInstance){
			
			formInstance.submitEvent.preventDefault();
			if(formInstance.isValid()==true){
				var hideMsg3 = $("#CCDA1fileupload").parsley();
				window.ParsleyUI.removeError(hideMsg3,'required');
			}
		});
});	

});