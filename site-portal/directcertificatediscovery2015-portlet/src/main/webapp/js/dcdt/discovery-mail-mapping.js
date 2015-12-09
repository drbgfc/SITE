$
		.extend(
				$.dcdt,
				{
					"discoveryMailMapping" : $
							.extend(
									function() {
										return this;
									},
									{
										"processDiscoveryMailMapping" : function() {
											
											return $.dcdt.beans
													.setBean({
														"data" : $
																.encodeJson({
																	"@type" : "request",
																	"items" : [ discoveryMailMapping ]
																}),
														"queryBeanSuccess" : function(
																data, status,
																jqXhr) {
															$.dcdt.beans
																	.addBeanMessageGlobal(
																			formDiscoveryMailMapping,
																			"success",
																			((data["items"].length > 0) ? data["items"][0]["msg"]
																					: null));
														},
														"queryBeanErrors" : function(
																data, status,
																jqXhr) {

															$.dcdt.beans
																	.addQueryErrors(
																			formDiscoveryMailMapping,
																			data);

															$.dcdt.beans
																	.addBeanMessageGlobal(
																			formDiscoveryMailMapping,
																			"error",
																			((data["items"].length > 0) ? data["items"][0]["msg"]
																					: null));
														},
														"postQueryBean" : function(
																jqXhr, status) {
															formDiscoveryMailMapping.dcdt.form
																	.formReady();
														},
														"preQueryBean" : function(
																jqXhr, settings) {
															$.dcdt.beans
																	.clearBeanMessages(formDiscoveryMailMapping);
														},
														"url" : URL_DISCOVERY_MAIL_MAPPING_ADD
													});
										}
									})
				});

var formDiscoveryMailMapping, directAddr, resultsAddr, discoveryMailMappingSubmit, discoveryMailMappingReset, discoveryMailMapping;