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

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@ page import="com.liferay.portal.kernel.util.Validator"%>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil" %>
<%@ page import="javax.portlet.PortletPreferences"%>
<%@ page import="com.liferay.util.PwdGenerator"%>
<%@ page import="com.liferay.portal.service.PortletPreferencesLocalServiceUtil" %>
<%@ page import="com.liferay.portal.kernel.util.WebKeys" %>
<%@page import="com.liferay.portal.kernel.portlet.LiferayWindowState"%>

<portlet:defineObjects />

<portlet:actionURL var="sampleCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="sampleCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="uploadCCDADirectEdgeReceive" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="uploadCCDADirectEdgeReceive"/>
</portlet:actionURL>

<portlet:actionURL var="precannedCCDADirectEdgeReceive" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="precannedCCDADirectEdgeReceive"/>
</portlet:actionURL>

<portlet:actionURL var="smtpSearch" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="smtpSearch"/>
</portlet:actionURL>

<portlet:renderURL var="endpointcerturl"> 
	<portlet:param name="mvcPath" value="/Certificates/PublicKeys/direct.sitenv.org_ca.der" />  
</portlet:renderURL>  

<script type="text/javascript">
	window.currentContextPath = "<%=request.getContextPath()%>";
	var sampleCCDATreeURL = '${sampleCCDATree}';
</script>

<div class="panel panel-default" id="smtpsearchwidget">
	<div class="panel-heading"><h2 class="panel-title">Test ability to send SMTP messages from your system</h2></div>
	<div class="panel-body">
			In order to test the ability of your system to send SMTP messages in the context of Direct Edge protocols, please follow these instructions:
			<ul>
				<li>Send messages from your system to the following endpoint
					<ul>
						<li>
							provider1@edgedirect.sitenv.org
						</li>			
					</ul>
				</li>
				<li>To confirm that the SITE SMTP Edge test tool received your message, enter the "FROM" mail address that was used by your system to send the messages in the Search box below.
					<ul>
						<li>If the messages were successfully received, they will show up in a pop-up window, else it will display "no messages found."
					</ul>
				</li>
			</ul>
		<br/>
		<div class="well">
			<form id="smtpsearchform"  action="${smtpSearch}" method="POST">
			<div class="form-group">
			<label for="smtpsearchinput">Enter address to search:</label>
				<input type="text" name="smtpsearchinput" id="smtpsearchinput" class="form-control" 
						data-parsley-required data-parsley-type="email" data-parsley-trigger="change" data-parsley-required-message="Email address is required." tabindex="1"/>
				<div id="smtpsearchinputInfoArea" class="infoArea alert-danger"></div>
			<hr />
				<button id="smtpsearchsubmit" type="submit"
					class="btn btn-primary start"  tabindex="1">
					<i class="glyphicon glyphicon-search"></i> <span>Lookup Messages</span>
				</button>
			</div>	
			</form>
		</div>
	</div>
</div>

<div class="panel panel-default" id="directreceivewidget">
      <div class="panel-heading"><h2 class="panel-title">Send SMTP messages to your system</h2></div>
  		<div class="panel-body">
			<p>
				In order to test the ability of your system to receive SMTP messages in the context of Direct Edge protocols, please follow these instructions:
				<ul>
					<li>
						<span style="font-weight:bold;">Enter your from address:</span> The email address in your system which is setup to receive messages via Direct SMTP Edge Protocol.
					</li>
					<li>
						<span style="font-weight:bold;">Choose your own content:</span> Developers can use their own files as the payload of the SMTP message sent from the test tool. This provides the ability to verify the file chosen was received and processed correctly by your system.
					</li>
					<li>
						<span style="font-weight:bold;">Choose pre-canned content:</span> Provides a list of pre-formatted files from which you can choose as the payload of the Direct message.
					</li>
					<li>
						Once the above fields are populated, hit the Send Message button.
					</li>
				</ul>
			</p>
			<br/><br/>
			<!-- Nav tabs -->
			<ul id="directMessageType" class="nav nav-tabs" role="tablist">
			  <li class="active"><a href="#precanned" role="tab" data-toggle="tab"  tabindex="1">Choose Precanned Content</a></li>
			  <li><a href="#choosecontent" role="tab" data-toggle="tab"  tabindex="1">Choose Your Own Content</a></li>
			</ul>
			<div class="well">
			
			
		
		<div class="tab-content">
  			<div class="tab-pane active" id="precanned">
  				<div id="precannedFormWrapper">
			<form id="precannedForm"  action="${precannedCCDADirectEdgeReceive}" method="POST">
				<div class="form-group">
				<label for="fromemail">Enter Edge System From Address:</label><br/>
					<input id="fromemail"
						class="form-control" 
						name="fromemail"
						placeholder="from email address"
						style="display: inline;" type="text"
						data-parsley-required data-parsley-type="email" data-parsley-trigger="change" data-parsley-required-message="Email address is required."  tabindex="1"/>
						<div id="fromemail" class="infoArea alert-danger"></div>
				</div>
				
				<br />
				<noscript><input type="hidden" name="redirect" value="true"  /></noscript>
				
					<div class="form-group">
					
					<div style="display: inline-block; margin-bottom: 5px; font-weight: bold;">Select a Precanned Sample C-CDA File to Send:</div><br/>
									<div class="dropdown">
										<button id="dLabel" data-toggle="dropdown" class="btn btn-success dropdown-toggle" type="button" tabindex="1">
											Pick Sample <i class="glyphicon glyphicon-play"></i>
										</button>

										<ul class="dropdown-menu rightMenu" role="menu" aria-labelledby="dLabel" style="overflow: scroll; /* position: absolute; */" >
											<li>
												<div id="ccdafiletreepanel"></div>
											</li>
										</ul>
									</div>
					<span id="precannedfilePathOutput"></span>
					<!-- display:none is used because configuring parsley validation to validate hidden form fields is broken as of 2.x -->
					<input id="precannedfilepath" value="" type="text" data-parsley-required data-parsley-required-message="Please select a CCDA from the dropdown." name="precannedfilepath" style="display:none;" />
					<div id="precannedfilepath" class="infoArea alert-danger"></div>
					</div>
				
				<hr />
				<button id="precannedCCDAsubmit" type="submit" class="btn btn-primary start" tabindex="1">
					<i class="glyphicon glyphicon-envelope"></i> <span>Send Message</span>
				</button>
				
			</form>
		</div>
  			</div>
  			<div class="tab-pane" id="choosecontent">
  			<div id="uploadFormWrapper">
			<form id="ccdauploadform" action="${uploadCCDADirectEdgeReceive}" method="POST" enctype="multipart/form-data">
				<div class="form-group">
					<label for="ccdauploademail">Enter Edge System From Address:</label><br/>
					 <input id="ccdauploademail"
						class="form-control"
						name="ccdauploademail"
						placeholder="from email address"
						style="display: inline;" type="text" 
						data-parsley-required data-parsley-type="email" data-parsley-trigger="change" data-parsley-required-message="Email address is required."
						tabindex="1"/>
						<div id="ccdauploademail" class="infoArea alert-danger"></div>
				</div>
				<br />
				<noscript><input type="hidden" name="redirect" value="true" /></noscript>
				<div id="ccdauploaderrorlock" style="position: relative;">
					<div class="row">
					<div class="col-md-12 form-group">
						<label for="ccdauploadfile">Select a Local C-CDA File to Send:</label><br/>
							<span class="btn btn-success fileinput-button" id="ccdauploadfile-btn"> 
								<i class="glyphicon glyphicon-plus"></i>&nbsp;<span>Upload C-CDA</span> <!-- The file input field used as target for the file upload widget -->
								<input id="ccdauploadfile" type="file" name="ccdauploadfile" data-parsley-maxsize="3" data-parsley-filetype="xml" data-parsley-required data-parsley-trigger="change" data-parsley-required-message="Please select a C-CDA file." tabindex="1"/>
							</span>
							
							<div id="ccdauploadfiles" class="files"></div>
							<div id="CCDA1InfoArea" class="infoArea alert-danger"></div>
					</div>
					</div>
				</div>
				<hr />
				<button id="ccdauploadsubmit" type="submit" class="btn btn-primary start" tabindex="1">
					<i class="glyphicon glyphicon-envelope"></i> 
					<span>Send Message</span>
				</button>
			</form>
		</div>
  			</div>
		</div>
		
		</div>
		<br/>
			
			<div class="clear"></div>
		</div>
</div>

<div class="modal modal-wide fade" id="resultsDialog" tabindex="-1"
	role="dialog" aria-labelledby="resultModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h1 style="font-size: 2em;margin-top: 0px;">SMTP Search Results</h1>
			</div>
			<div class="modal-body" id="SMTPSearchResult"></div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close Search Results</button>
			</div>
		</div>
	</div>
</div>

