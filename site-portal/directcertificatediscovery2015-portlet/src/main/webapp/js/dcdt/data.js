//var URL_HOSTING_PROCESS = "http://demo31.direct-test.com/dcdt-web/hosting/process";
//var URL_DISCOVERY_MAIL_MAPPING_ADD = "http://demo31.direct-test.com/dcdt-web/discovery/mail/mapping/add";

var TESTCASES = [

		/*
		 * Data for hosting section.
		 */
		{
			"name" : "H1_DNS_AB_Normal",
			"nameDisplay" : "H1 - Normal address-bound certificate search in DNS",
			"opt" : false,
			"steps" : [ {
				"bindingType" : "ADDRESS",
				"desc" : {
					"@type" : "certDiscoveryStepDesc",
					"text" : "Query DNS for address-bound CERT record(s)."
				},
				"msgs" : [],
				"success" : false,
				"locType" : "DNS"
			}, {
				"bindingType" : "NONE",
				"success" : false,
				"desc" : {
					"@type" : "certDiscoveryStepDesc",
					"text" : "Validation of discovered certificate(s)."
				},
				"msgs" : [],
				"locType" : null
			} ],
			"bindingType" : "ADDRESS",
			"locType" : "DNS",
			"desc" : {
				"@type" : "hostingTestcaseDesc",
				"text" : "This test case verifies that your system's DNS can host and return the expected address-bound X.509 certificate.",
				"instructions" : "Enter a Direct address corresponding to an address-bound X.509 certificate that is hosted by your system's DNS and then click Submit. DCDT will attempt to discover the certificate and display the result on the screen.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [ "RFC 4398: Section 2.1",
						"Direct Applicability Statement for Secure Health Transport: Section 5.3" ]
			},
			"neg" : false
		},
		{
			"name" : "H2_DNS_DB_Normal",
			"nameDisplay" : "H2 - Normal domain-bound certificate search in DNS",
			"opt" : false,
			"steps" : [ {
				"bindingType" : "DOMAIN",
				"desc" : {
					"@type" : "certDiscoveryStepDesc",
					"text" : "Query DNS for domain-bound CERT record(s)."
				},
				"msgs" : [],
				"success" : false,
				"locType" : "DNS"
			}, {
				"bindingType" : "NONE",
				"success" : false,
				"desc" : {
					"@type" : "certDiscoveryStepDesc",
					"text" : "Validation of discovered certificate(s)."
				},
				"msgs" : [],
				"locType" : null
			} ],
			"bindingType" : "DOMAIN",
			"locType" : "DNS",
			"desc" : {
				"@type" : "hostingTestcaseDesc",
				"text" : "This test case verifies that your system's DNS can host and return the expected domain-bound X.509 certificate.",
				"instructions" : "Enter a Direct address corresponding to a domain-bound X.509 certificate that is hosted by your system's DNS and then click Submit. DCDT will attempt to discover the certificate and display the result on the screen.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [ "RFC 4398: Section 2.1",
						"Direct Applicability Statement for Secure Health Transport: Section 5.3" ]
			},
			"neg" : false
		},
		{
			"name" : "H3_LDAP_AB_Normal",
			"nameDisplay" : "H3 - Normal address-bound certificate search in LDAP",
			"opt" : false,
			"steps" : [
					{
						"bindingType" : "DOMAIN",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query DNS for SRV record(s)."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "DNS"
					},
					{
						"bindingType" : "DOMAIN",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query the first available LDAP server for it's base Distinguished Name(s) (DN[s])."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "LDAP"
					},
					{
						"bindingType" : "ADDRESS",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query the first available LDAP server for the userCertificate attribute of entry(s) whose mail attribute is address-bound."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "LDAP"
					}, {
						"bindingType" : "NONE",
						"success" : false,
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Validation of discovered certificate(s)."
						},
						"msgs" : [],
						"locType" : null
					} ],
			"bindingType" : "ADDRESS",
			"locType" : "LDAP",
			"desc" : {
				"@type" : "hostingTestcaseDesc",
				"text" : "This test case verifies that your system's LDAP server can host and return the expected address-bound X.509 certificate.",
				"instructions" : "Enter a Direct address corresponding to an address-bound X.509 certificate that is hosted by your system's LDAP server and then click Submit. DCDT will attempt to discover the certificate and display the result on the screen.",
				"rtmSections" : [ "2", "3", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "19", "20",
						"21", "22" ],
				"specs" : [ "RFC 2798: Section 9.1.2" ]
			},
			"neg" : false
		},
		{
			"name" : "H4_LDAP_DB_Normal",
			"nameDisplay" : "H4 - Normal domain-bound certificate search in LDAP",
			"opt" : false,
			"steps" : [
					{
						"bindingType" : "DOMAIN",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query DNS for SRV record(s)."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "DNS"
					},
					{
						"bindingType" : "DOMAIN",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query the first available LDAP server for it's base Distinguished Name(s) (DN[s])."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "LDAP"
					},
					{
						"bindingType" : "DOMAIN",
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Query the first available LDAP server for the userCertificate attribute of entry(s) whose mail attribute is domain-bound."
						},
						"msgs" : [],
						"success" : false,
						"locType" : "LDAP"
					}, {
						"bindingType" : "NONE",
						"success" : false,
						"desc" : {
							"@type" : "certDiscoveryStepDesc",
							"text" : "Validation of discovered certificate(s)."
						},
						"msgs" : [],
						"locType" : null
					} ],
			"bindingType" : "DOMAIN",
			"locType" : "LDAP",
			"desc" : {
				"@type" : "hostingTestcaseDesc",
				"text" : "This test case verifies that your system's LDAP server can host and return the expected domain-bound X.509 certificate.",
				"instructions" : "Enter a Direct address corresponding to a domain-bound X.509 certificate that is hosted by your system's LDAP server and then click Submit. DCDT will attempt to discover the certificate and display the result on the screen.",
				"rtmSections" : [ "2", "3", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "19", "20",
						"21", "22" ],
				"specs" : [ "RFC 2798: Section 9.1.2" ]
			},
			"neg" : false
		},

		/*
		 * Data for discovery section.
		 */
		{
			"name" : "D1_DNS_AB_Valid",
			"nameDisplay" : "D1 - Valid address-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d1@domain1.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D1_valA",
				"nameDisplay" : "D1_valA",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in a DNS CERT record containing the Direct address in the rfc822Name of the SubjectAlternativeName extension."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "d1@domain1.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D1_invB",
						"nameDisplay" : "D1_invB",
						"bindingType" : "DOMAIN",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid domain-bound certificate for the Direct address in a DNS CERT record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "domain1.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D1_invC",
						"nameDisplay" : "D1_invC",
						"bindingType" : "ADDRESS",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid address-bound certificate for the Direct address in an LDAP server with an associated SRV record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : {
								"@type" : "instanceLdapConfig",
								"name" : "ldap1",
								"nameDisplay" : "LDAP 1",
								"host" : "0.0.0.0",
								"port" : 10389,
								"sslType" : "NONE",
								"ssl" : false
							},
							"type" : "LDAP",
							"mailAddr" : "d1@domain1.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D1_invD",
						"nameDisplay" : "D1_invD",
						"bindingType" : "DOMAIN",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid domain-bound certificate for the Direct address in an LDAP server with an associated SRV record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : {
								"@type" : "instanceLdapConfig",
								"name" : "ldap1",
								"nameDisplay" : "LDAP 1",
								"host" : "0.0.0.0",
								"port" : 10389,
								"sslType" : "NONE",
								"ssl" : false
							},
							"type" : "LDAP",
							"mailAddr" : "domain1.demo31.direct-test.com"
						}
					} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for address-bound CERT records and discover a valid address-bound X.509 certificate for a Direct address.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [
						"RFC 4398: Section 2.1",
						"Direct Applicability Statement for Secure Health Transport: Sections 4.0 and 5.3" ]
			},
			"neg" : false
		},
		{
			"name" : "D2_DNS_DB_Valid",
			"nameDisplay" : "D2 - Valid domain-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d2@domain1.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D2_valB",
				"nameDisplay" : "D2_valB",
				"bindingType" : "DOMAIN",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid domain-bound certificate in a DNS CERT record containing the Direct address' domain name in the dNSName of the SubjectAlternativeName extension."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "domain1.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D2_invC",
						"nameDisplay" : "D2_invC",
						"bindingType" : "ADDRESS",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid address-bound certificate for the Direct address in an LDAP server with an associated SRV record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : {
								"@type" : "instanceLdapConfig",
								"name" : "ldap1",
								"nameDisplay" : "LDAP 1",
								"host" : "0.0.0.0",
								"port" : 10389,
								"sslType" : "NONE",
								"ssl" : false
							},
							"type" : "LDAP",
							"mailAddr" : "d2@domain1.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D2_invD",
						"nameDisplay" : "D2_invD",
						"bindingType" : "DOMAIN",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid domain-bound certificate for the Direct address in an LDAP server with an associated SRV record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : {
								"@type" : "instanceLdapConfig",
								"name" : "ldap1",
								"nameDisplay" : "LDAP 1",
								"host" : "0.0.0.0",
								"port" : 10389,
								"sslType" : "NONE",
								"ssl" : false
							},
							"type" : "LDAP",
							"mailAddr" : "domain1.demo31.direct-test.com"
						}
					} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for domain-bound CERT records and discover a valid domain-bound X.509 certificate for a Direct address.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [
						"RFC 4398: Section 2.1",
						"Direct Applicability Statement for Secure Health Transport: Sections 4.0 and 5.3" ]
			},
			"neg" : false
		},
		{
			"name" : "D3_LDAP_AB_Valid",
			"nameDisplay" : "D3 - Valid address-bound certificate discovery in LDAP",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d3@domain2.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D3_valC",
				"nameDisplay" : "D3_valC",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 0."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d3@domain2.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D3_invD",
				"nameDisplay" : "D3_invD",
				"bindingType" : "DOMAIN",
				"type" : "BACKGROUND",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Invalid domain-bound certificate for the Direct address in an LDAP server with an associated SRV record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "domain2.demo31.direct-test.com"
				}
			} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and discover a valid address-bound X.509 certificate for a Direct address in the associated LDAP server.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "2", "3", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "19", "20",
						"21", "22" ],
				"specs" : [ "RFC 2798: Section 9.1.2" ]
			},
			"neg" : false
		},
		{
			"name" : "D4_LDAP_DB_Valid",
			"nameDisplay" : "D4 - Valid domain-bound certificate discovery in LDAP",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d4@domain2.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D4_valD",
				"nameDisplay" : "D4_valD",
				"bindingType" : "DOMAIN",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid domain-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 0."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "domain2.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and discover a valid domain-bound X.509 certificate for a Direct address in the associated LDAP server.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "2", "3", "5", "6", "7", "8", "9", "10",
						"11", "12", "13", "14", "15", "16", "17", "19", "20",
						"21", "22" ],
				"specs" : [ "RFC 2798: Section 9.1.2" ]
			},
			"neg" : false
		},
		{
			"name" : "D5_DNS_AB_Invalid",
			"nameDisplay" : "D5 - Invalid address-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d5@domain1.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D5_invA",
				"nameDisplay" : "D5_invA",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "An invalid address-bound certificate for the Direct address in a DNS CERT record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "d5@domain1.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for address-bound CERT records and finds, but does not select the associated invalid address-bound X.509 certificate.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "1", "3" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D6_DNS_DB_Invalid",
			"nameDisplay" : "D6 - Invalid domain-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d6@domain4.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D6_invB",
				"nameDisplay" : "D6_invB",
				"bindingType" : "DOMAIN",
				"type" : "TARGET",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "An invalid domain-bound certificate for the Direct address in a DNS CERT record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "domain4.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for domain-bound CERT records and finds, but does not select the associated invalid domain-bound X.509 certificate.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "1", "3" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D7_LDAP_AB_Invalid",
			"nameDisplay" : "D7 - Invalid address-bound certificate discovery in LDAP",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d7@domain2.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D7_invC",
				"nameDisplay" : "D7_invC",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Invalid address-bound certificate for the Direct address in an LDAP server with an associated SRV record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d7@domain2.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and finds, but does not select the invalid address-bound X.509 certificate in the associated LDAP server.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "3", "22" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D8_LDAP_DB_Invalid",
			"nameDisplay" : "D8 - Invalid domain-bound certificate discovery in LDAP",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d8@domain5.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D8_invD",
				"nameDisplay" : "D8_invD",
				"bindingType" : "DOMAIN",
				"type" : "TARGET",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Invalid domain-bound certificate for the Direct address in an LDAP server with an associated SRV record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap3",
						"nameDisplay" : "LDAP 3",
						"host" : "0.0.0.0",
						"port" : 12389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "domain5.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and finds, but does not select the invalid domain-bound X.509 certificate in the associated LDAP server.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "3", "22" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D9_DNS_AB_SelectValid",
			"nameDisplay" : "D9 - Select valid address-bound certificate over invalid certificate in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d9@domain1.demo31.direct-test.com",
			"targetCreds" : [
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D9_valA",
						"nameDisplay" : "D9_valA",
						"bindingType" : "ADDRESS",
						"type" : "TARGET",
						"valid" : true,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Valid address-bound certificate in a DNS CERT record containing the Direct address in the rfc822Name of the SubjectAlternativeName extension."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "d9@domain1.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D9_invA",
						"nameDisplay" : "D9_invA",
						"bindingType" : "ADDRESS",
						"type" : "TARGET",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid address-bound certificate for the Direct address in a DNS CERT record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "d9@domain1.demo31.direct-test.com"
						}
					} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for address-bound CERT records and select the valid address-bound X.509 certificate instead of the invalid address-bound X.509 certificate.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3" ],
				"specs" : null
			},
			"neg" : false
		},
		{
			"name" : "D10_LDAP_AB_UnavailableLDAPServer",
			"nameDisplay" : "D10 - Certificate discovery in LDAP with one unavailable LDAP server",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d10@domain3.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D10_valE",
				"nameDisplay" : "D10_valE",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 1."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap2",
						"nameDisplay" : "LDAP 2",
						"host" : "0.0.0.0",
						"port" : 11389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d10@domain3.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and attempts to connect to an LDAP server based on the priority value specified in the SRV records until a successful connection is made. Your system should first attempt to connect to an LDAP server associated with an SRV record containing the lowest priority value (highest priority). Since this LDAP server is unavailable, your system should then attempt to connect to the LDAP server associated with an SRV record containing the second lowest priority value (second highest priority) and discover the valid address-bound X.509 certificate in the available LDAP server.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "15", "18" ],
				"specs" : [ "RFC 2782: Page 3, Priority Section" ]
			},
			"neg" : false
		},
		{
			"name" : "D11_DNS_NB_NoDNSCertsorSRV",
			"nameDisplay" : "D11 - No certificates discovered in DNS CERT records and no SRV records",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d11@domain6.demo31.direct-test.com",
			"targetCreds" : [],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system does not find any certificates when querying DNS for CERT records and does not find any SRV records in DNS.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "1", "3", "18" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D12_LDAP_NB_UnavailableLDAPServer",
			"nameDisplay" : "D12 - No certificates found in DNS CERT records and no available LDAP servers",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d12@domain7.demo31.direct-test.com",
			"targetCreds" : [],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and attempts to connect to an LDAP server associated with the only SRV record that should be found. Since this LDAP server is unavailable or does not exist and no additional SRV records should have been found, your system should not discover any X.509 certificates in either DNS CERT records or LDAP servers.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "1", "3", "18" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D13_LDAP_NB_NoCerts",
			"nameDisplay" : "D13 - No certificates discovered in DNS CERT records or LDAP servers",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d13@domain8.demo31.direct-test.com",
			"targetCreds" : [],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system does not discover any certificates in DNS CERT records or LDAP servers when no certificates should be found.",
				"instructions" : "Verify that your system did NOT send an email because it could not find a certificate for the Direct address. To pass this test case, you must NOT receive an email in response.",
				"rtmSections" : [ "1", "3", "18" ],
				"specs" : null
			},
			"neg" : true
		},
		{
			"name" : "D14_DNS_AB_TCPLargeCert",
			"nameDisplay" : "D14 - Discovery of certificate larger than 512 bytes in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d14@domain1.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D14_valA",
				"nameDisplay" : "D14_valA",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate that is larger than 512 bytes in a DNS CERT record containing the Direct address in the rfc822Name of the SubjectAlternativeName extension."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "d14@domain1.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for address-bound CERT records and discover a valid address-bound X.509 certificate that is larger than 512 bytes using a TCP connection.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3", "4" ],
				"specs" : [
						"Direct Applicability Statement for Secure Health Transport: Section 5.4",
						"RFC 1035: Section 4.2", "RFC 4298: Section 4" ]
			},
			"neg" : false
		},
		{
			"name" : "D15_LDAP_AB_SRVPriority",
			"nameDisplay" : "D15 - Certificate discovery in LDAP based on SRV priority value",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d15@domain2.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D15_valC",
				"nameDisplay" : "D15_valC",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 0."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d15@domain2.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D15_invE",
				"nameDisplay" : "D15_invE",
				"bindingType" : "ADDRESS",
				"type" : "BACKGROUND",
				"valid" : false,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Invalid address-bound certificate for the Direct address in an LDAP server. The associated SRV record has Priority = 1."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap2",
						"nameDisplay" : "LDAP 2",
						"host" : "0.0.0.0",
						"port" : 11389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d15@domain2.demo31.direct-test.com"
				}
			} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and discover a valid address-bound X.509 certificate in the LDAP server associated with an SRV record containing the lowest priority value (highest priority).",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "15", "18" ],
				"specs" : [ "RFC 2782: Page 3, Priority Section" ]
			},
			"neg" : false
		},
		{
			"name" : "D16_LDAP_AB_SRVWeight",
			"nameDisplay" : "D16 - Certificate discovery in LDAP based on SRV weight value",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d16@domain5.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D16_valC",
				"nameDisplay" : "D16_valC",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 0 and Weight = 100."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap3",
						"nameDisplay" : "LDAP 3",
						"host" : "0.0.0.0",
						"port" : 12389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d16@domain5.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D16_valE",
				"nameDisplay" : "D16_valE",
				"bindingType" : "ADDRESS",
				"type" : "BACKGROUND",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate in an LDAP server with the appropriate mail attribute and InetOrgPerson schema. The associated SRV record has Priority = 0 and Weight = 0."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : {
						"@type" : "instanceLdapConfig",
						"name" : "ldap1",
						"nameDisplay" : "LDAP 1",
						"host" : "0.0.0.0",
						"port" : 10389,
						"sslType" : "NONE",
						"ssl" : false
					},
					"type" : "LDAP",
					"mailAddr" : "d16@domain5.demo31.direct-test.com"
				}
			} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for SRV records and discover a valid address-bound X.509 certificate in the LDAP server associated with an SRV record containing the lowest priority value (highest priority) and the highest weight value when SRV records with the same priority value exist.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "16", "18" ],
				"specs" : [ "RFC 2782: Page 3, Weight Section" ]
			},
			"neg" : false
		},
		{
			"name" : "D17_DNS_AB_CRLRevocation",
			"nameDisplay" : "D17 - CRL-based revocation checking for address-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d17@domain9.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D17_valA",
				"nameDisplay" : "D17_valA",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid, non-revoked address-bound certificate for the Direct address in a DNS CERT record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "d17@domain9.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D17_invB",
						"nameDisplay" : "D17_invB",
						"bindingType" : "ADDRESS",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "An invalid, revoked address-bound certificate for the Direct address in a DNS CERT record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "d17@domain9.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D17_invC",
						"nameDisplay" : "D17_invC",
						"bindingType" : "ADDRESS",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : " An invalid, revoked address-bound certificate for the Direct address in a DNS CERT record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "d17@domain9.demo31.direct-test.com"
						}
					},
					{
						"@type" : "discoveryTestcaseCred",
						"name" : "D17_invD",
						"nameDisplay" : "D17_invD",
						"bindingType" : "DOMAIN",
						"type" : "BACKGROUND",
						"valid" : false,
						"desc" : {
							"@type" : "discoveryTestcaseCredDesc",
							"text" : "Invalid domain-bound certificate for the Direct address in a DNS CERT record."
						},
						"issuerCred" : {
							"@type" : "discoveryTestcaseCred",
							"name" : "demo31.direct-test.com_ca_root",
							"nameDisplay" : "demo31.direct-test.com_ca_root",
							"bindingType" : "NONE",
							"type" : "CA",
							"valid" : true,
							"desc" : null,
							"issuerCred" : null,
							"loc" : null
						},
						"loc" : {
							"@type" : "discoveryTestcaseCredLoc",
							"ldapConfig" : null,
							"type" : "DNS",
							"mailAddr" : "domain9.demo31.direct-test.com"
						}
					} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for address-bound CERT records and discover a valid X.509 certificate whose CRL-based revocation status indicates that it has not been revoked",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [
						"RFC 4398: Section 2.1",
						"Direct Applicability Statement for Secure Health Transport: Sections 4.0 and 5.3" ]
			},
			"neg" : false
		},
		
		{
			"name" : "D18_DNS_AB_AIAIntermediateIssuer",
			"nameDisplay" : "D18 - AIA-based intermediate issuer certificate retrieval for address-bound certificate discovery in DNS",
			"opt" : false,
			"steps" : null,
			"mailAddr" : "d18@domain10.demo31.direct-test.com",
			"targetCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D18_valA",
				"nameDisplay" : "D18_valA",
				"bindingType" : "ADDRESS",
				"type" : "TARGET",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Valid address-bound certificate issued by an intermediate CA for the Direct address in a DNS CERT record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "d18@domain10.demo31.direct-test.com"
				}
			} ],
			"backgroundCreds" : [ {
				"@type" : "discoveryTestcaseCred",
				"name" : "D18_invB",
				"nameDisplay" : "D18_invB",
				"bindingType" : "DOMAIN",
				"type" : "BACKGROUND",
				"valid" : true,
				"desc" : {
					"@type" : "discoveryTestcaseCredDesc",
					"text" : "Invalid domain-bound certificate for the Direct address in a DNS CERT record."
				},
				"issuerCred" : {
					"@type" : "discoveryTestcaseCred",
					"name" : "demo31.direct-test.com_ca_root",
					"nameDisplay" : "demo31.direct-test.com_ca_root",
					"bindingType" : "NONE",
					"type" : "CA",
					"valid" : true,
					"desc" : null,
					"issuerCred" : null,
					"loc" : null
				},
				"loc" : {
					"@type" : "discoveryTestcaseCredLoc",
					"ldapConfig" : null,
					"type" : "DNS",
					"mailAddr" : "domain10.demo31.direct-test.com"
				}
			} ],
			"desc" : {
				"@type" : "discoveryTestcaseDesc",
				"text" : "This test case verifies that your system can query DNS for an address-bound CERT record and discover a valid X.509 certificate whose path to the trusted root CA certificate must be retrieved via Authority Information Access (AIA) X.509v3 extension caIssuers HTTP URIs.",
				"instructions" : "You should have received an email indicating the test case results for your system. Examine the results to see if your system passed the test case. If you do not receive a message for the test case, then you should assume that the test case failed.",
				"rtmSections" : [ "1", "3" ],
				"specs" : [
							"RFC 5280: Section 4.2.2.1",
							"Direct Applicability Statement for Secure Health Transport: Section 4.2.2" ]
				
			},
			"neg" : false
		},
		];