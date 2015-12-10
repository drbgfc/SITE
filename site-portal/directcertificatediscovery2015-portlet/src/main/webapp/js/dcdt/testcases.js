(function ($) {
    $.extend($.fn.dcdt, {
        "testcases": $.extend(function () {
            return this;
        }, {
            "selectTestcase": function (event, form, settings) {
                var elem = $(event.target), testcaseName = elem.val(), testcase;
                
                form.dcdt.testcases.clearTestcaseDescription(settings);
                
                if (testcaseName && !$.isEmptyObject(testcase = TESTCASES.filter(function (testcase) {
                    return testcase["name"] == testcaseName;
                })) && (testcase = testcase[0])) {
                    form.dcdt.testcases.setTestcaseDescription(settings, testcase);
                }
            },
            "setTestcaseDescription": function (settings, testcase) {
                var elem = $(this);
                if (settings["method"] == "hosting")
            	{
                	elem.dcdt.testcases.testhostingcaseDescription().removeClass("hide");
                    elem.dcdt.testcases.testhostingcaseDescription().attr("aria-hidden", "false");
                	return elem.dcdt.testcases.testhostingcaseDescription().append(elem.dcdt.testcases.buildTestcaseDescription(settings, testcase));
            	}
                else
                {
                	elem.dcdt.testcases.testcaseDescription().removeClass("hide");
                    elem.dcdt.testcases.testcaseDescription().attr("aria-hidden", "false");
                	return elem.dcdt.testcases.testcaseDescription().append(elem.dcdt.testcases.buildTestcaseDescription(settings, testcase));
                }
            },
            "buildTestcaseDescription": function (settings, testcase) {
                var elem = $(this), testcaseDesc = testcase["desc"], testcaseDescElem = $("<div/>");
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("Negative", testcase["neg"]));
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("Optional", testcase["opt"]));
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("Description", testcaseDesc["text"]));
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("RTM Sections", testcaseDesc["rtmSections"].join(", ")));
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("Underlying Specification References", testcaseDesc["specs"]));
                testcaseDescElem.append(elem.dcdt.testcases.buildTestcaseItem("Instructions", testcaseDesc["instructions"]));
                
                if (settings) {
                    var postBuildTestcaseDescCallback = settings["postBuildTestcaseDescription"];
                    
                    if ($.isFunction(postBuildTestcaseDescCallback)) {
                        postBuildTestcaseDescCallback.apply(elem, [ settings, testcase, testcaseDesc, testcaseDescElem ]);
                    }
                }
                
                return testcaseDescElem;
            },
            "clearTestcaseDescription": function (settings) {
            	
            	var elem;
            	if (settings["method"] == "hosting")
        		{
            		$("#testcase-hosting-direct-addr").attr("disabled", "disabled");
            		var elem = $(this), testcaseDescElem = elem.dcdt.testcases.testhostingcaseDescription();
        		}
            	else
        		{
            		var elem = $(this), testcaseDescElem = elem.dcdt.testcases.testcaseDescription();
        		}
            	
            	testcaseDescElem.addClass("hide");
            	testcaseDescElem.attr("aria-hidden", "true");
            	
                testcaseDescElem.empty();
                
                if (settings) {
                    var postClearTestcaseDescCallback = settings["postClearTestcaseDescription"];
                    
                    if ($.isFunction(postClearTestcaseDescCallback)) {
                        postClearTestcaseDescCallback.apply(elem, [ settings, testcaseDescElem ]);
                    }
                }
                
                return testcaseDescElem;
            },
            "testhostingcaseDescription": function () {
                return $(this).find("div#hosting-testcase-desc");
            },
            "testcaseDescription": function () {
                return $(this).find("div#testcase-desc");
            },
            "testcaseSelect": function () {
                return $(this).find("select#testcase-select");
            },
            "buildTestcaseSteps": function (testcaseStepsLbl, testcaseSteps) {
                var testcaseStepsList = $("<ol/>");
                
                testcaseSteps.forEach(function (testcaseStep) {
                    testcaseStepsList.append($("<li/>").append($.fn.dcdt.testcases.buildTestcaseItem(testcaseStep["desc"]["text"], [
                        $.fn.dcdt.testcases.buildTestcaseItem("Success", testcaseStep["success"]),
                        
                        $.fn.dcdt.testcases.buildTestcaseItem("Binding Type", testcaseStep["bindingType"]),
                        $.fn.dcdt.testcases.buildTestcaseItem("Location Type", testcaseStep["locType"]),
                        
                        $.fn.dcdt.testcases.buildTestcaseItem("Message(s)", $.map(testcaseStep["msgs"], function (testcaseStepMsg) {
                            return $.fn.dcdt.testcases.buildTestcaseMessage(testcaseStepMsg);
                        })),
                        
                        
                        
                        ])
                        
                    ));
                });
                
                return $.fn.dcdt.testcases.buildTestcaseItem(testcaseStepsLbl, testcaseStepsList);
            },
            "buildTestcaseMessage": function (testcaseMsg) {
                var testcaseMsgLevel = testcaseMsg.level, testcaseMsgLevelClassName = "text-";
                
                switch (testcaseMsgLevel) {
                    case "ERROR":
                        testcaseMsgLevelClassName += "danger";
                        break;
                    
                    case "WARN":
                        testcaseMsgLevelClassName += "warning";
                        break;
                    
                    case "INFO":
                        testcaseMsgLevelClassName += "info";
                        break;
                    
                    default:
                        testcaseMsgLevelClassName += "default";
                        break;
                }
                
                return $("<span/>").append($("<strong/>", {
                    "class": testcaseMsgLevelClassName
                }).text(testcaseMsg.level), ": ", testcaseMsg.text);
            },
            "buildTestcaseItem": function (testcaseItemLbl, testcaseItemValues) {
                var testcaseItemElem = $("<div/>"), testcaseItemLblElem = $("<span/>");
                testcaseItemLblElem.append($("<strong/>").text(testcaseItemLbl), ": ");
                testcaseItemElem.append(testcaseItemLblElem);
                
                if (!$.isBoolean(testcaseItemValues) && !$.isNumeric(testcaseItemValues) && (!testcaseItemValues || $.isEmptyObject(testcaseItemValues))) {
                    testcaseItemLblElem.append($("<i/>").text("None"));
                } else if ($.isArray(testcaseItemValues)) {
                    var testcaseItemValuesList = $("<ul/>");
                    
                    testcaseItemValues.forEach(function (testcaseItemValue) {
                        testcaseItemValuesList.append($("<li/>").append(testcaseItemValue));
                    });
                    
                    testcaseItemElem.append(testcaseItemValuesList);
                } else {
                    testcaseItemLblElem.append(($.isBoolean(testcaseItemValues) || $.isNumeric(testcaseItemValues)) ? testcaseItemValues.toString()
                        : testcaseItemValues);
                }
                
                return testcaseItemElem;
            }
        })
    });
})(jQuery);
