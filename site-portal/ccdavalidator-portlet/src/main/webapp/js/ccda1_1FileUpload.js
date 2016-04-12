$(function() {
	'use strict';
	$('#progress').hide();
	$('#CCDA1fileupload').fileupload({
		url : urlCCDA1_1,
		dataType : 'json',
		autoUpload : false,
		type : 'POST',
		contenttype : false,
		replaceFileInput : false,
		error: function(jqXHR, textStatus, errorThrown) {
			handleFileUploadError();
        },
		done : function(e, data) {
			doCcdaValidation(data);
		},
		progressall : function(e, data) {
			showFileValidationProgress(data);
		}
	}).on('fileuploadadd', function(e, data) {
		$('#CCDA1formSubmit').unbind("click");
		$('#CCDA1files').empty();
		data.context = $('<div/>').appendTo('#CCDA1files');
		$.each(data.files, function(index, file) {
			var node = $('<p/>').append($('<span/>').text(file.name));
			node.appendTo(data.context);
		});
		data.context = $('#CCDA1formSubmit').click(function(e) {
				// unsubscribe callbacks from previous uploads
				$('#CCDA1ValidationForm').parsley(ccdaParsleyOptions.getOptions()).unsubscribe('parsley:form:validate');
				// calling the Parsley Validator.
				$('#CCDA1ValidationForm').parsley(ccdaParsleyOptions.getOptions()).subscribe('parsley:form:validate',function(formInstance){
					formInstance.submitEvent.preventDefault();
					if(formInstance.isValid()==true){
						var hideMsg3 = $("#CCDA1fileupload").parsley();
						window.ParsleyUI.removeError(hideMsg3,'required');
						$( "#ValidationResult [href='#tabs-1']").trigger( "click" );
						BlockPortletUI();
						var selectedValue = $("#CCDA1_type_val").val();
						data.formData = { };
						if (selectedValue != undefined) {
							data.formData.ccda_type_val = selectedValue;
						}
						data.submit();
						window.lastFilesUploaded = data.files;
					}
				});
			});
		})
		.prop('disabled', !$.support.fileInput).parent().addClass(
			$.support.fileInput ? undefined : 'disabled');

	$('#CCDA1fileupload').bind('fileuploaddrop', function(e, data) {
		e.preventDefault();
	}).bind('fileuploaddragover', function(e) {
		e.preventDefault();
	});
	
	$('#CCDA1formSubmit').click(function(e) {
			// unsubscribe callbacks from previous uploads
			$('#CCDA1ValidationForm').parsley(ccdaParsleyOptions.getOptions()).unsubscribe('parsley:form:validate');
			// calling the Parsley Validator.
			$('#CCDA1ValidationForm').parsley(ccdaParsleyOptions.getOptions()).subscribe('parsley:form:validate',function(formInstance){
				formInstance.submitEvent.preventDefault();
				if(formInstance.isValid()==true){
					var hideMsg3 = $("#CCDA1fileupload").parsley();
					window.ParsleyUI.removeError(hideMsg3,'required');
				}
			});
	});	
	
	$('#CCDA1fileupload-btn').bind('click', function(e, data){
		//$('#CCDA1ValidationForm .formError').hide(0);
		var selectedText = $("#CCDA1_type_val :selected").text();
		$("#CCDA1_type_val option").each(function() {
			  if($(this).text() == selectedText) {
			    $(this).attr('selected', 'selected');
			  } else {
				$(this).removeAttr('selected');
			  }
			});
		$('#CCDA1ValidationForm').trigger('reset');
		$('#CCDA1formSubmit').unbind("click");
		$('#CCDA1files').empty();
	});
});