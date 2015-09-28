var ccdaErrorCount;
var ccdaWarningCount;
var ccdaInfoCount;
var extendedErrorCount;
var extendedWarningCount;
var extendedInfoCount;
var dataQualityConcernCount;
var validationError;

function showValidationResults(data){
	var tabHtml1 = buildCcdaValidationResultsHtml(data);
	showResults(tabHtml1);
    updateStatisticCount();
    removeProgressModal();
    
    hideSummaryHeadersOfNotYetImplementedValidators();
}

function buildCcdaValidationResultsHtml(data){
	var tabHtml1 = buildCcdaValidationSummary(data);
	tabHtml1 += buildCcdaValidationResults(data);
	
	return tabHtml1;
}

function buildCcdaValidationSummary(data){
	var uploadedFileName = data.result.files[0].name;
	var docTypeSelected = data.result.body.resultsMetaData.ccdaDocumentType;
	var numberOfTypesOfErrorsPerGroup = 3; //error, warning, info
	var resultTypeCount = 0;
	var resultGroup = '';
	var resultCountBadgeColorClass = '';
	var resultGroupHTMLHeader = '<div class="panel panel-primary col-md-2 col-lg-2"><div><div class="list-group">';
	var resultGroupHTMLEnd = '</div></div></div>';
	if(documentTypeIsNonSpecific(docTypeSelected)){
		docTypeSelected = buildValidationHeaderForNonSpecificDocumentType(docTypeSelected);
	}
	
	var tabHtml1 = buildValidationResultsHeader(uploadedFileName, docTypeSelected).join('\n');
	tabHtml1 += '<br/><div class="row">';
	
	$.each(data.result.body.resultsMetaData.resultMetaData, function(resultMetaData, metaData){
		if(metaData.type.toLowerCase().indexOf("error") >= 0){
			resultCountBadgeColorClass = 'btn-danger';
		}else if(metaData.type.toLowerCase().indexOf("warn") >= 0){
			resultCountBadgeColorClass = ' btn-warning';
		}else{
			resultCountBadgeColorClass = 'btn-info';
		}
		resultGroup += '<div class="list-group-item"><span class="badge ' + resultCountBadgeColorClass + '">'+metaData.count+'</span><a href="#'+metaData.type+'">' + metaData.type + '</a></div>';
		resultTypeCount++;
		if(resultTypeCount % numberOfTypesOfErrorsPerGroup === 0){
			tabHtml1 += '<div id="'+metaData.type.substr(0, +metaData.type.lastIndexOf("_"))+'_SUMMARY">' + resultGroupHTMLHeader + resultGroup + resultGroupHTMLEnd + '</div>';
			resultGroup = "";
		}
	});
	tabHtml1 += '</div>';
	return tabHtml1;
}

function buildCcdaValidationResults(data){
	resultList = [];
	var currentResultType;
	$.each(data.result.body.ccdaValidationResults, function(ccdaValidationResults,result){
		if(result.type.toLowerCase().indexOf("error") >= 0){
			resultList.push('<font color="red">');
		}else if(result.type.toLowerCase().indexOf("warn") >= 0){
			resultList.push('<font color="orange">');
		}else{
			resultList.push('<font color="#5bc0de">');
		}
		
		if(currentResultType != result.type.toLowerCase()){
			resultList.push('<a href="#" name="'+ result.type + '"></a>');
		}
		
		var errorDescription = ['<li>' + result.type + '<ul class="">',
				                    	'<li class="">Description: '+ result.description + '</li>',
			                    		'<li class="">xPath: '+ result.xPath + '</li>',
			                    		'<li class="">Document Line Number: '+ result.documentLineNumber + '</li>',
		                    		'</ul></li>'];
		resultList = resultList.concat(errorDescription);
		resultList.push('</font>');
		resultList.push('<hr/><div class="pull-right"><a href="#validationResults" title="top">^</a></div>');
		currentResultType = result.type.toLowerCase();
	});
	return (resultList.join('\n'));
}

function hideSummaryHeadersOfNotYetImplementedValidators(){
	$("#CCDA_VOCAB_SUMMARY").hide();
	$("#REF_CCDA_SUMMARY").hide();
}

function buildCcdaErrorList(data){
	var errorList = ['<a name="ccdaErrors"/><b>C-CDA Validation Errors:</b>',
	                 '<ul>'];
	var errors = data.result.body.ccdaResults.errors;
	var nErrors = errors.length;
	for (var i=0; i < nErrors; i++){
		var error = errors[i];
		var message = error.message;
		var path = error.path;
		var lineNum = error.lineNumber;
		var source = error.source;
		var errorDescription = ['<li> ERROR '+(i+1).toString()+'',
		                    '<ul>',
		                    	'<li>Message: '+ message + '</li>',
		                    '</ul>',
		                    '<ul>',
	                    		'<li>Path: '+ path + '</li>',
	                    	'</ul>',
	                    	'<ul>',
	                    		'<li>Line Number (approximate): '+ lineNum + '</li>',
	                    	'</ul>',
	                    	'<ul>',
                    			'<li>Source: (approximate): '+ source + '</li>',
                    		'</ul>',
                    		'</li>'
		                    ];
		errorList = errorList.concat(errorDescription);
	}
	errorList.push('</ul>');
	errorList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
	return (errorList.join('\n'));
}

function buildExtendedCcdaErrorList(data){
	var errorList = ['<a name="vocabularyErrors"/><b>Vocabulary Validation Errors:</b>',
	                 '<ul>'];
	var errors = data.result.body.ccdaExtendedResults.errorList;
	var nErrors = errors.length;
	for (var i=0; i < nErrors; i++){
		var error = errors[i];
		var message = error.message;
		var codeSystemName = error.codeSystemName;
		var xpathExpression = error.xpathExpression;
		var codeSystem = error.codeSystem;
		var code = error.code;
		var displayName = error.displayName;
		var nodeIndex = error.nodeIndex;
		var errorDescription = ['<li> ERROR '+(i+1).toString()+'',
		                    '<ul>',
		                    	'<li>Message: '+ message + '</li>',
		                    '</ul>',
		                    '<ul>',
	                    		'<li>Code System Name: '+ codeSystemName + '</li>',
	                    	'</ul>',
	                    	'<ul>',
	                    		'<li>XPath Expression: '+ xpathExpression + '</li>',
	                    	'</ul>',
	                    	'<ul>',
                    			'<li>Code System: '+ codeSystem + '</li>',
                    		'</ul>',
	                    	'<ul>',
                				'<li>Code: '+ code + '</li>',
                			'</ul>',
                			'<ul>',
                				'<li>Display Name: '+ displayName + '</li>',
                			'</ul>',
                			'<ul>',
            					'<li>Node Index: '+ nodeIndex + '</li>',
            				'</ul>',
                    		'</li>'
		                    ];
		errorList = errorList.concat(errorDescription);
	}
	errorList.push('</ul>');
	errorList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
	return (errorList.join('\n'));
}

function buildCcdaWarningList(data){
		var warningList = ['<a name="ccdaWarnings"/><b>C-CDA Validation Warnings:</b>',
		                   '<ul>'];
		var warnings = data.result.body.ccdaResults.warnings;
		var nWarnings = warnings.length;
		for (var i=0; i < nWarnings; i++){
			var warning = warnings[i];
			var message = warning.message;
			var path = warning.path;
			var lineNum = warning.lineNumber;
			var source = warning.source;
			var warningDescription = ['<li> WARNING '+(i+1).toString()+'',
			                    '<ul>',
			                    	'<li>Message: '+ message + '</li>',
			                    '</ul>',
			                    '<ul>',
		                    		'<li>Path: '+ path + '</li>',
		                    	'</ul>',
		                    	'<ul>',
		                    		'<li>Line Number (approximate): '+ lineNum + '</li>',
		                    	'</ul>',
		                    	'<ul>',
	                    			'<li>Source: (approximate): '+ source + '</li>',
	                    		'</ul>',
	                    		'</li>'
			                    ];
			warningList = warningList.concat(warningDescription);
		}
		warningList.push('</ul>');
		warningList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
		return (warningList.join('\n'));
}

function buildExtendedCcdaWarningList(data){
	var warningList = ['<a name="vocabularyWarnings"/><b>Vocabulary Validation Warnings:</b>',
	                 '<ul>'];
	var warnings = data.result.body.ccdaExtendedResults.warningList;
	var nWarnings = warnings.length;
	for (var i=0; i < nWarnings; i++){
		var warning = warnings[i];
		var message = warning.message;
		var codeSystemName = warning.codeSystemName;
		var xpathExpression = warning.xpathExpression;
		var codeSystem = warning.codeSystem;
		var code = warning.code;
		var displayName = warning.displayName;
		var nodeIndex = warning.nodeIndex;
		var warningDescription = ['<li> WARNING '+(i+1).toString()+'',
		                    '<ul>',
		                    	'<li>Message: '+ message + '</li>',
		                    '</ul>',
		                    '<ul>',
	                    		'<li>Code System Name: '+ codeSystemName + '</li>',
	                    	'</ul>',
	                    	'<ul>',
	                    		'<li>XPath Expression: '+ xpathExpression + '</li>',
	                    	'</ul>',
	                    	'<ul>',
                    			'<li>Code System: '+ codeSystem + '</li>',
                    		'</ul>',
	                    	'<ul>',
                				'<li>Code: '+ code + '</li>',
                			'</ul>',
                			'<ul>',
                				'<li>Display Name: '+ displayName + '</li>',
                			'</ul>',
                			'<ul>',
            					'<li>Node Index: '+ nodeIndex + '</li>',
            				'</ul>',
                    		'</li>'
		                    ];
		warningList = warningList.concat(warningDescription);
	}
	warningList.push('</ul>');
	warningList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
	return (warningList.join('\n'));
}

function buildCcdaInfoList(data){
		var infoList = ['<a name="ccdaInfo"/><b>C-CDA Validation Info:</b>',
		                '<ul>'];
		var infos = data.result.body.ccdaResults.info;
		var nInfos = infos.length;
		for (var i=0; i < nInfos; i++){
			var info = infos[i];
			var message = info.message;
			var path = info.path;
			var lineNum = info.lineNumber;
			var source = info.source;
			var infoDescription = ['<li> INFO '+(i+1).toString()+'',
			                    '<ul>',
			                    	'<li>Message: '+ message + '</li>',
			                    '</ul>',
			                    '<ul>',
		                    		'<li>Path: '+ path + '</li>',
		                    	'</ul>',
		                    	'<ul>',
		                    		'<li>Line Number (approximate): '+ lineNum + '</li>',
		                    	'</ul>',
		                    	'<ul>',
	                    			'<li>Source: (approximate): '+ source + '</li>',
	                    		'</ul>',
	                    		'</li>'
			                    ];
			infoList = infoList.concat(infoDescription);
		}
		infoList.push('</ul>');
		infoList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
		return (infoList.join('\n'));
}

function buildExtendedCcdaInfoList(data){
	var infoList = ['<a name="vocabularyInfo"/><b>Vocabulary Validation Info:</b>',
	                 '<ul>'];
	var infos = data.result.body.ccdaExtendedResults.informationList;
	var nInfos = infos.length;
	for (var i=0; i < nInfos; i++){
		var info = infos[i];
		var message = info.message;
		var codeSystemName = info.codeSystemName;
		var xpathExpression = info.xpathExpression;
		var codeSystem = info.codeSystem;
		var code = info.code;
		var displayName = info.displayName;
		var nodeIndex = info.nodeIndex;
		var infoDescription = ['<li> INFO '+(i+1).toString()+'',
		                    '<ul>',
		                    	'<li>Message: '+ message + '</li>',
		                    '</ul>',
		                    '<ul>',
	                    		'<li>Code System Name: '+ codeSystemName + '</li>',
	                    	'</ul>',
	                    	'<ul>',
	                    		'<li>XPath Expression: '+ xpathExpression + '</li>',
	                    	'</ul>',
	                    	'<ul>',
                    			'<li>Code System: '+ codeSystem + '</li>',
                    		'</ul>',
	                    	'<ul>',
                				'<li>Code: '+ code + '</li>',
                			'</ul>',
                			'<ul>',
                				'<li>Display Name: '+ displayName + '</li>',
                			'</ul>',
                			'<ul>',
            					'<li>Node Index: '+ nodeIndex + '</li>',
            				'</ul>',
                    		'</li>'
		                    ];
		infoList = infoList.concat(infoDescription);
	}
	infoList.push('</ul>');
	infoList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
	return (infoList.join('\n'));
}

function buildCcdaDataQualityConcernsList(data){
	var infoList = ['<a name="dataqualityConcerns"/><b>Data Quality Concerns:</b>',
	                 '<ul>'];
	var infos = data.result.body.ccdaDataQualityResults.dataQualityConcerns;
	var nInfos = infos.length;
	for (var i=0; i < nInfos; i++){
		var info = infos[i];
		var message = info.message;
		//var codeSystemName = info.codeSystemName;
		var xpathExpression = info.xpathExpression;
		var xsiType = info.xsiType;
		//var code = info.code;
		//var displayName = info.displayName;
		var nodeIndex = info.nodeIndex;
		var infoDescription = ['<li> CONCERN '+(i+1).toString()+'',
		                    '<ul>',
		                    	'<li>Message: '+ message + '</li>',
		                    '</ul>',
		                    '<ul>',
	                    		'<li>xsi:type: '+ xsiType + '</li>',
	                    	'</ul>',
	                    	'<ul>',
	                    		'<li>XPath Expression: '+ xpathExpression + '</li>',
	                    	'</ul>',
                			'<ul>',
            					'<li>Node Index: '+ nodeIndex + '</li>',
            				'</ul>',
                    		'</li>'
		                    ];
		infoList = infoList.concat(infoDescription);
	}
	infoList.push('</ul>');
	infoList.push('<hr/><div class="pull-right"><a href="#validationResults">top</a></div>');
	return (infoList.join('\n'));
}

function handleFileUploadError(){
	var iconurl = window.currentContextPath + "/css/icn_alert_error.png" ;
	$('.blockMsg .progressorpanel img').attr('src',iconurl);
	$('.blockMsg .progressorpanel .lbl').text('Error uploading file.');
	if(window.validationpanel){
		window.validationPanelTimeout = setTimeout(function(){
				window.validationpanel.unbind("click");
				window.validationpanel.unblock();
			},10000);
		
		window.validationpanel.bind("click", function() { 
			window.validationpanel.unbind("click");
			clearTimeout(window.validationPanelTimeout);
			window.validationpanel.unblock();
			window.validationpanel.attr('title','Click to hide this message.').click($.unblockUI); 
        });	
	}
}

function buildValidationResultErrorHtml(data){
	var errorHtml = ['<title>Validation Results</title>',
	    '<h1 align="center">Validation Results</h1>',
	    '<font color="red">',
	    'An error occurred during validation with the following details:</br></br>',
	    '<b>' + data.result.body.ccdaResults.error + '</b></br></br>',
	    'If possible, please fix the error and try again. If this error persists, please contact the system administrator',
	    '</font>',
	    '<hr/>',
	    '<hr/>',
	    '<br/>'];
	return errorHtml;
}

function buildValidationResultsHeader(uploadedFileName, docTypeSelected){
	var header =  ['<title>Validation Results</title>',
				    '<a name="validationResults"/>',
				    '<div class="row">',
				    '<b>Upload Results:</b> '+uploadedFileName+' was uploaded successfully.'];
	if(docTypeSelected != ''){
		header.push(['<b>Document Type Selected: </b>' +docTypeSelected]);
	}
	header.push(['</div>']);
	return header;
}

function buildValidationSummary(data){
	var ccdaReport = data.result.body.ccdaResults.report;
	var uploadedFileName = data.result.files[0].name;
	var docTypeSelected = ccdaReport.docTypeSelected;
	ccdaErrorCount = data.result.body.ccdaResults.errors.length;
	ccdaWarningCount = data.result.body.ccdaResults.warnings.length;
	ccdaInfoCount = data.result.body.ccdaResults.info.length;
	
	if(documentTypeIsNonSpecific(docTypeSelected)){
		docTypeSelected = buildValidationHeaderForNonSpecificDocumentType(docTypeSelected);
	}
	
	var tabHtml1 = buildValidationResultsHeader(uploadedFileName, docTypeSelected).join('\n');
	tabHtml1 += ['<br/><div class="row">'];
	tabHtml1 += buildValidationSummaryDetailHtml(ccdaErrorCount, ccdaWarningCount, ccdaInfoCount, 'ccda', 'C-CDA Validation Summary').join('\n');
	if (showVocabularyValidation){
		extendedErrorCount = data.result.body.ccdaExtendedResults.errorList.length;
		extendedWarningCount = data.result.body.ccdaExtendedResults.warningList.length;
		extendedInfoCount = data.result.body.ccdaExtendedResults.informationList.length;
		tabHtml1 += buildValidationSummaryDetailHtml(extendedErrorCount, extendedWarningCount, extendedInfoCount, 'vocabulary', 'C-CDA Vocabulary Summary').join('\n');
	} 
	if (showDataQualityValidation){
		dataQualityConcernCount = data.result.body.ccdaDataQualityResults.dataQualityConcerns.length;
		tabHtml1 += buildValidationSummaryDetailHtml(null, null, dataQualityConcernCount, 'dataqualityConcerns', 'C-CDA Data Quality Summary').join('\n');
	} 
	tabHtml1 += '</div>';
	return tabHtml1;
}

function buildValidationHeaderForNonSpecificDocumentType(docTypeSelected){
	docTypeSelected = docTypeSelected.replace("Non-specific", "");
	if(docTypeSelected.lastIndexOf('R2') === -1){
		docTypeSelected = docTypeSelected.trim();
		docTypeSelected = docTypeSelected.slice(5);
		docTypeSelected = 'CCDA R1.1 ' + docTypeSelected;
	}
	return docTypeSelected;
}

function documentTypeIsNonSpecific(documentType){
	return(documentType.lastIndexOf('Non-specific') !== -1);
}

function buildValidationSummaryDetailHtml(errorCount, warningCount, infoCount, summaryType, summaryHeading){
	var ccdaValidationSummary = ['<div class="panel panel-primary col-md-2 col-lg-2">',
					    '<div class="panel-heading"><h3 class="panel-title">'+summaryHeading+'</h3></div>',
					    '<div>',
					    '<div class="list-group">'];
						if(errorCount != null)
							ccdaValidationSummary.push(['<div class="list-group-item"><span class="badge btn-danger">'+errorCount+'</span><a href="#'+summaryType+'Errors"> errors</a></div>']);
						if(warningCount != null)
							ccdaValidationSummary.push(['<div class="list-group-item"><span class="badge btn-warning">'+warningCount+'</span><a href="#'+summaryType+'Warnings"> warnings</a></div>']);
					    if(infoCount != null)
					    	ccdaValidationSummary.push(['<div class="list-group-item"><span class="badge btn-info">'+infoCount+'</span><a href="#'+summaryType+'Info"> info messages</a></div>']);
					    ccdaValidationSummary.push(['</div></div></div>']);
	return ccdaValidationSummary;
}

function buildValidationResultDetailsHtml(data){
	var validationResultDetails = buildCcdaValidationErrorsListHtml(data);
	validationResultDetails += buildCcdaValidationWarningsListHtml(data);
	validationResultDetails += buildCcdaValidationInfoListHtml(data);
	return validationResultDetails;
}

function buildCcdaValidationErrorsListHtml(data){
	var ccdaErrors = '<font color="red">';
	if (ccdaErrorCount > 0) {
		ccdaErrors += buildCcdaErrorList(data);
	}				
	if (showVocabularyValidation){
		if (extendedErrorCount > 0){
			ccdaErrors += buildExtendedCcdaErrorList(data);
		}
	}
	ccdaErrors += '</font>';
	return ccdaErrors;
}

function buildCcdaValidationWarningsListHtml(data){
	var ccdaWarnings = '<font color="orange">';
	if (ccdaWarningCount > 0){
		ccdaWarnings += buildCcdaWarningList(data);
	}
	if (showVocabularyValidation){
		if (extendedWarningCount > 0){
			ccdaWarnings += buildExtendedCcdaWarningList(data);
		}		
	}
	ccdaWarnings += '</font>';
	return ccdaWarnings;
}

function buildCcdaValidationInfoListHtml(data){
	var ccdaInfos = '<font color="#5bc0de">';
	if (ccdaInfoCount > 0){
		ccdaInfos += buildCcdaInfoList(data);
	}
	if (showVocabularyValidation){
		if (extendedInfoCount > 0){
			ccdaInfos += buildExtendedCcdaInfoList(data);
		}
	}
	if(showDataQualityValidation){
		if (dataQualityConcernCount > 0) {
			ccdaInfos += buildCcdaDataQualityConcernsList(data);
		}
	}	
	ccdaInfos += '</font>';
	return ccdaInfos;
}

function updateStatisticCount(){
	Liferay.Portlet.refresh("#p_p_id_Statistics_WAR_siteportalstatisticsportlet_"); 
}

function cleanUpCcdaFilesInResult(data, fileHolder){
	$.each(data.result.files, function(index, file) {
		$('#' + fileHolder).empty();
		$('#' + fileHolder).text(file.name);
	});
}

function showResults(resultsHtml){
	$("#ValidationResult .tab-content #tabs-1").html(resultsHtml);
	$("#resultModal").modal("show");
	$("#resultModalTabs a[href='#tabs-1']").tab("show");
    $("#resultModalTabs a[href='#tabs-2']").hide();
    $("#resultModalTabs a[href='#tabs-3']").hide();
    if(Boolean(validationError)){
    	$("#smartCCDAValidationBtn").hide();
        $("#saveResultsBtn").hide();
    }
}

function showResultsTable(){
	$("#resultTableModal").modal("show");
	$("#resultsModalTabs a[href='#resultsTab1']").tab("show");
    $("#resultsModalTabs a[href='#resultsTab2']").hide();
    $("#resultsModalTabs a[href='#resultsTab3']").hide();
    if(Boolean(validationError)){
    	$("#smartCCDAValidationBtn").hide();
        $("#saveResultsBtn").hide();
    }
}

function buildResultsHtml(data){
	var tabHtml1 = "";
	if (("error" in data.result.body.ccdaResults) || ("error" in data.result.body.ccdaExtendedResults)){
		validationError = true;
		tabHtml1 = buildValidationResultErrorHtml(data).join('\n');
	} else {
		var tabHtml1 = buildValidationSummary(data);
		tabHtml1 += buildValidationResultDetailsHtml(data);
	}
	return tabHtml1;
}

function showFileValidationProgress(data){
	var progressval = parseInt(data.loaded / data.total * 100, 10);
	if(progressval < 99){
    	$('.blockMsg .progressorpanel .lbl').text('Uploading...');
   		$('.blockMsg .progressorpanel .progressor').text( floorFigure(data.loaded/data.total*100,0).toString()+"%" );
    }else{
    	$('.blockMsg .progressorpanel .lbl').text('Validating...');
    	$('.blockMsg .progressorpanel .progressor').text('');
    }
}

function removeProgressModal(){
	if(typeof window.validationpanel != 'undefined')
		window.validationpanel.unblock();

	window.setTimeout(function() {
		$('#progress').fadeOut(400, function() {
			$('#progress .progress-bar').css('width', '0%');
			
		});
	}, 1000);
}

function doCcdaValidation(data){
	var tabHtml1 = buildResultsHtml(data);
	showResults(tabHtml1);
    updateStatisticCount();
    removeProgressModal();
}

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

function errorHandler (request, status, error) {
    alert("error:"+ error);
    if(window.validationpanel)
    	window.validationpanel.unblock();
    $.unblockUI();
}

function getDoc(frame) {
    var doc = null;

    // IE8 cascading access check
    try {
        if (frame.contentWindow) {
            doc = frame.contentWindow.document;
        }
    } catch(err) {
    }

    if (doc) { // successful getting content
        return doc;
    }

    try { // simply checking may throw in ie8 under ssl or mismatched protocol
        doc = frame.contentDocument ? frame.contentDocument : frame.document;
    } catch(err) {
        // last attempt
        doc = frame.document;
    }
    return doc;
}