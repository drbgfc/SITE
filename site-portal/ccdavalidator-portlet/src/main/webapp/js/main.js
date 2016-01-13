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
			$('#saveResultsBtn').show();
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


function incorpRequired(field, rules, i, options){
	if($('#incorpfilepath').val()== '')
	{
		return "Please select a C-CDA sample";
	}
}




function loadSampleTrees(){
	//loadReferenceCCDAIncorpTree();
	loadNegativeTestCCDATree();
	loadReferenceCCDAIncorpTree();
	loadCCDASamplesFromVendorsTree();
	loadCCDAReferenceTree();
	loadCCDAReferenceFileUsedTree();
}

function loadNegativeTestCCDATree(){
	
	$("#negTestccdafiletreepanel").jstree({
		"json_data" : {
			"ajax" : {
				"url" : negativeTestCCDATreeURL,
				"type" : "post",
			}
		},
		
		"types" : {
			
			"valid_children" : ["all"],
			"type_attr" : "ref",
			"types" : {
				"root" : {
					"icon" : {
						"image" : window.currentContextPath + "/images/root.png"
					},
					"valid_children" : [ "file","folder" ],
					"max_depth" : 2,
					"hover_node" : false,
					"select_node" : function(e) {
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
		    			  
		    			 $('#negTestForm .formError').hide(0);
		    			 
		    			// var textValue = $('#incorpemail').val();
			  				$('#negTestForm').trigger('reset');
			  				$('#negTestCCDAsubmit').unbind("click");
			  				
			  				$('#negTestfilePathOutput').empty();
			  				$('#negTestfilepath').val('');
			  				
			  				//$('#incorpemail').val(textValue);
			  				
		    		  },
		    		  
		    		  "select_node" : function (node,e) {
		    			  
		    			  $('#negTestForm .formError').hide(0);
		    			  //populate the textbox
		    			  $("#negTestfilepath").val(node.data("serverpath"));
		    			  
		    			  $("#negTestfilePathOutput").text($("#negTestfilepath").val());
		    			 
		    			  
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  
		    			  
		    			  $('#dLabel2').focus();
		    			  $('#dLabel2').dropdown("toggle");
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
				
				
				
				$('#negTestccdafiletreepanel').find('a').each(function() {
				    $(this).attr('tabindex', '1');
				});
			});
	
}

$("#negTestCCDAsubmit").click(function(e) {
	  
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
		          '<div class="lbl">Preparing your download...</div></div>' });
	  	
			$('#negTestForm .formError').hide(0);
			
			$.fileDownload($('#negTestForm').attr('action'), {
				
				successCallback: function (url) {
					$.unblockUI(); 
	            },
	            failCallback: function (responseHtml, url) {
	            	alert("Server error:" + responseHtml);
	            	alert(url);
	            	$.unblockUI(); 
	            },
		        httpMethod: "POST",
		        data: $('#negTestForm').serialize()
		    });
		return false;
});

function loadReferenceCCDAIncorpTree(){
	
	$("#refccdafiletreepanel").jstree({
		"json_data" : {
			"ajax" : {
				"url" : referenceCCDAIncorpTreeURL,
				"type" : "post",
			}
		},
		
		"types" : {
			
			"valid_children" : ["all"],
			"type_attr" : "ref",
			"types" : {
				"root" : {
					"icon" : {
						"image" : window.currentContextPath + "/images/root.png"
					},
					"valid_children" : [ "file","folder" ],
					"max_depth" : 2,
					"hover_node" : false,
					"select_node" : function(e) {
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
		    			  
		    			 $('#refIncorpForm .formError').hide(0);
		    			 
		    			// var textValue = $('#incorpemail').val();
			  				$('#refIncorpForm').trigger('reset');
			  				$('#refIncorpCCDAsubmit').unbind("click");
			  				
			  				$('#refIncorpfilePathOutput').empty();
			  				$('#refIncorpfilepath').val('');
			  				
			  				//$('#incorpemail').val(textValue);
			  				
		    		  },
		    		  
		    		  "select_node" : function (node,e) {
		    			  
		    			  $('#refIncorpForm .formError').hide(0);
		    			  //populate the textbox
		    			  $("#refIncorpfilepath").val(node.data("serverpath"));
		    			  
		    			  $("#refIncorpfilePathOutput").text($("#refIncorpfilepath").val());
		    			 
		    			  
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  
		    			  
		    			  $('#dLabel1').focus();
		    			  $('#dLabel1').dropdown("toggle");
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
				//alert("Loaded Incorp Tree");
				
				
				$('#refccdafiletreepanel').find('a').each(function() {
				    $(this).attr('tabindex', '1');
				});
			});
	
}

$("#refIncorpCCDAsubmit").click(function(e) {
	  
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
		          '<div class="lbl">Preparing your download...</div></div>' });
	  	
			$('#refIncorpForm .formError').hide(0);
			
		    
			$.fileDownload($('#refIncorpForm').attr('action'), {
				
				successCallback: function (url) {
					$.unblockUI(); 
	            },
	            failCallback: function (responseHtml, url) {
	            	alert("Server error:" + responseHtml);
	            	alert(url);
	            	$.unblockUI(); 
	            },
		        httpMethod: "POST",
		        data: $('#refIncorpForm').serialize()
		    });
		return false;
});

function loadCCDASamplesFromVendorsTree(){
	$("#ccdafiletreepanel").jstree({
		 "json_data" : {
			      "ajax" : {
				      "url" : sampleCCDATreeURL,
				      "type" : "post",
				      /*"data" : function (n) {
				    	 return { id : n.attr ? n.attr("id") : 0 };
				      }*/
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
		    			  
		    			  $('#incorpForm .formError').hide(0);
		    				
		    			  
		    			var textValue = $('#incorpemail').val();
		  				$('#incorpForm').trigger('reset');
		  				$('#incorpCCDAsubmit').unbind("click");
		  				
		  				$('#incorpfilePathOutput').empty();
		  				$('#incorpfilepath').val('');
		  				
		  				$('#incorpemail').val(textValue);
		    			  
		    		  },
		    		  "select_node" : function (node,e) {
		    			  
		    			  $('#incorpForm .formError').hide(0);
		    			  //populate the textbox
		    			  $("#incorpfilepath").val(node.data("serverpath"));
		    			  
		    			  $("#incorpfilePathOutput").text($("#incorpfilepath").val());
		    			 
		    			  
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  
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
}

$("#incorpCCDAsubmit").click(function(e){
    
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
	          '<div class="lbl">Preparing your download...</div></div>' });
  	
  
		$('#incorpForm .formError').hide(0);
		
	    
		$.fileDownload($('#incorpForm').attr('action'), {
			
			successCallback: function (url) {
				$.unblockUI(); 
            },
            failCallback: function (responseHtml, url) {
            	alert("Server error:" + responseHtml);
            	alert(url);
            	$.unblockUI(); 
            },
	        httpMethod: "POST",
	        data: $('#incorpForm').serialize()
	    });
		
	return false;
});

function loadCCDAReferenceTree(){
	
	$("#referenceDownloadFileTreePanel").jstree({
		"core" : {
		    "multiple" : false,
		    "animation" : 0
		  },
		 "json_data" : {
			      "ajax" : {
				      "url" : referenceCCDATreeURL,
				      "type" : "post",
				  }
	      },
	      
	      "types" : {
	    	  "valid_children" : [ "all" ],
	    	  "type_attr" : "ref",
	    	  "types" : {
		    	  "file" : {
		    		  "icon" : {
		    	    	  "image" : window.currentContextPath + "/images/file.png"
		    	      },
		    		  "valid_children" : [ "none" ],
		    		  "deselect_node" : function (node,e) {
		    			$('#referenceDownloadForm .formError').hide(0);
		  				$('#referenceDownloadForm').trigger('reset');
		  				$('#referenceDownloadFormCCDAsubmit').unbind("click");
		  				$('#referenceDownloadFilePathOutput').empty();
		  				$('#referenceDownloadFilepath').val('');
		    		  },
		    		  "select_node" : function (node,e) {
		    			  $('#referenceDownloadForm .formError').hide(0);
		    			  //populate the textbox
		    			  $("#referenceDownloadFilepath").val(node.data("serverpath"));
		    			  
		    			  $("#referenceDownloadFilePathOutput").text($("#referenceDownloadFilepath").val());
		    			  
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  $('#referenceDownloaddLabel').focus();
		    			  $('#referenceDownloaddLabel').dropdown("toggle");
		    		  }
		    	  }
	    	 }
	    },
	    "plugins" : [ "themes", "json_data", "ui", "types" ]
	}).bind('loaded.jstree', function(e, data) {
		isfiletreeloaded = true;
		$('#referenceDownloadFileTreePanel').find('a').each(function() {
		    $(this).attr('tabindex', '1');
		});
	});
}

$("#referenceDownloadCCDAsubmit").click(function(e){
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
	          '<div class="lbl">Preparing your download...</div></div>' });
  	
	{
		$('#referenceDownloadForm .formError').hide(0);
		
	    
		$.fileDownload($('#referenceDownloadForm').attr('action'), {
			
			successCallback: function (url) {
				$.unblockUI(); 
            },
            failCallback: function (responseHtml, url) {
            	alert("Server error:" + responseHtml);
            	alert(url);
            	$.unblockUI();
            },
	        httpMethod: "POST",
	        data: $('#referenceDownloadForm').serialize()
	    });
		
	}
	return false;
});

function loadCCDAReferenceFileUsedTree(){
	
	$("#referenceFileUsedTreePanel").jstree({
		 "json_data" : {
			      "ajax" : {
				      "url" : referenceCCDATreeURL,
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
		    			$('#referenceDownloadForm .formError').hide(0);
		  				$('#referenceFileUsed').empty();
		  				$('#referenceFileUsedFilepath').val('');
		    		  },
		    		  "select_node" : function (node,e) {
		    			  $('#CCDAR2_0ValidationForm .formError').hide(0);
		    			  //populate the textbox
		    			  $("#referenceFileUsedFilepath").val(node.data("serverpath"));
		    			
		    			  
		    			  $("#referenceFileUsed").text($("#referenceFileUsedFilepath").val());
		    			  
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  
		    			  $('#referenceFileUsedLabel').focus();
		    			  $('#referenceFileUsedLabel').dropdown("toggle");
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
		
		//loadReferenceCCDAIncorpTree();
		
		$('#referenceDownloadFileTreePanel').find('a').each(function() {
		    $(this).attr('tabindex', '1');
		});
	});
}


$(function(){
	$('#smartCCDAValidationBtn').bind('click', function(e, data) {
		smartCCDAValidation();
	});
	
	$('#reportSaveAsQuestion button').button();
	
	
	
	$('#saveResultsBtn').on('click', function(e){
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
	loadSampleTrees();
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