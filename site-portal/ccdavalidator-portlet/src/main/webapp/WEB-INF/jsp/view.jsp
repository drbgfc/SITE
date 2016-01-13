<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ page import="com.liferay.portal.kernel.portlet.LiferayWindowState" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://sitenv.org/tags" prefix="site" %>


<portlet:actionURL var="sampleCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="sampleCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="reconciledCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="reconciledCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="referenceCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="referenceCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="referenceCCDAIncorpTree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="referenceCCDAIncorpTree"/>
</portlet:actionURL>

<portlet:actionURL var="negativeTestCCDATree" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="negativeTestCCDATree"/>
</portlet:actionURL>

<portlet:actionURL var="urlAction1_1" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="uploadCCDA1.1"/>
</portlet:actionURL>

<portlet:actionURL var="urlAction2_0" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="uploadCCDA2.0"/>
</portlet:actionURL>

<portlet:actionURL var="smartCCDAAction" windowState="<%= LiferayWindowState.EXCLUSIVE.toString() %>">
    <portlet:param name="javax.portlet.action" value="smartCCDA"/>
</portlet:actionURL>


<portlet:resourceURL id="saveAsPDF" var="downloadCCDAAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadReconciledBundle" var="downloadReconciledBundleAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadReferenceTestData" var="downloadReferenceTestDataAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadTestInputFile" var="downloadTestInputAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadVendorIncorporation" var="downloadVendorIncorporationAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadReferenceTreeIncorporation" var="downloadReferenceTreeIncorporationAction">
</portlet:resourceURL>

<portlet:resourceURL id="downloadNegativeTestTreeIncorporation" var="downloadNegativeTestTreeIncorporationAction">
</portlet:resourceURL>

<portlet:defineObjects/>

<portlet:actionURL var="editCaseURL" name="uploadFile">
    <portlet:param name="jspPage" value="/Upload.jsp"/>
</portlet:actionURL>

<liferay-ui:success key="success" message="CCD upload completed!"/>

<liferay-ui:error key="error" message="CCD contains error(s)."/>

<script type="text/javascript">
    window.currentContextPath = "<%=request.getContextPath()%>";
    var sampleCCDATreeURL = '${sampleCCDATree}';
    var showVocab = '${showVocabulary}';
    var showDataQuality = '${showDataQualityValidation}';
    var showVocabularyValidation = (showVocab === 'true');
    var showDataQualityValidation = (showDataQuality === 'true');
    var reconciledCCDATreeURL = '${reconciledCCDATree}';
    var referenceCCDATreeURL = '${referenceCCDATree}';
    var referenceCCDAIncorpTreeURL = '${referenceCCDAIncorpTree}';
    var negativeTestCCDATreeURL = '${negativeTestCCDATree}';
</script>

<div id="CCDAvalidator" class="panel panel-default">
    <div class="panel-heading"><h2 class="panel-title">C-CDA Validator</h2></div>

    <div class="panel-body">

        <p>The goal of the SITE C-CDA Validator is to validate conformance of C-CDA documents to the standard in order to promote interoperability. The validator is also a resource that can evaluate submitted C-CDA documents  conformance to ONC 2014 and 2015 Edition Standards and Certification Criteria (S&amp;CC) objectives and regulations. </p>
        <p>To perform C-CDA validation, please select a C-CDA validator below. <br/><br/>Please note: validation may
            take up to one minute to run.</p>

        <div class="panel-group well" id="CCDAAccordion">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        <a data-toggle="collapse" data-parent="#CCDAAccordion" href="#collapseCCDA1_1" tabindex="1">
                            C-CDA R1.1 / ONC 2014 S&CC Validator
                        </a>
                    </h3>
                </div>
                <div id="collapseCCDA1_1" class="panel-collapse collapse">
                    <div class="panel-body">
                        <div id="CCDA11">
                            <div id="CCDA1wrapper">
                                <span class="directions">Directions:</span>
                                <ol>
                                    <li>Please select a 2014 ONC S&CC objective or "NonSpecific C-CDA" from the drop down
                                        list.
                                    </li>
                                    <li>Upload the C-CDA file generated by your system to validate against the criteria
                                        selected in step 1.
                                    </li>
                                    <li>Click "Validate Document".</li>
                                </ol>

                                <form id="CCDA1ValidationForm" action="${urlAction1_1}" method="POST"
                                      relay="<%= smartCCDAAction %>" enctype="multipart/form-data">

                                    <div id="ccda_type_radioboxgroup" class="btn-group-vertical">
                                        <label for="CCDA1_type_val">Select a C-CDA Document Type or 2014 ONC S&CC
                                            Objective:</label><br/>
                                        <site:ccdaTypesSelector id="CCDA1_type_val" name="CCDA1_type_val"
                                                                styleClass="form-control" tabIndex="1"/>
                                    </div>
                                    <br/><br/>
                                    <noscript><input type="hidden" name="redirect" value="true"/></noscript>
                                    <div id="ccdauploaderrorlock" style="position: relative;">
                                        <div class="row">
                                            <div class="col-md-12 form-group">
                                                <label for="CCDA1fileupload">Upload C-CDA file to Validate:</label><br/>
											<span class="btn btn-success fileinput-button" id="CCDA1fileupload-btn"> <i
                                                    class="glyphicon glyphicon-plus"></i>&nbsp;<span>Upload a C-CDA File...</span>
													<input id="CCDA1fileupload" type="file" name="file"
                                                           data-parsley-maxsize="3" data-parsley-filetype="xml"
                                                           data-parsley-required data-parsley-trigger="change"
                                                           data-parsley-required-message="Please select a C-CDA file."
                                                           tabindex="1"/>
											</span>

                                                <div id="CCDA1files"></div>
                                                <div id="CCDA1InfoArea" class="infoArea alert-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <!--<button id="CCDA1formSubmit" type="submit" class="btn btn-primary start" onclick="return false;"  tabindex="1">
                                                    <i class="glyphicon glyphicon-ok"></i> <span>Validate Document</span>
                                                </button>-->

                                    <button id="CCDA1formSubmit" type="submit" class="btn btn-primary start"
                                            tabindex="1">
                                        <i class="glyphicon glyphicon-ok"></i> <span>Validate Document</span>
                                    </button>

                                </form>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        <a data-toggle="collapse" data-parent="#CCDAAccordion" href="#collapseCCDA2_0Validator"
                           tabindex="1">
                            C-CDA R2.1 / ONC 2015 S&CC Validator

                        </a>
                    </h3>
                </div>
                <div id="collapseCCDA2_0Validator" class="panel-collapse collapse">
                    <div class="panel-body">

                        <div id="CCDAReference">

                            <div id="CCDAReferenceWrapper">
                                <span class="directions">Directions:</span>
                                <p>In order to validate the C-CDA documents, follow steps 1 through 5.</p>

                                <form id="CCDAR2_0ValidationForm" action="${urlAction2_0}" method="POST"
                                      relay="<%= smartCCDAAction %>" enctype="multipart/form-data">

                                    <ol>
                                        <li>Select whether your system is a Sender of C-CDA's or Receiver of C-CDA's.
                                            <div class="clearfix">
                                                <div id="messagetype" class="btn-group" role="group" aria-label="...">
                                                    <button type="button" class="btn btn-default active" value="sender">Sender</button>
                                                    <button type="button" class="btn btn-default" value="receiver">Receiver</button>
                                                </div>
                                            </div>
                                            <br/>
                                            <br/>
                                        </li>
                                        <li>Select ONC 2015 Edition S&CC objective or other C-CDA IG conformance criteria from the list below.
                                            <div class="form-group">
                                                <select id="CCDAR2_0_type_val" name="CCDAR2_0_type_val"
                                                        class="form-control" tabindex="1"  data-parsley-trigger="change" data-parsley-required
                                                        data-parsley-required-message="Document Type / 2015 ONC S&CC Objective is required.">
                                                </select>
                                                <div id="CCDAR2_0_type_valInfoArea" class="infoArea"></div>
                                            </div>
                                            <br/>
                                            <br/>
                                        </li>
                                        <li>Select the scenario file that you used to generate the C-CDA, if you are testing a C-CDA generated without using any of the scenario files in the drop down, select "No scenario File".
                                            <noscript><input type="hidden" name="redirect" value="true"/></noscript>
                                            <div class="form-group">
                                                <select id="CCDAR2_refdocsfordocumenttype" name="CCDAR2_refdocsfordocumenttype"
                                                        class="form-control" tabindex="1"  data-parsley-trigger="change" data-parsley-required
                                                        data-parsley-required-message="Scenario file selection is required.">
                                                </select>
                                                <a href="#" id="scenariofiledownload" title="View and download the selected file to use for generating a C-CDA." class="pull-right">Get this file to be used as input for generating a C-CDA. <img src="<%=request.getContextPath()%>/images/GitHub-Mark-32px.png" style="max-height: 15px; max-width: 15px;"/></a>
                                                <div id="CCDAR2_refdocsfordocumenttypeInfoArea" class="infoArea"></div>
                                                <br/>
                                                <br/>
                                            </div>
                                        </li>
                                        <li>Upload generated C-CDA file to validate.

                                            <div id="CCDAR2_0Uploaderrorlock" style="position: relative;">

                                                <div class="row">
                                                    <div class="col-md-12 form-group">
													<span class="btn btn-success fileinput-button"
                                                          id="CCDAR2_0Fileupload-btn"> <i
                                                            class="glyphicon glyphicon-plus"></i>&nbsp;<span>Upload a C-CDA File...</span>
															<input id="CCDAR2_0Fileupload" type="file" name="file"
                                                                   data-parsley-r2maxsize="3"
                                                                   data-parsley-filetype="xml"
                                                                   data-parsley-trigger="change" data-parsley-required
                                                                   data-parsley-required-message="Please select a C-CDA file."
                                                                   tabindex="1"/>
															
													</span>

                                                        <div id="CCDAR2_0Files"></div>
                                                        <div id="CCDAR2_0InfoArea" class="infoArea"></div>

                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>Validate.
                                            <div>
                                                <button id="CCDAR2_0FormSubmit" type="submit"
                                                        class="btn btn-primary start" tabindex="1">
                                                    <i class="glyphicon glyphicon-ok"></i>
                                                    <span>Validate Document</span>
                                                </button>
                                            </div>
                                        </li>
                                    </ol>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--<div class="panel panel-default">
<div class="panel-heading"><h2 class="panel-title">Downloads</h2></div>
<div class="panel-body">
<div class="col-sm-12 btn-group-vertical" style="width:100%">
<a class="btn btn-default" href="http://www.hl7.org/documentcenter/private/standards/cda/CDAR2_IG_IHE_CONSOL_DSTU_R1dot1_2012JUL.zip" style="width: 100%;" target="_blank" tabindex="1">Download the latest HL7 C-CDA IG</a>
<a class="btn btn-default" href="http://wiki.siframework.org/Companion+Guide+to+Consolidated+CDA+for+MU2" style="width: 100%;" target="_blank" tabindex="1">S&amp;I Framework C-CDA Companion Guide for MU2</a>
<a class="btn btn-default" href="http://ttt.transport-testing.org/ttt" style="width: 100%;" target="_blank" tabindex="1">NIST C-CDA Validator</a>
<a class="btn btn-default" href="http://ccda-scorecard.smartplatforms.org/static/ccdaScorecard/#/" style="width: 100%; margin-bottom: 3px;" target="_blank" tabindex="1">SMART C-CDA Scorecard</a>
</div>
</div>
</div>
-->
<script type="text/javascript">
    var urlCCDA1_1 = '${urlAction1_1}';
    var urlCCDA2_0 = '${urlAction2_0}';
    var urlCCDAReconciled = '${urlActionReconciled}';
    var urlCCDAReference = '${urlActionReference}';
    var urlCCDASuper = '${urlActionSuper}';
</script>


<div class="modal modal-wide fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="resultModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <ul class="nav nav-tabs" id="resultModalTabs">
                    <li><a href="#tabs-1" data-toggle="tab">Validation Result</a></li>
                    <li><a href="#tabs-2" data-toggle="tab">Original C-CDA</a></li>
                    <li><a href="#tabs-3" data-toggle="tab">Smart C-CDA Result</a></li>
                </ul>
            </div>
            <div class="modal-body">
                <div id="ValidationResult">
                    <div class="tab-content" id="resultTabContent">
                        <div class="tab-pane" id="tabs-1"></div>
                        <div class="tab-pane" id="tabs-2"></div>
                        <div class="tab-pane" id="tabs-3"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="smartCCDAValidationBtn">Smart C-CDA Validation
                </button>
                <button type="button" class="btn btn-primary" id="saveResultsBtn">Save Results</button>
                <button type="button" class="btn btn-default" id="closeResultsBtn" data-dismiss="modal">Close Results
                </button>
            </div>
        </div>
    </div>
</div>

<div id="reportSaveAsQuestion" style="display: none; cursor: default">

    <form id="downloadtest" action="<%= downloadCCDAAction %>"
          method="POST">

        <label for="reportContent">Hidden field to store the report content for print or save.</label>
					<textarea id="reportContent" name="reportContent"
                              style="display: none;">
      				</textarea>
        <br>

    </form>
</div>

<portlet:renderURL var="viewCaseURL">
    <portlet:param name="jspPage" value="/view2.jsp"/>
</portlet:renderURL>
