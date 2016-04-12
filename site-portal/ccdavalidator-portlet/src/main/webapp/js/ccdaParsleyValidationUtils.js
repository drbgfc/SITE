	// Set Parsley Options
var ccdaParsleyOptions  = (function() {
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

    return {
        getOptions : function() {
        	return parsleyOptions;
        }
    };
})();

// Set Parsley Validators
$(function(){
	// Parsley validator to validate xml extension.
	window.ParsleyValidator.addValidator('filetype',function(value,requirement){
		var ext=value.split('.').pop().toLowerCase();
		return ext === requirement;	
	},32).addMessage('en','filetype','The selected C-CDA file must be an xml file(.xml)');
	
	// parsley Validator to validate the file size
	window.ParsleyValidator.addValidator('maxsize',function(value,requirement){
		var file_size=$('#CCDA1fileupload')[0].files[0];
		return file_size.size < requirement*1024*1024;
	},32).addMessage('en','maxsize','The uploaded file size exceeds the maximum file size of 3 MB.');
	
	// parsley Validator
	window.ParsleyValidator.addValidator('r2maxsize',function(value,requirement){
		var file_size=$('#CCDAR2_0Fileupload')[0].files[0];
		return file_size.size < requirement*1024*1024;
	},32).addMessage('en','r2maxsize','The uploaded file size exceeds the maximum file size of 3 MB.');
	
	// parsley Validator to validate generated file
	window.ParsleyValidator.addValidator('generatedmaxsize',function(value,requirement){
		var file_size=$('#CCDAReferenceCEHRTFileupload')[0].files[0];
		return file_size.size < requirement*1024*1024;
	},32).addMessage('en','generatedmaxsize','The uploaded file size exceeds the maximum file size of 3 MB.');	
});