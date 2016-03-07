var documentLocationMap;
var senderGitHubUrl = 'https://api.github.com/repos/siteadmin/2015-Certification-C-CDA-Test-Data/contents/Sender SUT Test Data?callback=?';
var receiverGitHubUrl = 'https://api.github.com/repos/siteadmin/2015-Certification-C-CDA-Test-Data/contents/Receiver SUT Test Data?callback=?';

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

function fileSelected()
{
	$(".fakefile input").val($('#ccdafileChooser').val());
}

function BlockPortletUI()
{
	window.validationpanel = $('#CCDAvalidator .well');
	
	var ajaximgpath = window.currentContextPath + "/css/ajax-loader.gif";
	
	window.validationpanel.block({ 
		css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff',
	            width: '90%' 
		},
		message: '<div class="progressorpanel"><img src="'+ ajaximgpath + '" alt="loading">'+
				 '<div class="lbl">Uploading...</div>' +
				 '<div class="progressor">0%</div></div>',
	});
}

function BlockResultUI()
{
	window.resultPanel = $('#ValidationResult').closest('div[class="ui-dialog"]');
	
	var ajaximgpath = window.currentContextPath + "/css/ajax-loader.gif";
	
	window.resultPanel.block({ 
		css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff',
	            width: '90%'
		},
		message: '<div class="progressorpanel"><img src="'+ ajaximgpath + '" alt="loading">'+
				 '<div class="lbl">Uploading...</div>' +
				 '<div class="progressor">0%</div></div>',
	});
}



function errorHandler (request, status, error) {
    alert("error:"+ error);
    if(window.validationpanel)
    	window.validationpanel.unblock();
    $.unblockUI();
}

function progressHandlingFunction(e){
    if(e.lengthComputable){
    	var progressval = floorFigure(e.loaded/e.total*100,0);
    	if(progressval < 99)
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Uploading...');
    		$('.blockMsg .progressorpanel .progressor').text( floorFigure(e.loaded/e.total*100,0).toString()+"%" );
    	}
    	else
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Validating...');
    		$('.blockMsg .progressorpanel .progressor').text('');
    	}
    }
}

function floorFigure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};

function writeSmartCCDAResultHTML(data){
	var results = JSON.parse(data);
	
	if(results.IsSuccess)
	{
		try{
			
			
    		var rubricLookup = results.RubricLookup;
    		var rowtmp = '<tr><td>{label}</td><td>{score}</td><td>{scoreexplain}</td><td>{detail}</td></tr>';
			resultsByCategory = {};

			
    		$.each(results.Results, function(i, result) {
    			//look up the label
    			var rowcache = rowtmp;
    			var label = rubricLookup[result.rubric].description;
    			var category = rubricLookup[result.rubric].category[0];
    			
    			var score = 'N/A'
    			if ("score" in result){
    				score = result.score;
    			}
    			
    			
    			var scoreInt = null;
    			var maxPts = null;	
    			
    			if (score !== 'N/A'){
        			scoreInt = parseInt(score, 10);
        			maxPts = parseInt(rubricLookup[result.rubric].maxPoints, 10);
        			score = scoreInt.toString() + '/' + maxPts.toString();	
    			}
    			
    			
    			rowcache = rowcache.replace(/{label}/g, label?label:'N/A');
    			rowcache = rowcache.replace(/{score}/g, score);
    			var scoreexplanation = (rubricLookup[result.rubric])?(rubricLookup[result.rubric].points)?rubricLookup[result.rubric].points[result.score]:'N/A':'N/A';
    			rowcache = rowcache.replace(/{scoreexplain}/g, scoreexplanation?scoreexplanation:'N/A');
    			rowcache = rowcache.replace(/{detail}/g, result.detail?result.detail:'');
    			
    			var rowResult = {
    					row : rowcache,
    					points : scoreInt,
    					maxPoints : maxPts
    			};
    			
    			
    			if (category in resultsByCategory){
    				resultsByCategory[category].push(rowResult);
    			} else {
    				resultsByCategory[category] = [];
    				resultsByCategory[category].push(rowResult);
    			}
    			
            });
    		
    		var tablehtml = [];
    		var totalPoints = 0;
    		var totalPossiblePoints = 0;
    			
    		for (var category in resultsByCategory) {
    		    if (resultsByCategory.hasOwnProperty(category)) {
    		        
    		    	var totalPointsForCategory = 0;
    		    	var possiblePointsForCategory = 0;
    		    	
    		    	var results = resultsByCategory[category];
    		    	var resultRows = [];
    		    	
    		    	$.each(results, function(i, result) {
    		    	
    		    		var row = result.row;
    		    		var points = result.points;
    		    		var possiblePoints = result.maxPoints;
    		    		
    		    		if (points !== null) {
    		    			
    		    			totalPointsForCategory += points;
    		    			possiblePointsForCategory += possiblePoints;
    		    			
    		    		}
    		    		
    		    		resultRows.push(row);
    		    	});
    		    	
    		    	totalPoints += totalPointsForCategory;
    		    	totalPossiblePoints += possiblePointsForCategory;
    		    	var scoreForCategory = totalPointsForCategory / possiblePointsForCategory;
    		    	
    		    	tablehtml.push('<h2>');
    		    	tablehtml.push('<span style="float: left;" >'+ category +'</span>');
    		    	
    		    	if (isNaN(scoreForCategory)){
    		    		tablehtml.push('<span style="float: right;"> N/A </span></h2>');
    		    	} else {
    		    		tablehtml.push('<span style="float: right;">'+ Number((scoreForCategory * 100).toFixed(1)) +'% </span></h2>');
    		    	}
    		    	
    		    	tablehtml.push('</h2>');
    		    	
            		tablehtml.push('<table class="bordered">');
            		tablehtml.push('<colgroup>');
            		tablehtml.push('<col span="1" style="width: 15%;">');
            		tablehtml.push('<col span="1" style="width: 50px;">');
            		tablehtml.push('<col span="1" style="width: 15%;">');
            		tablehtml.push('<col span="1" style="width: 67%;">');
            		tablehtml.push('</colgroup>');
            		
            		tablehtml.push('<thead><tr>');
            		tablehtml.push('<th>Rubric</th>');
            		tablehtml.push('<th>Score</th>');
            		tablehtml.push('<th>Comment</th>');
            		tablehtml.push('<th>Details</th>');
            		tablehtml.push('</tr></thead>');
            		
            		tablehtml.push('<tbody>');
            		
            		for (row in resultRows){
            			tablehtml.push(resultRows[row]);
            		}
            		
            		tablehtml.push('</tbody></table>');
            		
    		    }
    		}
    		
    		
    		var totalScore = totalPoints / totalPossiblePoints;
    		var heading = '<h1>Your C-CDA\'s overall score: ' + Number((totalScore * 100).toFixed(1)) + '% </h1>';
    		tablehtml.unshift(heading);
    		
    		
    		$("#resultModalTabs a[href='#tabs-3']").show();
			$('.saveResultsBtn').show();
    		$(".modal-body").scrollTop(0);
    		
    		$("#resultModalTabs a[href='#tabs-3']").tab("show");
    		
    		$("#ValidationResult .tab-content #tabs-3" ).html(tablehtml.join(""));
		
		}
		catch(exp)
		{
			alert('javascript crashed, please report this issue:'+ err.message);
		}
		$.unblockUI();
	}
	else
	{
		alert(results.Message);
		$.unblockUI();
	}
}

function smartCCDAValidation()
{
	var ajaximgpath = window.currentContextPath + "/css/ajax-loader.gif";
	
	var selector = null;
	
	//TODO: Make one of these for each C-CDA Validator 
	if ($('#collapseCCDA1_1').hasClass('in')){
		selector = '#CCDA1ValidationForm';
	} else if ($('#collapseCCDA2_0Validator').hasClass('in')){
		selector = '#CCDAR2_0ValidationForm';
	} else {
		
	}
	
	
	$.blockUI({
		css: { 
	        border: 'none', 
	        padding: '15px', 
	        backgroundColor: '#000', 
	        '-webkit-border-radius': '10px', 
	        '-moz-border-radius': '10px', 
	        opacity: .5, 
	        color: '#fff' 
    	},
    	message: '<div class="progressorpanel"><img src="'+ ajaximgpath + '" alt="loading">'+
		          '<div class="lbl">Validating...</div></div>'
		
	});
	
	
	
	if (bowser.msie && bowser.version <= 9) {
		
		var jform = $(selector);
		
	    var  iframeId = 'unique' + (new Date().getTime());
	    var action = jform.attr("action");
	    var relay = jform.attr("relay");
	    // Set the action on the form to the value of the relay
	    jform.attr("action", relay);
	    
	    var iframe = $('<iframe src="javascript:false;" name="'+iframeId+'" id="'+iframeId+'" />');
	    
	    iframe.hide();
	    jform.attr('target',iframeId);
	    iframe.appendTo('body');
	    
	    iframe.load(function(e)
	    {
	        var doc = getDoc(iframe[0]); //get iframe Document
	        var node = doc.body ? doc.body : doc.documentElement;
	        var data = (node.innerText || node.textContent);
	        writeSmartCCDAResultHTML(data);
	        
	    });
		
	    jform.submit();
	    // Set the action on the form from the relay 
	    // back to the original action
	    jform.attr("action", action);
	
	} else {
		
		var formData = $(selector).serializefiles();
		var serviceUrl = $(selector).attr("relay");
		$.ajax({
	        url: serviceUrl,
	        type: 'POST',
	        
	        success: function(data){
	        	writeSmartCCDAResultHTML(data);
	        },
	        error: errorHandler,
	        // Form data
	        data: formData,
	        //Options to tell JQuery not to process data or worry about content-type
	        cache: false,
	        contentType: false,
	        processData: false
	    });
	}
}

$(function(){
	$('.smartCCDAValidationBtn').bind('click', function(e, data) {
		smartCCDAValidation();
	});
	
	$('#reportSaveAsQuestion button').button();
	
	
	
	$('.saveResultsBtn').on('click', function(e){
		e.preventDefault();
		
		var ajaximgpath = window.currentContextPath + "/css/ajax-loader.gif";
		
		$.blockUI({ css: { 
	        border: 'none', 
	        padding: '15px', 
	        backgroundColor: '#000', 
	        '-webkit-border-radius': '10px', 
	        '-moz-border-radius': '10px', 
	        opacity: .5, 
	        color: '#fff' 
    	},
    	message: '<div class="progressorpanel"><img src="'+ ajaximgpath + '" alt="loading">'+
		          '<div class="lbl">Preparing your report...</div></div>' });
		
		
		//set the value of the result and post back to server.
		
		var $tab = $('#resultTabContent'), $active = $tab.find('.tab-pane.active');
		
		$('#downloadtest textarea').val($active.html());
		//submit the form.
		
		$.fileDownload($('#downloadtest').attr('action'), {
			
			successCallback: function (url) {
				$.unblockUI(); 
            },
            failCallback: function (responseHtml, url) {
            	alert("Server error:" + responseHtml);
            	$.unblockUI(); 
            },
	        httpMethod: "POST",
	        data: $('#downloadtest').serialize()
	    });
		
	});
});

function getTestDocuments(endpointToDocuments){
    $.getJSON(endpointToDocuments, function(data){
        $("#scenariofiledownload").hide();
        $("#CCDAR2_0_type_val option").remove();
        $("#CCDAR2_refdocsfordocumenttype option").remove();
        $("#CCDAR2_0_type_val").append(
            $("<option></option>")
                .text('-- select one ---')
                .val(''));
        $.each(data.data, function(index, item){
            var optionText = item.name;
            var optionValue = item.url;
            $("#CCDAR2_0_type_val").append(
                $("<option></option>")
                    .text(optionText)
                    .val(optionValue));
        })
    });
};

$('#CCDAR2_0_type_val').change(function(){
    documentLocationMap = new Object();
    $("#scenariofiledownload").hide();
    if($( this ).val() != ''){
        $.getJSON($( this ).val()+ '&callback=?', function(data){
            $("#CCDAR2_refdocsfordocumenttype option").remove();
            $("#CCDAR2_refdocsfordocumenttype").append(
                $("<option></option>")
                    .text('-- select one ---')
                    .val(''));
            $.each(data.data, function(index, item){
                var optionText = item.name;
                var documentDownloadUrl = item.html_url;
                documentLocationMap[optionText] = documentDownloadUrl;
                $("#CCDAR2_refdocsfordocumenttype").append(
                    $("<option></option>")
                        .text(optionText)
                        .val(optionText));
            });
			$("#CCDAR2_refdocsfordocumenttype").append(
				$("<option></option>")
					.text('No Scenario File')
					.val('noscenariofile'));
        });
    }else{
        $("#CCDAR2_refdocsfordocumenttype option").remove();
    }

});

$('#CCDAR2_refdocsfordocumenttype').change(function(){
    if($( this ).val() != '' && $( this ).val() !== 'noscenariofile'){
        $("#scenariofiledownload").attr({'href' : documentLocationMap[$( this ).val()], target : '_blank'});
        $("#scenariofiledownload").show();
    }else{
        $("#scenariofiledownload").hide();
    }

});

$( "#messagetype").click(function(){
    $(this).find('.btn').toggleClass('active');
    if($(this).find('.active').val() == 'sender'){
        getTestDocuments(senderGitHubUrl);
    }else{
        getTestDocuments(receiverGitHubUrl);
    }
});

getTestDocuments(senderGitHubUrl);