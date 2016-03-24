$
		.extend(
				$.dcdt,
				{
					"hosting" : $
							.extend(
									function() {
										return this;
									},
									{
										"processHostingTestcase" : function() {
											return $.dcdt.beans
													.setBean({
														"data" : $
																.encodeJson({
																	"@type" : "request",
																	"items" : [ testcaseHostingSubmission ]
																}),
														"queryBeanSuccess" : function(
																data, status,
																jqXhr) {

															// Show the div
															$(
																	"#testcase-results")
																	.removeClass(
																			"hide");
															$(
																	"#testcase-results")
																	.attr(
																			"aria-hidden",
																			"false");

															var testcaseHostingResult = data["items"][0];
															var testcaseHostingSuccess = testcaseHostingResult["success"];
															var testcaseHostingSuccessStr = (testcaseHostingSuccess ? "success"
																	: "error");
															var testcaseHostingName = testcaseHostingSubmission["testcase"];

															var testcaseHostingResultHeaderElem = $("<h3/>");
															testcaseHostingResultHeaderElem
																	.enableClass("testcase-hosting-result-header");
															testcaseHostingResultHeaderElem
																	.enableClass(("testcase-hosting-result-header-" + testcaseHostingSuccessStr));
															testcaseHostingResultHeaderElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Testcase",
																					testcaseHostingName));
															testcaseHostingResultHeaderElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Direct Address",
																					testcaseHostingSubmission["directAddr"]));
															testcaseHostingResultsAccordion
																	.append(testcaseHostingResultHeaderElem);

															var testcaseHostingCertInfo = testcaseHostingResult["discoveredCertInfo"], testcaseHostingCert = (testcaseHostingCertInfo ? testcaseHostingCertInfo["cert"]
																	: null);

															var testcaseHostingCertInfosInvalid = testcaseHostingResult["invalidDiscoveredCertInfos"], testcaseHostingCertsInvalid = [];

															if (testcaseHostingCertInfosInvalid) {
																testcaseHostingCertInfosInvalid
																		.forEach(function(
																				testcaseHostingCertInfoInvalid) {
																			testcaseHostingCertsInvalid
																					.push(testcaseHostingCertInfoInvalid["cert"]);
																		});
															}

															var testcaseHostingResultBodyElem = $("<div/>");
															testcaseHostingResultBodyElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Success",
																					testcaseHostingSuccess));
															testcaseHostingResultBodyElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Processing Message(s)",
																					testcaseHostingResult["procMsgs"]));
															testcaseHostingResultBodyElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseSteps(
																					"Processed Step(s)",
																					testcaseHostingResult["procSteps"]));
															testcaseHostingResultBodyElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Discovered Valid Certificate",
																					(testcaseHostingCert ? $(
																							"<pre/>")
																							.enableClass(
																									"testcase-hosting-cert")
																							.text(
																									testcaseHostingCert)
																							: null)));

															var testcaseHostingCertsInvalidBodyElem = $("<span/>");

															if (testcaseHostingCertsInvalid.length > 0) {
																testcaseHostingCertsInvalid
																		.forEach(function(
																				testcaseHostingCertInvalid) {
																			testcaseHostingCertsInvalidBodyElem
																					.append($(
																							"<pre/>")
																							.enableClass(
																									"testcase-hosting-cert")
																							.text(
																									testcaseHostingCertInvalid))
																		});
															} else {
																testcaseHostingCertsInvalidBodyElem = null;
															}

															testcaseHostingResultBodyElem
																	.append($.fn.dcdt.testcases
																			.buildTestcaseItem(
																					"Discovered Invalid Certificate(s)",
																					testcaseHostingCertsInvalidBodyElem));
															testcaseHostingResultsAccordion
																	.append(testcaseHostingResultBodyElem);

															testcaseHostingResultsAccordion
																	.accordion("refresh");
															testcaseHostingResultsAccordion
																	.accordion({
																		"active" : -1
																	});

															$(
																	"h3.testcase-hosting-result-header",
																	testcaseHostingResultsAccordion)
																	.each(
																			function() {
																				var testcaseHostingResultHeaderElem = $(this);

																				var testcaseHostingResultHeaderIcon = $(
																						"span.ui-accordion-header-icon",
																						testcaseHostingResultHeaderElem);
																				testcaseHostingResultHeaderIcon
																						.disableClass("ui-icon");
																				testcaseHostingResultHeaderIcon
																						.enableClass("glyphicon");

																				if (testcaseHostingResultHeaderElem
																						.hasClass("testcase-hosting-result-header-success")) {
																					testcaseHostingResultHeaderElem
																							.addClass("panel-success");

																					testcaseHostingResultHeaderIcon
																							.enableClass("glyphicon-ok");
																					testcaseHostingResultHeaderIcon
																							.enableClass("glyphicon-type-success");
																				} else {
																					testcaseHostingResultHeaderElem
																							.addClass("panel-danger");

																					testcaseHostingResultHeaderIcon
																							.enableClass("glyphicon-remove");
																					testcaseHostingResultHeaderIcon
																							.enableClass("glyphicon-type-error");
																				}
																			});
														},
														"queryBeanErrors" : function(
																data, status,
																jqXhr) {
															$.dcdt.beans
																	.addQueryErrors(
																			formTestcasesHosting,
																			data);
														},
														"postQueryBean" : function(
																jqXhr, status) {
															formTestcasesHosting.dcdt.form
																	.formReady();
														},
														"preQueryBean" : function(
																jqXhr, settings) {
															$.dcdt.beans
																	.clearBeanMessages(formTestcasesHosting);
														},
														"url" : URL_HOSTING_PROCESS
													});
										}
									})
				});

var formTestcasesHosting, testcasesHostingSelect, testcaseHostingDirectAddr, testcaseHostingSubmit, testcaseHostingReset, testcaseHostingSubmission, testcaseHostingResults, testcaseHostingResultsAccordion;