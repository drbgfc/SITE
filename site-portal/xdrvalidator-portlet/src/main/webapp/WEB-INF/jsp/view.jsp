<%--
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
--%>

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

<portlet:actionURL var="urlAction" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="uploadXDR"/>
</portlet:actionURL>

<portlet:actionURL var="precannedXDR" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="precannedXDR"/>
</portlet:actionURL>

<portlet:actionURL var="sampleCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="sampleCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="xdrSendGetRequestList" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="xdrSendGetRequestList"/>
</portlet:actionURL>

<portlet:actionURL var="xdrSendGetRequest" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="xdrSendGetRequest"/>
</portlet:actionURL>

<script type="text/javascript">
	var url = '${urlAction}';
	var precannedUrl = '${precannedXDR}';
	window.currentContextPath = "<%=request.getContextPath()%>";
	var sampleCCDATreeURL = '${sampleCCDATree}';
	var xdrSendGetRequestList = '${xdrSendGetRequestList}';
	var xdrSendGetRequest = '${xdrSendGetRequest}';
</script>


<div class="panel panel-default" id="xdrsendwidget">
	<div class="panel-heading"><h2 class="panel-title">Validate XDR Messages Generated By Your System</h2></div>
	<div class="panel-body">
		<p>
			In order to verify if your system is producing XDR messages per the IHE XDR profile used in the context of Direct Edge protocols
			<ul>
				<li>Send messages from your implementation to the endpoint listed below:
					<ul>
						<li>
							${xdrSoapEndpoint}
						</li>			
					</ul>
				</li>
				<li>Successful processing of the message will give you a "Success" message</li>
				<li>Any errors will be provided as a validation report soon.</li>
				<li>If you want to view what was received by SITE from your system enter the Message Lookup Key which is:
					<ul>
						<li>Your From Address which is part of the SOAP Envelope or your IP Address if the From Address is not present in the SOAP envelope.</li>
					</ul>
				</li>
			</ul>
		</p>
		<br/>
		<div class="well">
			<form id="XDRSendGetRequestList"  action="${xdrSendGetRequestList}" method="POST">
				<div class="form-group">
					<label for="requestListGrouping">Enter Message Lookup Key:</label>
					<input type="text" name="requestListGrouping" id="requestListGrouping"  tabindex="1" placeholder="Enter your From Address (or IP Address) here." 
      								data-parsley-required="Message Lookup Key"
      								data-parsley-ipOrEmail
									data-parsley-required-message="Message Lookup Key is required." tabindex="1"/>
				
					<div id="requestListInfoArea" class="infoArea"></div>
				</div>
			<hr />
				<button id="xdrSendSearchSubmit" type="submit"
					class="btn btn-primary start" onclick="return false;"  tabindex="1">
					<i class="glyphicon glyphicon-search"></i> <span>Lookup Requests</span>
				</button>	
			</form>
		</div>
	</div>
</div>

<div class="modal modal-wide fade" id="xdrSendModal" tabindex="-1" role="dialog" aria-labelledby="xdrSendModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<ul class="nav nav-tabs" id="resultModalTabs">
					  <li><a href="#tabs-1" data-toggle="tab">XDR Send Requests</a></li>
					</ul>
			</div>
			<div class="modal-body">
				<div id="ValidationResult">
					<div class="tab-content" id="resultTabContent">
						<div class="tab-pane" id="tabs-1">
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" id="closeResultsBtn" data-dismiss="modal">Close Results</button>
			</div>
		</div>
	</div>
</div>

<div class="panel panel-default" id="xdrreceivewidget">
      <div class="panel-heading"><h2 class="panel-title">Send XDR Messages To Your System</h2></div>
  		<div class="panel-body">
			<p>
				In order to verify if your system is consuming XDR messages per the IHE XDR profile used in the context of Direct Edge protocols
				<ul>
					<li>Send messages from SITE XDR Test Tool to your system by entering your endpoint below</li>
					<li>Enter any optional properties by expanding the optional XDR message properties panel.  To remove the entered properties, collapse the panel by clicking on the title.</li>
					<li>Choose a CCDA document that you would like to attach as part of the payload</li>
					<li>Send the XDR message</li>
				</ul>
 
			</p>
			<br/>
			<ul id="xdrMessageType" class="nav nav-tabs" role="tablist">
			  <li class="active"><a href="#precanned" role="tab" data-toggle="tab"  tabindex="1">Choose Precanned Content</a></li>
			  <li><a href="#choosecontent" role="tab" data-toggle="tab"  tabindex="1">Choose Your Own Content</a></li>
			</ul>
			<div class="well">
					<div class="tab-content">
  			<div class="tab-pane active" id="precanned">
  				<div id="precannedFormWrapper">
			<form id="XDRPrecannedForm"  action="${precannedXDR}" method="POST">
				<div class="form-group">	
					<label for="precannedWsdlLocation">Enter Your Endpoint URL:</label>
					<input type="text" class="form-control" name="precannedWsdlLocation" id="precannedWsdlLocation" 
									placeholder="Enter your Endpoint URL here. http:// ..." 
      								data-parsley-required="URL"
      								data-parsley-wsdlUrl
									data-parsley-required-message="End point is required." tabindex="1" required/>
					
					<div id="precannedXdrInfoArea" class="infoArea"></div>
							
				</div>
				<br />
				
				<div class="panel-group" id="precannedOptional" role="tablist" aria-multiselectable="true">
				  <div class="panel panel-default">
				    <div class="panel-heading" role="tab" id="precannedOptionalHeadingOne">
				      <div class="panel-title">
				        <a data-toggle="collapse" data-parent="#precannedOptional" href="#precannedOptionalOne" aria-expanded="true" aria-controls="precannedOptionalOne" style="font-size:small;" tabindex="1" class="collapsed">
				          Optional XDR Message Properties
				          <span id="precannedOptionalHeaderSpan" class="glyphicon"></span>
				        </a>
				      </div>
				    </div>
				    <div id="precannedOptionalOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="precannedOptionalHeadingOne">
				      <div class="panel-body">
								<div class="form-group">
				        			<label for="precannedFromDirectAddress">Enter Your From Direct Address:</label>
									<input type="email" name="precannedFromDirectAddress" id="precannedFromDirectAddress" class="form-control"  
										data-parsley-email 
										data-parsley-type-message="Direct address format is invalid (hint:example@test.org)" tabindex="1"/>
								
									<div id="precannedFromDirectArea" class="infoArea"></div>
								</div>
								<br />
								<div class="form-group">
								
									<label for="precannedToDirectAddress">Enter Your To Direct Address:</label>
									<input type="email" name="precannedToDirectAddress" id="precannedToDirectAddress" class="form-control" 
										data-parsley-email 
										data-parsley-type-message="Direct address format is invalid (hint:example@test.org)" tabindex="1"/>
							
									<div id="precannedToDirectArea" class="infoArea"></div>
								</div>	
								<br/>
								<div class="form-group">
									<label for="precannedMessageType">Select an XDR Message Type:</label><br/>
									<select id="precannedMessageType" name="precannedMessageType" class="form-control" tabindex="1">
										<option value="minimal">Minimal XDR Message</option>
									    <option value="full">Full XDR Message</option>
						  			</select>
						  		</div>
						  	</div>
				    </div>
				  </div>
				</div>
				
				
			
				<br/>
				<br/>
				
				<noscript><input type="hidden" name="redirect" value="true"  /></noscript>
				<div id="precannederrorlock" style="position: relative;">
					<div class="row">
					<div class="col-md-12">
					<div  style="display: inline-block; margin-bottom: 5px; font-weight: bold;">Select a Precanned Sample C-CDA File to Send:</div><br/>
									<div class="dropdown">
										<button id="dLabel" data-toggle="dropdown"
											class="btn btn-success dropdown-toggle" type="button" 	tabindex="1">
											Pick Sample <i class="glyphicon glyphicon-play"></i>
										</button>

										<ul class="dropdown-menu rightMenu" role="menu" aria-labelledby="dLabel" style="overflow: scroll; /* position: absolute; */" >
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
					class="btn btn-primary start" onclick="return false;"  tabindex="1">
					<i class="glyphicon glyphicon-envelope"></i> <span>Send
						Message</span>
				</button>
				<input id="precannedfilepath"
						name="precannedfilepath" type="hidden">
			</form>
		</div>
  			</div>
  			<div class="tab-pane" id="choosecontent">
  			<div id="uploadFormWrapper">
			<form id="XDRValidationForm" action="${urlAction}" method="POST" enctype="multipart/form-data">
      	
				<div class="form-group">
				<label for="wsdlLocation">Enter Your Endpoint URL:</label>
				<input type="text" name="wsdlLocation" id="wsdlLocation" class="form-control" 
									placeholder="Enter your Endpoint URL here. http:// ..." 
      								data-parsley-required="URL"
      								data-parsley-wsdlUrl
									data-parsley-required-message="End point is required." 
								    tabindex="1" required/>
				
				<div id="uploadedXdrInfoArea" class="infoArea"></div>
				</div>
				<br/>

				<div class="panel-group" id="uploadOptional" role="tablist" aria-multiselectable="true">
				  <div class="panel panel-default">
				    <div class="panel-heading" role="tab" id="uploadOptionalHeadingOne">
				      <div class="panel-title">
				        <a data-toggle="collapse" data-parent="#uploadOptional" href="#uploadOptionalOne" aria-expanded="true" aria-controls="uploadOptionalOne" style="font-size:small;" tabindex="1" class="collapsed">
				          Optional XDR Message Properties
				          <span id="uploadOptionalHeaderSpan" class="glyphicon"></span>
				        </a>
				      </div>
				    </div>
				    <div id="uploadOptionalOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="precannedOptionalHeadingOne">
				      <div class="panel-body">
				       <div class="form-group">
				       		<label for="fromDirectAddress">Enter Your From Direct Address:</label>
							<input type="email" name="fromDirectAddress" id="fromDirectAddress" 
										data-parsley-email 
										data-parsley-type-message="Direct address format is invalid (hint:example@test.org)" tabindex="1"/>
							<div id="uploadedFromDirectArea" class="infoArea"></div>
						</div>	
						
						<br />
						<div class="form-group">
							<label for="toDirectAddress">Enter Your To Direct Address:</label>
							<input type="email" name="toDirectAddress" id="toDirectAddress" 
										data-parsley-email 
										data-parsley-type-message="Direct address format is invalid (hint:example@test.org)" tabindex="1"/>
							<div id="uploadedToDirectArea" class="infoArea"></div>
						</div>
									
						<br/>
						<div class="form-group">
						<label for="messageType">Select an XDR Message Type:</label><br/>
						<select id="messageType" name="messageType" class="form-control" tabindex="1">
							<option value="minimal">Minimal XDR Message</option>
						    <option value="full">Full XDR Message</option>
			  			</select>
			  			
			  			</div>
		  				</div>
				    </div>
				  </div>
				</div>

				
				<br/><br/>
			
			<noscript><input type="hidden" name="redirect" value="true" /></noscript>
			<div id="ccdauploaderrorlock" style="position: relative;">
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
						<label for="fileupload">Select a Local C-CDA File to Send:</label><br/>
						<span class="btn btn-success fileinput-button" id="fileupload-btn"> <i
								class="glyphicon glyphicon-plus"></i>&nbsp;<span>Upload C-CDA...</span>
								<input id="fileupload" type="file" name="file" data-parsley-required 
											data-parsley-trigger="change" 
											data-parsley-required-message="Please select a C-CDA file."
											data-parsley-ccdamaxsize="3" 
											data-parsley-filetype="xml"
											tabindex="1"/>
						</span>
						<div id="files"></div>
						<div id="fileuploadInfoArea" class="infoArea"></div>
						</div>
					</div>
					
					
				</div>
					
					
			</div>
			<hr/>
			<button id="formSubmit" type="submit" class="btn btn-primary start" onclick="return false;"  tabindex="1">
							<i class="glyphicon glyphicon-envelope"></i> <span>Send Message</span>
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


<div class="modal modal-wide fade" id="xdrReceiveModal" tabindex="-1" role="dialog" aria-labelledby="xdrReceiveModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<ul class="nav nav-tabs" id="receiveModalTabs">
					  <li><a href="#receivetabs-1" data-toggle="tab">XDR Send Requests</a></li>
					</ul>
			</div>
			<div class="modal-body">
				<div id="receiveValidationResult">
					<div class="tab-content" id="receiveTabContent">
						<div class="tab-pane" id="receivetabs-1">
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" id="closeReceiveResultsBtn" data-dismiss="modal">Close Results</button>
			</div>
		</div>
	</div>
</div>



