var ccdaErrorCount;
var ccdaWarningCount;
var ccdaInfoCount;
var validationError;


//R1
function doCcdaValidation(data){
	showValidationResultsModalButtons();
	var tabHtml1 = '';
	if(data.result.body.ccdaResults.error != null){
		tabHtml1 = buildValidationResultErrorHtml(data.result.body.ccdaResults.error);
		showResults(tabHtml1);
	}else{
		var resultMap = buildCcdaErrorsMap(data);
		var warningresultMap = buildCcdaWarningsMap(data);
		var inforesultMap = buildCcdaInfoMap(data);
		tabHtml1 = buildResultsHtml(data);
		buildCCDAXMLResultsTab(data);
		showResults(tabHtml1);
		highlightXMLResults(resultMap, 'error');
		highlightXMLResults(warningresultMap, 'warning');
		highlightXMLResults(inforesultMap, 'info');
	}
	updateStatisticCount();
	removeProgressModal();
}


//R2
function showValidationResults(data){
	showValidationResultsModalButtons();
	var tabHtml1 = '';
	if(data.result.body.resultsMetaData.serviceError){
		tabHtml1 = buildValidationResultErrorHtml(data.result.body.resultsMetaData.serviceErrorMessage);
	}else{
		var resultsMap = buildCcdaResultMap(data);
		tabHtml1 = buildCcdaValidationResultsHtml(data);
		buildCCDAXMLResultsTab(data);
		highlightCcdaXMLResults(resultsMap);
	}
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

function buildCCDAXMLResultsTab(data){
	$("#ccdaXML").remove();
	$("#tabs-2").empty();
	var uploadedFileName = data.result.files[0].name;
	var docTypeSelected = getSelectedDocumentType(data);
	var resultsHeader = buildValidationResultsHeader(uploadedFileName, docTypeSelected);
	if(data.result.files[0].content.match(/\n/gm) == null || data.result.files[0].content.match(/\n/gm).length < 10){
		$('#tabs-2').html(resultsHeader.join(" ") + "<div class='row alert alert-warning'><b>WARNING!</b> Detected an XML document that may not be formatted for this validation display. For example, the XML may be on a single line.</div>");
	}else{
		//$('#tabs-2').html(resultsHeader.join(" "));
		$('<pre/>',{
			id:'ccdaXML',
			class:'brush: xml; toolbar: false',
			text:data.result.files[0].content
		}).appendTo('#tabs-2');
		SyntaxHighlighter.defaults['auto-links'] = false;
		SyntaxHighlighter.highlight();
	}
}

function getSelectedDocumentType(data){
	var docTypeSelected = '';
	if(data.result.body.ccdaResults != undefined){
		docTypeSelected =  data.result.body.ccdaResults.report.docTypeSelected;
	}else{
		docTypeSelected =  data.result.body.resultsMetaData.ccdaDocumentType
	}
	return docTypeSelected;
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
			tabHtml1 += '<div id="'+metaData.type.split(' ').join('_') +'_SUMMARY">' + resultGroupHTMLHeader + resultGroup + resultGroupHTMLEnd + '</div>';
			resultGroup = "";
		}
	});
	tabHtml1 += '</div>';
	return tabHtml1;
}

function buildCcdaValidationResults(data){
	var resultList = [];
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
			'<li class="">Document Line Number (approximate): '+ result.documentLineNumber + '</li>',
			'</ul></li>'];
		resultList = resultList.concat(errorDescription);
		if(result.expectedValueSet != null){
			var expectedValueSets = ['<a href=">' + result.expectedValueSet + '</a>'];
			resultList = resultList.concat(expectedValueSets);
		}
		resultList.push('</font>');
		resultList.push('<hr/><div class="pull-right"><a href="#validationResults" title="top">^</a></div>');
		currentResultType = result.type.toLowerCase();
	});
	return (resultList.join('\n'));
}

function buildCcdaResultMap(data){
	var ccdaValidationResultsMap = {};
	var resultTypeMapValue = '';
	$.each(data.result.body.ccdaValidationResults, function(ccdaValidationResults,result){
		if(result.expectedValueSet != null){
			resultTypeMapValue = result.description + '<br/>Expected Valueset(s): ' + result.expectedValueSet.replace(/,/g , " or ");
		}else{
			resultTypeMapValue = result.description;
		}
		if(ccdaValidationResultsMap[result.documentLineNumber] != undefined){
			var resultTypeMap = ccdaValidationResultsMap[result.documentLineNumber];
			if(resultTypeMap[result.type] != undefined){
				resultTypeMap[result.type].push(resultTypeMapValue);
				ccdaValidationResultsMap[result.documentLineNumber] = resultTypeMap;
			}else{
				resultTypeMap[result.type] = [resultTypeMapValue];
				ccdaValidationResultsMap[result.documentLineNumber] = resultTypeMap;
			}
		}else{
			var ccdaTypeMap = {};
			ccdaTypeMap[result.type] = [resultTypeMapValue];
			ccdaValidationResultsMap[result.documentLineNumber] = ccdaTypeMap;
		}
	});
	return ccdaValidationResultsMap;
}

function highlightCcdaXMLResults(resultsMap){
	if($.map(resultsMap, function(n, i) { return i; }).length > 0){
		for (var resultLineNumber in resultsMap){
			var lineNum = resultLineNumber;
			var resultTypesMap = resultsMap[resultLineNumber];
			for (var resultType in resultTypesMap){
				var type = resultType;
				var descriptions = resultTypesMap[resultType];
				var descriptionsLength = descriptions.length;
				var popoverTemplate = '<span class="popover resultpopover"><div class="clearfix"><span>Line Number: '+lineNum+'</span><span aria-hidden="true" class="glyphicon glyphicon-arrow-up" style="float:right !important; cursor:pointer" title="go to previous result"></span></div><span class="arrow"></span><h3 class="popover-title result-title"></h3><div class="popover-content"></div><div class="clearfix"><span aria-hidden="true" class="glyphicon glyphicon-arrow-down" style="float:right !important; cursor:pointer" title="go to next result"></span></div></span>';
				var popOverContent = createResultListPopoverHtml(descriptions);
				if (typeof $(".code .container .line.number" + lineNum).data('bs.popover') !== "undefined") {
					var title;
					if(type.toLowerCase().indexOf("error") >= 0){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-exclamation-sign alert-danger' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)";
					}else if(type.toLowerCase().indexOf("warn") >= 0){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-warning-sign alert-warning' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)";
					}else{
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-info-sign alert-info' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)";
					}
					$(".code .container .line.number" + lineNum).data('bs.popover').options.content += "<h3 class='popover-title result-title'>" + title + "</h3>" + popOverContent;
				}else{
					if(type.toLowerCase().indexOf("error") >= 0){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-exclamation-sign alert-danger' aria-hidden='true' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaErrorHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)",
								html: true,
								content: popOverContent,
								trigger: "focus",
								placement: "auto",
								template:popoverTemplate
							});
					}else if(type.toLowerCase().indexOf("warn") >= 0){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-warning-sign alert-warning' aria-hidden='true' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaWarningHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)",
								html: true,
								content: popOverContent,
								trigger: "focus",
								placement: "auto",
								template: popoverTemplate
							});
					}else{
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-info-sign alert-info' aria-hidden='true' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaInfoHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + descriptionsLength + " " + type + "(s)",
								html: true,
								content:  popOverContent,
								trigger: "focus",
								placement: "auto",
								template: popoverTemplate
							});
					}

				}
			}

		}
	}

	addTitleAttributeToHighlightedDivs();
}

function addTitleAttributeToHighlightedDivs(){
	$("div[class$='Highlight']").attr('title', 'Show validation result details for this line.');
	$("div[class$='Highlight']").attr('tabindex', '0');
}

function hideSummaryHeadersOfNotYetImplementedValidators(){
	$("#ONC_2015_S\\&CC_Reference_C-CDA_Validation_Info_SUMMARY").hide();
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

function buildCcdaErrorsMap(data){
	var ccdaValidationErrorsMap = {};
	var errors = data.result.body.ccdaResults.errors;
	var nErrors = errors.length;
	for (var i=0; i < nErrors; i++){
		var error = errors[i];
		if(ccdaValidationErrorsMap[error.lineNumber] != undefined){
			ccdaValidationErrorsMap[error.lineNumber].push(error.message);
		}else{
			ccdaValidationErrorsMap[error.lineNumber] = [error.message];
		}
	}
	return ccdaValidationErrorsMap;
}

function buildCcdaWarningsMap(data){
	var ccdaValidationWarningsMap = {};
	var warnings = data.result.body.ccdaResults.warnings;
	var nWarnings = warnings.length;
	for (var i=0; i < nWarnings; i++){
		var warning = warnings[i];
		if(ccdaValidationWarningsMap[warning.lineNumber] != undefined){
			ccdaValidationWarningsMap[warning.lineNumber].push(warning.message);
		}else{
			ccdaValidationWarningsMap[warning.lineNumber] = [warning.message];
		}
	}
	return ccdaValidationWarningsMap;
}

function buildCcdaInfoMap(data){
	var ccdaValidationInfoMap = {};
	var infos = data.result.body.ccdaResults.info;
	var nInfos = infos.length;
	for (var i=0; i < nInfos; i++){
		var info = infos[i];
		if(ccdaValidationInfoMap[info.lineNumber] != undefined){
			ccdaValidationInfoMap[info.lineNumber].push(info.message);
		}else{
			ccdaValidationInfoMap[info.lineNumber] = [info.message];
		}
	}
	return ccdaValidationInfoMap;
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

function hideValidationResultsModalButtons() {
	$("#resultModalTabs a[href='#tabs-1']").hide();
	$("#resultModalTabs a[href='#tabs-2']").hide();
	$('.saveResultsBtn').hide();
	$('.smartCCDAValidationBtn').hide();
}

function showValidationResultsModalButtons() {
	$("#resultModalTabs a[href='#tabs-1']").show();
	$("#resultModalTabs a[href='#tabs-2']").show();
	$('.saveResultsBtn').show();
	$('.smartCCDAValidationBtn').show();
}

function buildValidationResultErrorHtml(errorMessage){
	var errorHtml = ['<title>Validation Results</title>',
		'<h1 align="center">Validation Results</h1>',
		'<p>An error occurred during validation with the following details:</br>',
		'<b>' + errorMessage + '</b></br>',
		'If possible, please fix the error and try again. If this error persists, please contact the system administrator',
		'</p>'];
	hideValidationResultsModalButtons();
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
	ccdaErrors += '</font>';
	return ccdaErrors;
}

function buildCcdaValidationWarningsListHtml(data){
	var ccdaWarnings = '<font color="orange">';
	if (ccdaWarningCount > 0){
		ccdaWarnings += buildCcdaWarningList(data);
	}
	ccdaWarnings += '</font>';
	return ccdaWarnings;
}

function buildCcdaValidationInfoListHtml(data){
	var ccdaInfos = '<font color="#5bc0de">';
	if (ccdaInfoCount > 0){
		ccdaInfos += buildCcdaInfoList(data);
	}
	ccdaInfos += '</font>';
	return ccdaInfos;
}

function updateStatisticCount(){
	Liferay.Portlet.refresh("#p_p_id_Statistics_WAR_siteportalstatisticsportlet_");
}

function showResults(resultsHtml){
	$("#ValidationResult .tab-content #tabs-1").html(resultsHtml);
	$("#resultModal").modal("show");
	$("#resultModalTabs a[href='#tabs-1']").tab("show");
	//$("#resultModalTabs a[href='#tabs-2']").tab("show");
	$("#resultModalTabs a[href='#tabs-3']").hide();
	if(Boolean(validationError)){
		$(".smartCCDAValidationBtn").hide();
		$(".saveResultsBtn").hide();
	}
}

function buildResultsHtml(data){
	var tabHtml1 = "";
	if (("error" in data.result.body.ccdaResults)){
		validationError = true;
		tabHtml1 = buildValidationResultErrorHtml(data.result.body.ccdaResults.error).join('\n');
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

function highlightXMLResults(resultsToHighlight, validationLevel){
	if($.map(resultsToHighlight, function(n, i) { return i; }).length > 0){
		for (var key in resultsToHighlight){
			if(key.hasOwnProperty){
				var popoverTemplate = '<span class="popover resultpopover"><div class="clearfix"><span aria-hidden="false" class="glyphicon glyphicon-arrow-up" style="float:right !important" title="go to previous result"></span></div><span class="arrow"></span><h3 class="popover-title result-title"></h3><div class="popover-content"></div><div class="clearfix"><span aria-hidden="false" class="glyphicon glyphicon-arrow-down" style="float:right !important" title="go to next result"></span></div></span>';
				var result = resultsToHighlight[key];
				var lineNum = key;
				var popOverContent = createResultListPopoverHtml(result);
				if (typeof $(".code .container .line.number" + lineNum).data('bs.popover') !== "undefined") {
					var title;
					if(validationLevel == 'error'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-exclamation-sign alert-danger' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + result.length + " Error(s)";
					}else if(validationLevel == 'warning'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-warning-sign alert-warning' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> " + result.length + " Warning(s)";
					}else if(validationLevel == 'info'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-info-sign alert-info' aria-hidden='true' style='font-size: .8em;'></span>" );
						title = "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + result.length + " Info";
					}
					$(".code .container .line.number" + lineNum).data('bs.popover').options.content += "<h3 class='popover-title result-title'>" + title + "</h3>" + popOverContent;
				}else{
					if(validationLevel == 'error'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-exclamation-sign alert-danger' aria-hidden='false' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaErrorHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='false'></span> " + result.length + " Error(s)",
								html: true,
								content: popOverContent,
								trigger: "click",
								placement: "auto",
								template:popoverTemplate
							});
					}else if(validationLevel == 'warning'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-warning-sign alert-warning' aria-hidden='false' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaWarningHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-warning-sign' aria-hidden='false'></span> " + result.length + " Warning(s)",
								html: true,
								content: popOverContent,
								trigger: "click",
								placement: "auto",
								template: popoverTemplate
							});
					}else if(validationLevel == 'info'){
						$(".code .container .line.number" + lineNum).prepend( "<span class='glyphicon glyphicon-info-sign alert-info' aria-hidden='false' style='font-size: .8em;'></span>" );
						$(".code .container .line.number" + lineNum).addClass("ccdaInfoHighlight").popover(
							{
								title: "<span class='glyphicon glyphicon-info-sign' aria-hidden='false'></span> " + result.length + " Info",
								html: true,
								content:  popOverContent,
								trigger: "click",
								placement: "auto",
								template: popoverTemplate
							});
					}

				}
			}
		}
		addTitleAttributeToHighlightedDivs();
	}
}

function createResultListPopoverHtml(results){
	var htmlList = '<ul>';
	for(var i = 0; i < results.length; i++){
		htmlList += '<li>' + results[i] + '</li>'
	}
	htmlList += '</ul>';
	return htmlList;
}

$('#resultModal').on('click', '.glyphicon-arrow-down', function(){
	var $elem = $(this).parent().parent().nextAll('.ccdaErrorHighlight, .ccdaWarningHighlight, .ccdaInfoHighlight').first();
	$('#resultModal').animate({
		scrollTop: $elem.position().top
	}, 2000, function(){
		$elem.focus();
	});
});

$('#resultModal').on('click', '.glyphicon-arrow-up', function(){
	var $elem = $(this).parent().parent().prevAll('.ccdaErrorHighlight, .ccdaWarningHighlight, .ccdaInfoHighlight')[1];
	$('#resultModal').animate({
		scrollTop: $($elem).position().top
	}, 2000, function(){
		$elem.focus();
	});
});

$('#resultModalTabs a').on('click', function(){
	var href = $(this).attr('href');
	if(href == '#tabs-2'){
		$('.saveResultsBtn').hide();
	}else{
		$('.saveResultsBtn').show();
	}
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
