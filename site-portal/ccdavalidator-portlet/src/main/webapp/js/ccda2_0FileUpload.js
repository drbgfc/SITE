$(function() {
	'use strict';
	$('#progress').hide();
	$('#CCDAR2_0ValidationForm').fileupload({
		url : urlCCDA2_0,
		dataType : 'json',
		autoUpload : false,
		type : 'POST',
		contenttype : false,
		replaceFileInput : false,
		error: function(jqXHR, textStatus, errorThrown) {
			handleFileUploadError();
        },
		done : function(e, data) {
			showValidationResults(data);
		},
		progressall : function(e, data) {
			showFileValidationProgress(data);
		}
	}).on('fileuploadadd', function(e, data) {
		$('#CCDAR2_0FormSubmit').unbind("click");
		$('#CCDAR2_0Files').empty();
		data.context = $('<div/>').appendTo('#CCDAR2_0Files');
		$.each(data.files, function(index, file) {
			var node = $('<p/>').append($('<span/>').text(file.name));
			node.appendTo(data.context);
		});
		data.context = $('#CCDAR2_0FormSubmit').click(function(e) {
				// unsubscribe callbacks from previous uploads
				$('#CCDAR2_0ValidationForm').parsley(ccdaParsleyOptions.getOptions()).unsubscribe('parsley:form:validate');
				// calling the Parsley Validator.
				$('#CCDAR2_0ValidationForm').parsley(ccdaParsleyOptions.getOptions()).subscribe('parsley:form:validate',function(formInstance){
					formInstance.submitEvent.preventDefault();
					if(formInstance.isValid()==true){
						var hideMsg3 = $("#CCDAR2_0Fileupload").parsley();
						window.ParsleyUI.removeError(hideMsg3,'required');
						$( "#ValidationResult [href='#tabs-1']").trigger( "click" );
						BlockPortletUI();
						var selectedValue = $("#CCDAR2_0_type_val").val();
						var selectedReferenceValue = $("#referenceFileUsedFilepath").val();
						data.formData = { };
						if (selectedValue != undefined) {
							data.formData.CCDAR2_0_type_val = selectedValue;
							data.formData.referenceFileUsed = selectedReferenceValue;
						}
						data.submit();
						window.lastFilesUploaded = data.files;
					}
				});
			});
		})
		.prop('disabled', !$.support.fileInput).parent().addClass(
			$.support.fileInput ? undefined : 'disabled');

	$('#CCDAR2_0Fileupload').bind('fileuploaddrop', function(e, data) {
		e.preventDefault();
	}).bind('fileuploaddragover', function(e) {
		e.preventDefault();
	});
	
	$('#CCDAR2_0FormSubmit').click(function(e) {
			// unsubscribe callbacks from previous uploads
			$('#CCDAR2_0ValidationForm').parsley(ccdaParsleyOptions.getOptions()).unsubscribe('parsley:form:validate');
			// calling the Parsley Validator.
			$('#CCDAR2_0ValidationForm').parsley(ccdaParsleyOptions.getOptions()).subscribe('parsley:form:validate',function(formInstance){
				formInstance.submitEvent.preventDefault();
				if(formInstance.isValid()==true){
					var hideMsg3 = $("#CCDAR2_0Fileupload").parsley();
					window.ParsleyUI.removeError(hideMsg3,'required');
				}
			});
	});	
	
	$('#CCDAR2_0Fileupload-btn').bind('click', function(e, data){
		//$('#CCDA1ValidationForm .formError').hide(0);
		var selectedText = $("#CCDAR2_0_type_val :selected").text();
		$("#CCDAR2_0_type_val option").each(function() {
			  if($(this).text() == selectedText) {
			    $(this).attr('selected', 'selected');
			  } else {
				$(this).removeAttr('selected');
			  }
			});
		$('#CCDAR2_0ValidationForm').trigger('reset');
		$('#CCDAR2_0FormSubmit').unbind("click");
		$('#CCDAR2_0Files').empty();
	});
});