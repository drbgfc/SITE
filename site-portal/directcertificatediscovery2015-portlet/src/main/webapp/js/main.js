$(function() {
	
	/*
	 * Parsley Options
	 */
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
	
	/*
	 * 	Hosting Section 
	 */
	formTestcasesHosting = $("form[name=\"form-testcases-hosting\"]");
    testcasesHostingSelect = $("select#testcase-hosting-select", formTestcasesHosting);
    testcaseHostingDirectAddr = $("input#testcase-hosting-direct-addr", formTestcasesHosting);
    testcaseHostingSubmit = $("button#testcase-hosting-submit", formTestcasesHosting);
    testcaseHostingReset = $("button#testcase-hosting-reset", formTestcasesHosting);
    testcaseHostingResults = $("div#testcase-results", formTestcasesHosting);
    testcaseHostingResultsAccordion = $("div#testcase-results-accordion", testcaseHostingResults);

    testcaseHostingResultsAccordion.accordion({
        "collapsible": true,
        "heightStyle": "content",
        "icons": {
            "activeHeader": "",
            "header": ""
        }
    });
    testcaseHostingResultsAccordion.empty();
    
    formTestcasesHosting.submit(function (event) {
        testcaseHostingSubmission = {
            "@type": "hostingTestcaseSubmission",
            "directAddr": testcaseHostingDirectAddr.val(),
            "testcase": testcasesHostingSelect.val()
        };
        
        $.dcdt.hosting.processHostingTestcase();
    });
    
    testcaseHostingSubmit.click(function (event) {

    	isValid = $('form#form-testcases-hosting').parsley(parsleyOptions).validate();
    	
    	if (isValid) {
    		
    		// Reset the validation errors
        	$('form#form-testcases-hosting').parsley().reset();
            formTestcasesHosting.submit();
    	
    	}
    });
    
    testcaseHostingReset.click(function (event) {
    	
    	$('#hosting-testcase-desc').addClass("hide"); 
    	$('#hosting-testcase-desc').attr("aria-hidden", "true"); 
    	$('#testcase-results').addClass("hide");
    	$('#testcase-results').attr("aria-hidden", "true");
    	
    	// Reset the validation errors
    	$('form#form-testcases-hosting').parsley().reset();
    	$('form#form-testcases-hosting').children('#testcase-info')
    												.children('.form-group')
    												.children('.infoArea')
    												.children('.filled').removeClass('filled');
    	
        testcaseHostingDirectAddr.val("");
        testcasesHostingSelect.val("");
        testcaseHostingResultsAccordion.empty();
        $.fn.dcdt.testcases.clearTestcaseDescription({
            "postClearTestcaseDescription": function () {
                testcaseHostingDirectAddr.attr("disabled", "disabled");
            }
        });
        $.fn.dcdt.form.clearMessages();
    });
    
    // On change of the HOSTING TESTCASE select (populates static data in a div)
    testcasesHostingSelect.change(function (event) {
        $(event.target).dcdt.testcases.selectTestcase(event, formTestcasesHosting, {
        	"method" : "hosting",
            "postBuildTestcaseDescription": function (settings, testcase, testcaseDesc, testcaseDescElem) {
                var elem = $(this);
                
                testcaseDescElem.prepend(elem.dcdt.testcases.buildTestcaseItem("Binding Type", testcase["bindingType"]), elem.dcdt.testcases.buildTestcaseItem("Location Type", testcase["locType"]));
                
                testcaseHostingDirectAddr.removeAttr("disabled");
            }
        });
    });
    
    /*
     * 	Mail Mapping
     */
    formDiscoveryMailMapping = $("form[name=\"form-testcases-discovery-mail-mapping\"]");
    directAddr = $("input[name=\"directAddress\"]", formDiscoveryMailMapping);
    resultsAddr = $("input[name=\"resultsAddress\"]", formDiscoveryMailMapping);
    discoveryMailMappingSubmit = $("button#discovery-mail-mapping-submit");
    discoveryMailMappingReset = $("button#discovery-mail-mapping-reset");
    
    $.each([ directAddr, resultsAddr ], function (addrElemIndex, addrElem) {
        addrElem.tooltip();
    });
    
    formDiscoveryMailMapping.submit(function (event) {
        discoveryMailMapping = {
            "@type": "discoveryTestcaseMailMapping",
            "directAddr": directAddr.val(),
            "resultsAddr": resultsAddr.val()
        };
        
        $.dcdt.discoveryMailMapping.processDiscoveryMailMapping();
    });
    
    discoveryMailMappingSubmit.click(function (event) {
    	
    	isValid = $('form#form-testcases-discovery-mail-mapping').parsley(parsleyOptions).validate();
    	
    	if (isValid) {
    		
    		// Reset the validation errors
    		$('form#form-testcases-discovery-mail-mapping').parsley().reset();
    		formDiscoveryMailMapping.submit();
    	}
    	
    });
    
    discoveryMailMappingReset.click(function (event) {
        directAddr.val("");
        resultsAddr.val("");
        $.fn.dcdt.form.clearMessages();
        
        // Reset the validation errors
    	$('form#form-testcases-discovery-mail-mapping').parsley().reset();
    	
    	$('#form-testcases-discovery-mail-mapping').children('.form-group')
													.children('.infoArea')
													.children('.filled').removeClass('filled');
    });
	
	/*
	 * 	Discovery Section
	 */
	var formTestcasesDiscovery = $("form[name=\"form-testcases-discovery\"]"), testcasesDiscoverySelect = $(
			"select#testcase-select", formTestcasesDiscovery), testcaseDiscoveryDirectAddr = $(
			"div#testcase-discovery-direct-addr", formTestcasesDiscovery), testcaseDiscoveryDirectAddrContent = $(
			"span:last-of-type", testcaseDiscoveryDirectAddr);

	// on change of the DISCOVERY TESTCASE select (populates a div somewhere)
	testcasesDiscoverySelect
			.change(function(event) {
				$(event.target).dcdt.testcases
						.selectTestcase(
								event,
								formTestcasesDiscovery,
								{
									"method" : "discovery",
									"postBuildTestcaseDescription" : function(
											settings, testcase, testcaseDesc,
											testcaseDescElem) {
										var elem = $(this);

										[ "target", "background" ]
												.forEach(function(
														testcaseDiscoveryCredsType) {
													var testcaseDiscoveryCreds = testcase[testcaseDiscoveryCredsType
															+ "Creds"], testcaseDiscoveryCredDescElems = [];

													if (testcaseDiscoveryCreds) {
														testcaseDiscoveryCreds
																.forEach(function(
																		testcaseDiscoveryCred) {
																	testcaseDiscoveryCredDescElems
																			.push(settings["buildDiscoveryTestcaseCredentialDescription"]
																					(
																							settings,
																							testcaseDiscoveryCred));
																});
													}

													testcaseDescElem
															.append(elem.dcdt.testcases
																	.buildTestcaseItem(
																			$
																					.capitalize(testcaseDiscoveryCredsType)
																					+ " Certificate(s)",
																			testcaseDiscoveryCredDescElems));
												});

										testcaseDiscoveryDirectAddrContent
												.append(settings["buildDiscoveryTestcaseDnsName"]
														(testcase["mailAddr"]));
										testcaseDiscoveryDirectAddr.show();
									},
									"buildDiscoveryTestcaseCredentialDescription" : function(
											settings, testcaseDiscoveryCred) {
										var elem = $(this), testcaseDiscoveryCredDescElems = [];

										if (testcaseDiscoveryCred) {
											var testcaseDiscoveryCredDesc = testcaseDiscoveryCred["desc"], testcaseDiscoveryCredLoc = testcaseDiscoveryCred["loc"], testcaseDiscoveryCredLocType = testcaseDiscoveryCredLoc["type"], testcaseDiscoveryCredLocElems = [];

											testcaseDiscoveryCredDescElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Valid",
																	testcaseDiscoveryCred["valid"]));
											testcaseDiscoveryCredDescElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Binding Type",
																	testcaseDiscoveryCred["bindingType"]));

											testcaseDiscoveryCredLocElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Type",
																	testcaseDiscoveryCredLocType));
											testcaseDiscoveryCredLocElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Mail Address",
																	testcaseDiscoveryCredLoc["mailAddr"]));

											if (testcaseDiscoveryCredLocType == "LDAP") {
												var testcaseDiscoveryCredLocLdapConfig = testcaseDiscoveryCredLoc["ldapConfig"];

												testcaseDiscoveryCredLocElems
														.push(elem.dcdt.testcases
																.buildTestcaseItem(
																		"Host",
																		testcaseDiscoveryCredLocLdapConfig["host"]));
												testcaseDiscoveryCredLocElems
														.push(elem.dcdt.testcases
																.buildTestcaseItem(
																		"Port",
																		testcaseDiscoveryCredLocLdapConfig["port"]));
											}

											testcaseDiscoveryCredDescElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Location",
																	testcaseDiscoveryCredLocElems));

											testcaseDiscoveryCredDescElems
													.push(elem.dcdt.testcases
															.buildTestcaseItem(
																	"Description",
																	testcaseDiscoveryCredDesc["text"]));
											testcaseDiscoveryCredDescElems = elem.dcdt.testcases
													.buildTestcaseItem(
															testcaseDiscoveryCred["nameDisplay"],
															testcaseDiscoveryCredDescElems);
										}

										return testcaseDiscoveryCredDescElems;
									},
									"buildDiscoveryTestcaseDnsName" : function(
											testcaseDiscoveryDnsName) {
										if (!testcaseDiscoveryDnsName) {
											return null;
										}

										var testcaseDiscoveryDnsNameElem = $("<span/>");
										testcaseDiscoveryDnsNameElem
												.text(testcaseDiscoveryDnsName);

										if (testcaseDiscoveryDnsName
												.lastIndexOf(".") == (testcaseDiscoveryDnsName.length - 1)) {
											testcaseDiscoveryDnsNameElem
													.append($("<i/>").text(
															"<domain>"));
										}

										return testcaseDiscoveryDnsNameElem;
									},
									"postClearTestcaseDescription" : function(
											settings, testcaseDescElem) {
										testcaseDiscoveryDirectAddrContent
												.empty();
										testcaseDiscoveryDirectAddr.hide();
									}
								});
			});
});