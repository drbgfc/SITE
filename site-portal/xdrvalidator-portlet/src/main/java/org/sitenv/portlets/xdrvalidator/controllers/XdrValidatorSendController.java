package org.sitenv.portlets.xdrvalidator.controllers;

import com.jcraft.jsch.*;
import org.apache.log4j.Logger;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.sitenv.portlets.xdrvalidator.models.XdrSendGetRequestResults;
import org.sitenv.portlets.xdrvalidator.models.XdrSendRequestListResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.w3c.dom.Document;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.*;

@Controller
@RequestMapping("VIEW")
public class XdrValidatorSendController extends BaseController {
	private static Logger logger = Logger.getLogger(XdrValidatorSendController.class);
	@Autowired
	private XdrSendGetRequestResults xdrSendGetRequestResults;
	@Autowired
	private XdrSendRequestListResults xdrSendRequestListResults;
	@Autowired
	private StatisticsManager statisticsManager;

	@ActionMapping(params = "javax.portlet.action=xdrSendGetRequestList")
	public void xdrSendGetRequestList(ActionRequest request, ActionResponse response) throws IOException {
		String lookupCode = null;
		List<String> requestTimestamps = null;
		if (this.props == null) {
			this.loadProperties();
		}
		
		// handle the files:
		response.setRenderParameter("javax.portlet.action", "xdrSendGetRequestList");
		String requestListGrouping = request.getParameter("requestListGrouping");

		try {
				lookupCode = requestListGrouping;
				// handle the data
				requestTimestamps = this.getRequestList(requestListGrouping);
		} catch (Exception e) {
			//statisticsManager.addCcdaValidation(ccda_type_value, false, false, false, true);
			throw new RuntimeException(e);
		}
		xdrSendRequestListResults.setLookupCode(lookupCode);
		xdrSendRequestListResults.setRequestTimestamps(requestTimestamps);
	}
	
	@RequestMapping(params = "javax.portlet.action=xdrSendGetRequestList")
	public ModelAndView xdrSendGetRequestList(RenderRequest request, Model model)
			throws IOException {
		Map map = new HashMap();
		map.put("lookupCode", xdrSendRequestListResults.getLookupCode());
		map.put("requestTimestamps", xdrSendRequestListResults.getRequestTimestamps());
		return new ModelAndView("xdrSendRequestListJsonView", map);
	}
	
	@ActionMapping(params = "javax.portlet.action=xdrSendGetRequest")
	public void xdrSendGetRequest(ActionRequest request, ActionResponse response) throws IOException {
		if (this.props == null) {
			this.loadProperties();
		}
		// handle the files:
		response.setRenderParameter("javax.portlet.action", "xdrSendGetRequest");
		String lookupCode = request.getParameter("lookup");
		String timestamp = request.getParameter("timestamp");
		String xmlRequest = null;
		String xmlResponse = null;
		try {
				xmlRequest = this.getFile(lookupCode, timestamp,"Request");
		} catch (Exception e) {
			//statisticsManager.addCcdaValidation(ccda_type_value, false, false, false, true);
			throw new RuntimeException(e);
		} 
		
		try {
			xmlResponse = this.getFile(lookupCode, timestamp,"Response");
			if (xmlResponse != null) {
				Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new ByteArrayInputStream(xmlResponse.getBytes()));
				ByteArrayOutputStream outSrc = new ByteArrayOutputStream();
		        
		        //creating a transformer
		        TransformerFactory transFactory = TransformerFactory.newInstance();
		        Transformer transformer  = transFactory.newTransformer();
		        transformer.setOutputProperty(OutputKeys.ENCODING, "utf-8");
		        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
		        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "5");
		        transformer.transform(new DOMSource(doc), new StreamResult(outSrc));
		        
		        xmlResponse = outSrc.toString("UTF-8");
			}
		} catch (Exception e) {
			logger.error(e);
		}
		xdrSendGetRequestResults.setLookupCode(lookupCode);
		xdrSendGetRequestResults.setTimestamp(timestamp);
		xdrSendGetRequestResults.setRequestContent(xmlRequest);
		xdrSendGetRequestResults.setResponseContent(xmlResponse);
	}
	
	@RequestMapping(params = "javax.portlet.action=xdrSendGetRequest")
	public ModelAndView xdrSendGetRequest(RenderRequest request, Model model)
			throws IOException {
		Map map = new HashMap();
		map.put("lookupCode", xdrSendGetRequestResults.getLookupCode());
		map.put("timestamp", xdrSendGetRequestResults.getTimestamp());
		map.put("requestContent", xdrSendGetRequestResults.getRequestContent());
		map.put("responseContent", xdrSendGetRequestResults.getResponseContent());
		return new ModelAndView("xdrSendGetRequestJsonView", map);
	}
	
	private List<String> getRequestList(String requestLookup) {
		JSch jsch = new JSch();
		Session     session     = null;
        Channel     channel     = null;
        ChannelSftp channelSftp = null;
        List<String> fileNames = null;
        String requestDir = null;
        
        if (requestLookup.contains("@")) {
        	String[] split = requestLookup.toUpperCase().split("@");
        	requestDir = split[1] + "/" + split[0];
        } else {
        	requestDir = requestLookup.toUpperCase();
        }
		
		try {
			jsch.addIdentity(new File(props.getProperty("xdrvalidator.service.sftpkey")).getAbsolutePath());
			session = jsch.getSession(props.getProperty("xdrvalidator.service.sftpusername"), props.getProperty("xdrvalidator.service.sftpserver"), 22);

			java.util.Properties config = new java.util.Properties(); 
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect();
			channel = session.openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp)channel;
            channelSftp.cd(props.getProperty("xdrvalidator.service.sftpremotedir") + "/"  + requestDir);
            
            Vector fileList = channelSftp.ls(props.getProperty("xdrvalidator.service.sftpremotedir") + "/" +  requestDir + "/Request*");
            for(int i=0; i<fileList.size();i++){
            	String fileLsData = fileList.get(i).toString();
                String[] ary = fileLsData.split(" ");
                String fileName = ary[ary.length-1];
                if (fileNames == null) {
                	fileNames = new ArrayList<String>();
                }
                String withoutDots = fileName.replace(".", "");
                if (withoutDots.length() > 0) {
                	fileNames.add(fileName.replace("Request_", "").replace(".xml", ""));
                }
            }
			statisticsManager.addXdrSendSearch(requestLookup.toUpperCase(), false);
		} catch (JSchException e) {
			logger.error(e);
			statisticsManager.addXdrSendSearch(requestLookup.toUpperCase(), true);
		} catch (SftpException e) {
			logger.error(e);
			statisticsManager.addXdrSendSearch(requestLookup.toUpperCase(), true);
		} finally {
			if (channelSftp != null)
				channelSftp.disconnect();
	        if (channel != null)
	        	channel.disconnect();
	        if (session != null)
	        	session.disconnect();
		}
		if (fileNames != null) {
			Collections.sort(fileNames, Collections.reverseOrder());
			
			fileNames = new ArrayList<String>(fileNames.subList(0, (fileNames.size() < 10) ? fileNames.size() : 10 ));
        }
		return fileNames;
	}
	
	private String getFile(String requestLookup, String formattedTimestamp, String filePrefix) throws IOException {
		JSch jsch = new JSch();
		Session session = null;
        Channel channel = null;
        ChannelSftp channelSftp = null;
        StringBuilder strFileContents = null;
        String requestDir = null;
        
        if (requestLookup.contains("@")) {
        	String[] split = requestLookup.toUpperCase().split("@");
        	requestDir = split[1] + "/" + split[0];
        } else {
        	requestDir = requestLookup.toUpperCase();
        }
        
		try {
			jsch.addIdentity(new File(props.getProperty("xdrvalidator.service.sftpkey")).getAbsolutePath());
			session = jsch.getSession(props.getProperty("xdrvalidator.service.sftpusername"), props.getProperty("xdrvalidator.service.sftpserver"), 22);

			java.util.Properties config = new java.util.Properties(); 
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect();
			channel = session.openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp)channel;
            BufferedInputStream bis = new BufferedInputStream(channelSftp.get(props.getProperty("xdrvalidator.service.sftpremotedir") + "/" + requestDir + "/" + filePrefix + "_" + formattedTimestamp + ".xml"));
            
            byte[] contents = new byte[1024];
            int bytesRead=0;
            strFileContents = new StringBuilder(); 
            while( (bytesRead = bis.read(contents)) != -1){ 
               strFileContents.append(new String(contents, 0, bytesRead));               
            }
			
		} catch (JSchException e) {
			logger.error(e);
		} catch (SftpException e) {
			logger.error(e);
		} finally {
			if (channelSftp != null)
				channelSftp.disconnect();
	        if (channel != null)
	        	channel.disconnect();
	        if (session != null)
	        	session.disconnect();
		}
		
		if (strFileContents != null)
			return strFileContents.toString();
		else
			return null;
	}

	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
	
	
	

}
