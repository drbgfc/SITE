<%
	/**
	 * Copyright (c) 2000-2012 Liferay, Inc. All rights reserved.
	 *
	 * This library is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU Lesser General Public License as published by the Free
	 * Software Foundation; either version 2.1 of the License, or (at your option)
	 * any later version.
	 *
	 * This library is distributed in the hope that it will be useful, but WITHOUT
	 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
	 * details.
	 */
%>

<%@include file="/init.jsp"%>

<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil"%>
<%@ page import="javax.portlet.PortletPreferences"%>
<%@ page import="com.liferay.util.PwdGenerator"%>
<%@ page
	import="com.liferay.portal.service.PortletPreferencesLocalServiceUtil"%>
<%@ page import="com.liferay.portal.kernel.util.WebKeys"%>
<%@ page import="com.liferay.portal.kernel.portlet.LiferayWindowState"%>

<portlet:defineObjects />

<portlet:actionURL var="sampleCCDATree"
	windowState="<%=LiferayWindowState.EXCLUSIVE.toString()%>">
	<portlet:param name="javax.portlet.action" value="sampleCCDATree" />
</portlet:actionURL>

<portlet:resourceURL id="getTrustBundle" var="getTrustBundleResource" />

<portlet:actionURL var="uploadTrustAnchor"
	windowState="<%=LiferayWindowState.EXCLUSIVE.toString()%>">
	<portlet:param name="javax.portlet.action" value="uploadTrustAnchor" />
</portlet:actionURL>

<portlet:actionURL var="uploadCCDADirectReceive"
	windowState="<%=LiferayWindowState.EXCLUSIVE.toString()%>">
	<portlet:param name="javax.portlet.action"
		value="uploadCCDADirectReceive" />
</portlet:actionURL>

<portlet:actionURL var="precannedCCDADirectReceive"
	windowState="<%=LiferayWindowState.EXCLUSIVE.toString()%>">
	<portlet:param name="javax.portlet.action"
		value="precannedCCDADirectReceive" />
</portlet:actionURL>

<portlet:resourceURL var="queryGetdcAction" id="queryGetdcAction"></portlet:resourceURL>
<script type="text/javascript">

	var URL_GETDC_ACTION = "<%=queryGetdcAction%>";

</script>

<%
	//String serviceContext = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/delegate";
%>

<portlet:renderURL var="endpointcerturl">
	<portlet:param name="mvcPath"
		value="/Certificates/PublicKeys/direct.sitenv.org_ca.der" />
</portlet:renderURL>

<script type="text/javascript">
	window.currentContextPath = "<%=request.getContextPath()%>";
	 
	var sampleCCDATreeURL = '${sampleCCDATree}';
</script>

<div class="panel panel-default" id="anchoruploadwidget">
	<div class="panel-heading">
		<h2 class="panel-title">Trust Anchor Exchange</h2>
	</div>
	<div class="panel-body">
		<span>Trust Anchor Exchange can be accomplished via two
			different mechanisms.</span>
		<ol>
			<li><span style="text-decoration: underline;"> Trust
					Anchor Exchange using BlueButton Trust Bundles: </span>
				<ul>
					<li>SITE's Direct instantiation synchronizes with the <a
						href="https://secure.bluebuttontrust.org/" target="_blank"
						tabindex="1">BlueButton</a><span class="inline-ext"><a class="ext-icon" href="http://www.hhs.gov/disclaimer.html" tabindex="1" target="_blank" title="Web Site Disclaimers"><span class="hiddenText">Web Site Disclaimers</span></a></span>
						 Patient and Provider Test bundles
						every minute. The SITE's Trust Anchor is already part of the <a
						href="https://secure.bluebuttontrust.org/" target="_blank"
						tabindex="1">BlueButton</a><span class="inline-ext"><a class="ext-icon" href="http://www.hhs.gov/disclaimer.html" tabindex="1" target="_blank" title="Web Site Disclaimers"><span class="hiddenText">Web Site Disclaimers</span></a></span>
						 Patient and Provider Test bundles.
						<ul>
							<li>Implementers can download the SITE Trust Anchor from the
								<a href="https://secure.bluebuttontrust.org/" target="_blank"
								tabindex="1">BlueButton</a><span class="inline-ext"><a class="ext-icon" href="http://www.hhs.gov/disclaimer.html" tabindex="1" target="_blank" title="Web Site Disclaimers"><span class="hiddenText">Web Site Disclaimers</span></a></span>
								 bundles.
							</li>
							<li>Implementers can submit their Trust Anchors on the <a
								href="https://secure.bluebuttontrust.org/" target="_blank"
								tabindex="1">BlueButton</a><span class="inline-ext"><a class="ext-icon" href="http://www.hhs.gov/disclaimer.html" tabindex="1" target="_blank" title="Web Site Disclaimers"><span class="hiddenText">Web Site Disclaimers</span></a></span>
								 website.
							</li>
						</ul>
					</li>
				</ul></li>
			<li><span style="text-decoration: underline;"> Trust
					Anchor Exchange using "SITE Upload Trust Anchor": </span>
				<ul>
					<li>Download the Trust Anchor for the Sandbox <a
						href="<%=request.getContextPath()%>/Certificates/PublicKeys/direct.sitenv.org_ca.der"
						tabindex="1">(direct.sitenv.org Certificate)</a> and import the
						trust anchor into your trust store.
					</li>
					<li>Please upload your Trust Anchor by selecting your Trust
						Anchor. If you need to replace the Trust Anchor, just perform
						another upload and the previous one will be replaced.</li>
					<li>Uploading the Trust Anchor causes an update to the <a
						href="/trustBundle/TrustBundle.p7b" tabindex="1">Trust Bundle</a>
						of <a href="http://direct.sitenv.org" target="_blank" tabindex="1">direct.sitenv.org</a>
						which is refreshed every five minutes and is only used for testing
						purposes. Once a Trust Anchor is uploaded, users can test with the
						Direct sandbox after five minutes.
					</li>
				</ul></li>
		</ol>
		<div class="well">
			<form id="anchoruploadform" action="${uploadTrustAnchor}"
				method="POST" enctype="multipart/form-data">

				<!-- The fileinput-button span is used to style the file input field as button -->
				<noscript>
					<input type="hidden" name="redirect" value="true" tabindex="1" />
				</noscript>
				<div id="anchoruploaderrorlock" style="position: relative;">
					<div class="row">
						<div class="col-md-12 form-group">
							<label for="anchoruploadfile">Select a Local Trust Anchor
								Certificate (binary or PEM encoded): </label><br /> <span
								class="btn btn-success fileinput-button"
								id="anchoruploadfile-btn"> <i
								class="glyphicon glyphicon-plus"></i>&nbsp;<span>Select a
									Certificate...</span> <!-- The file input field used as target for the file upload widget -->
								<input id="anchoruploadfile" type="file" name="anchoruploadfile"
								data-parsley-required data-parsley-required-message="This field is required." data-parsley-trigger="change" data-parsley-trustfiletypes data-parsley-anchormaxsize="3"
								tabindex="1" />
							</span>
							<div id="anchoruploadfiles" class="files"></div>
							<div id="anchorInfoArea" class="infoArea"></div>
						</div>
					</div>
				</div>
				<hr />
				<button id="anchoruploadsubmit" type="submit"
					class="btn btn-primary start" tabindex="1">
					<i class="glyphicon glyphicon-ok"></i> <span>Submit Anchor</span>
				</button>
			</form>
		</div>
		<div class="clear"></div>
	</div>
</div>

<div class="panel panel-default" id="anchoruploadwidget">
	<div class="panel-heading">
		<h2 class="panel-title">Direct Send</h2>
	</div>
	<div class="panel-body">
		<p>Send messages from your implementation to the end points listed
			below:
		<ul>
			<li>Provider1@direct.sitenv.org</li>
		</ul>
		Upon successful receipt of the message, the Direct Sandbox will send
		an MDN(Message Disposition Notification) back to the sender. The
		content of the message can be anything and is not validated or used by
		the SITE.
		</p>
	</div>
</div>

<div class="panel panel-default" id="directreceivewidget">
	<div class="panel-heading">
		<h2 class="panel-title">Direct Receive</h2>
	</div>
	<div class="panel-body">
		<p>Receive messages from the Sandbox to your system.
		<ul>
			<li><u>Choose your own content:</u> Developers can use their own
				files as the payload of the Direct message sent from the Sandbox.
				This provides the ability to verify the file they chosen and that
				the contents were decrypted appropriately.</li>
			<li><u>Choose pre-canned content:</u> Provides a list of files
				that you can choose from as the payload of the Direct message.</li>
			<li><u>Enter your end point name:</u> The name of the Direct
				address where you would like to receive the message. Ensure that the
				Trust Anchor corresponding to the end point has already been
				uploaded.</li>
			<li>Once the above fields are populated, hit the send message
				button.<br /> You will receive a message from
				provider1@direct.sitenv.org to your system with the content you have
				uploaded.
			</li>
		</ul>
		</p>
		<br /> <br />
		<!-- Nav tabs -->
		<ul id="directMessageType" class="nav nav-tabs" role="tablist">
			<li class="active"><a href="#precanned" role="tab"
				data-toggle="tab" tabindex="1">Choose Precanned Content</a></li>
			<li><a href="#choosecontent" role="tab" data-toggle="tab"
				tabindex="1">Choose Your Own Content</a></li>
		</ul>
		<div class="well">
			<div class="tab-content">
				<div class="tab-pane active" id="precanned">
					<div id="precannedFormWrapper">
						<form id="precannedForm" action="${precannedCCDADirectReceive}"
							method="POST">
							<div class="form-group">
							<p>
								<label for="precannedemail">Enter Your Endpoint Name:</label><br />
								<input id="precannedemail" class="form-control"
									data-parsley-required 
									data-parsley-required-message="End point is required." 
									data-parsley-email 
									data-parsley-type-message="End point format is invalid (hint:example@test.org)"
									name="precannedemail"
									placeholder="recipient direct email address"
									style="display: inline;" type="email" tabindex="1" required />
							</p>
							<div id="uploadPrecannedEmailInfoArea" class="infoArea"></div>
							</div>
							<br />
							<noscript>
								<input type="hidden" name="redirect" value="true" />
							</noscript>
							<div id="precannederrorlock" style="position: relative;">
								<div class="row">
									<div class="col-md-12 form-group">
										<label for="dLabel">Select a Precanned Sample C-CDA
											File to Send:</label><br />
										<div class="dropdown">
											<button id="dLabel" data-toggle="dropdown"
												class="btn btn-success dropdown-toggle"
												type="button" tabindex="1">
												Pick Sample <i class="glyphicon glyphicon-play"></i>
											</button>
											<ul class="dropdown-menu rightMenu" role="menu"
												aria-labelledby="dLabel">
												<li>
													<div id="ccdafiletreepanel"></div>
												</li>
											</ul>
										</div>
										<div>
											<span id="precannedfilePathOutput"></span>
										</div>
										<div id="precannedInfoArea" class="infoArea"></div>
									</div>
								</div>
							</div>
							<hr />
							<button id="precannedCCDAsubmit" type="submit"
								class="btn btn-primary start" onclick="return false;"
								tabindex="1">
								<i class="glyphicon glyphicon-envelope"></i> <span>Send
									Message</span>
							</button>
							<input id="precannedfilepath" name="precannedfilepath"
								type="hidden">
						</form>
					</div>
				</div>
				<div class="tab-pane" id="choosecontent">
					<div id="uploadFormWrapper">
						<form id="ccdauploadform" action="${uploadCCDADirectReceive}"
							method="POST" enctype="multipart/form-data">
							
							<div class="form-group">
							<p>
								<label for="ccdauploademail">Enter Your Endpoint Name:</label><br />
								<input id="ccdauploademail"
									class="form-control"
									data-parsley-required 
									data-parsley-required-message="End point is required." 
									data-parsley-email 
									data-parsley-type-message="End point format is invalid (hint:example@test.org)"
									name="ccdauploademail"
									placeholder="recipient direct email address"
									style="display: inline;" type="email" tabindex="1" 
									
									/>
							</p>
							<div id="uploadEmailInfoArea" class="infoArea"></div>
							</div>
							<br />
							<noscript>
								<input type="hidden" name="redirect" value="true" />
							</noscript>
							<div id="ccdauploaderrorlock" style="position: relative;">
								<div class="row">
									<div class="col-md-12 form-group">
										<label for="ccdauploadfile">Select a Local C-CDA File
											to Send:</label><br /> <span
											class="btn btn-success fileinput-button"
											id="ccdauploadfile-btn"> <i
											class="glyphicon glyphicon-plus"></i>&nbsp;<span>Upload
												C-CDA</span> <!-- The file input field used as target for the file upload widget -->
											<input id="ccdauploadfile" type="file" name="ccdauploadfile" 
											data-parsley-required 
											data-parsley-trigger="change" 
											data-parsley-required-message="Please select a C-CDA file."
											data-parsley-ccdamaxsize="3" 
											data-parsley-filetype="xml"
											tabindex="1" />
										</span>

										<div id="ccdauploadfiles" class="files"></div>
										<div id="localCCDAInfoArea" class="infoArea"></div>
									</div>
								</div>
							</div>
							<hr />
							<button id="ccdauploadsubmit" type="submit"
								class="btn btn-primary start" onclick="return false;"
								tabindex="1">
								<i class="glyphicon glyphicon-envelope"></i> <span>Send
									Message</span>
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<br />
		<div class="clear"></div>
	</div>
</div>

<div class="panel panel-default" id="discoverywidget">
	<div class="panel-heading">
		<h2 class="panel-title">Direct Certificate Discovery</h2>
	</div>
	<div class="panel-body">
		<div class='directions'>Directions</div>
		<p>The getdc tool is designed to simplify and automate Direct
			certificate discovery, however, it can be used to fetch any x509
			certificate from LDAP or DNS. There is nothing specific to Direct
			about this tool.</p>
		<p>The command line utility and API attempts to fetch an x509
			certificate, or certificates, from DNS and.or LDAP. If found, the
			utility saves the certificate, or certificates, as a .pem file in the
			local file system. A top level boolean variable is_found contains the
			flag indicating if the certificate was found or not.</p>
		<div class="well">
			<form action="about:blank" method="POST"
				enctype="multipart/form-data" target="_self"
				onsubmit="return false;" name="form-getdc" id="form-getdc">
				<div class="form-group">
					<div>
						<label for="directAddress">Enter Direct Address or Domain:</label><br />
						<input id="directAddress" class="form-control"
							name="directAddress" placeholder="direct email address or domain"
							style="display: inline;" type="text" tabindex="1" data-parsley-required data-parsley-required-message="This field is required."/>
					</div>
					<div id="directCertInfoArea" class="infoArea"></div>
				</div>
				<hr />
				<div class="form-group form-group-buttons">
					<button id="getdc-submit" type="submit"
						class="btn btn-primary start" tabindex="1">
						<i class="glyphicon glyphicon-ok"></i> <span>Submit</span>
					</button>
					<button id="getdc-reset" type="reset" class="btn btn-default start"
						tabindex="1">
						<i class="glyphicon glyphicon-refresh"></i> <span>Reset</span>
					</button>
				</div>
				<div id="testcase-results" class="input-group-small hide"
					aria-hidden="true">
					<div class="form-group">
						<div>
							<span class="form-cell form-cell-label"> <label class="">
									<span
									class="glyphicon glyphicon-certificate glyphicon-type-info"></span>Results
							</label>
							</span>
						</div>
					</div>
					<div id="testcase-results-accordion"></div>
				</div>
			</form>
		</div>
	</div>
</div>
