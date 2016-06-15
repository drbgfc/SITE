package org.sitenv.portlets.xdrvalidator.controllers;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.sitenv.common.xdrsender.XDR;
import org.sitenv.portlets.xdrvalidator.models.XdrReceiveResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.bind.annotation.RenderMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping("VIEW")
public class XdrValidationController extends BaseController {
	private static Logger logger = Logger.getLogger(XdrValidationController.class);
	@Autowired
	private XdrReceiveResults xdrReceiveResults;
	@Autowired
	private StatisticsManager statisticsManager;

	@ActionMapping(params = "javax.portlet.action=uploadXDR")
	public void response(MultipartActionRequest request, ActionResponse response) throws IOException {
		JSONArray fileJson;
		JSONObject jsonResponseBody;
		
		if (this.props == null) {
			this.loadProperties();
		}
		// handle the files:
		response.setRenderParameter("javax.portlet.action", "uploadXDR");
		MultipartFile file = request.getFile("file");
		String endpoint = request.getParameter("wsdlLocation");
		String fromDirectAddress = request.getParameter("fromDirectAddress");
		
		if (fromDirectAddress == null || fromDirectAddress.trim().equals("")) {
			fromDirectAddress = "admin@sitenv.org";
		}
		
		String toDirectAddress  = request.getParameter("toDirectAddress");

		if (toDirectAddress == null || toDirectAddress.trim().equals("")) {
			toDirectAddress = "admin@sitenv.org";
		}
		
		String messageType = request.getParameter("messageType");
		String encodedFile = Base64.encodeBase64String(file.getBytes());
		
		fileJson = new JSONArray();
		jsonResponseBody = new JSONObject();
		String xdrResponse = null;
		
		if (messageType.equalsIgnoreCase("full")) {
			xdrResponse = XDR.sendValidFullXDRMessage(endpoint, encodedFile, file.getName(), toDirectAddress, fromDirectAddress, endpoint);
		} else {
			xdrResponse = XDR.sendValidMinimalXDRMessage(endpoint, encodedFile, file.getName(), toDirectAddress, fromDirectAddress, endpoint);
		}
		logger.info(xdrResponse);
		try {
				JSONObject jsono = new JSONObject();
				jsono.put("name", file.getOriginalFilename());
				jsono.put("size", file.getSize());
				fileJson.put(jsono);
				// handle the data
				jsonResponseBody.put("IsSuccess", "true");
				jsonResponseBody.put("ErrorMessage", "Message Sent Successfully!");
				jsonResponseBody.put("xdrResponse", xdrResponse);
				statisticsManager.addXdrReceive(endpoint, fromDirectAddress, toDirectAddress, messageType, false, true, false);

		} catch (Exception e) {
			//statisticsManager.addCcdaValidation(ccda_type_value, false, false, false, true);
			statisticsManager.addXdrReceive(endpoint, fromDirectAddress, toDirectAddress, messageType, false, false, true);
			throw new RuntimeException(e);
		}
		xdrReceiveResults.setFileJson(fileJson);
		xdrReceiveResults.setJsonResponseBody(jsonResponseBody);
	}
	
	@ActionMapping(params = "javax.portlet.action=precannedXDR")
	public void responsePrecanned(ActionRequest request, ActionResponse response) throws IOException {
		JSONArray fileJson;
		JSONObject jsonResponseBody;
		
		if (this.props == null) {
			this.loadProperties();
		}
		// handle the files:
		response.setRenderParameter("javax.portlet.action", "precannedXDR");
		String endpoint = request.getParameter("precannedWsdlLocation");

		String fromDirectAddress = request.getParameter("precannedFromDirectAddress");
		if (fromDirectAddress == null || fromDirectAddress.trim().equals("")) {
			fromDirectAddress = "admin@sitenv.org";
		}

		String toDirectAddress  = request.getParameter("precannedToDirectAddress");
		if (toDirectAddress == null || toDirectAddress.trim().equals("")) {
			toDirectAddress = "admin@sitenv.org";
		}
		
		String sampleCcdaDir = props.getProperty("sampleCcdaDir");
		String precannedfile = request.getParameter("precannedfilepath");
		String precannedMessageType = request.getParameter("precannedMessageType");
		
		String serverFilePath = sampleCcdaDir + "/" + precannedfile;
		File ccdaFile = new File(serverFilePath);
		String fileContents = FileUtils.readFileToString(ccdaFile);
		byte[] byteArray = this.read(ccdaFile);
		//String base64String = Base64.encodeBase64String(byteArray);
		fileJson = new JSONArray();
		jsonResponseBody = new JSONObject();
		String xdrResponse = null;
		
		if (precannedMessageType.equalsIgnoreCase("full")) {
			xdrResponse = XDR.sendValidFullXDRMessage(endpoint, fileContents, ccdaFile.getName(), toDirectAddress, fromDirectAddress, endpoint);
		} else {
			xdrResponse = XDR.sendValidMinimalXDRMessage(endpoint, fileContents, ccdaFile.getName(), toDirectAddress, fromDirectAddress, endpoint);
		}
		logger.info(xdrResponse);

		try {
				JSONObject jsono = new JSONObject();
				//jsono.put("name", file.getOriginalFilename());
				//jsono.put("size", file.getSize());
				
				fileJson.put(jsono);
				// handle the data
				jsonResponseBody.put("IsSuccess", "true");
				jsonResponseBody.put("ErrorMessage", "Message Sent Successfully!");
				jsonResponseBody.put("xdrResponse", xdrResponse);
				statisticsManager.addXdrReceive(endpoint, fromDirectAddress, toDirectAddress, precannedMessageType, true, false, false);
		} catch (Exception e) {
			//statisticsManager.addCcdaValidation(ccda_type_value, false, false, false, true);
			statisticsManager.addXdrReceive(endpoint, fromDirectAddress, toDirectAddress, precannedMessageType, false, false, true);
			throw new RuntimeException(e);
		}
		xdrReceiveResults.setFileJson(fileJson);
		xdrReceiveResults.setJsonResponseBody(jsonResponseBody);
	}

	@RequestMapping(params = "javax.portlet.action=uploadXDR")
	public ModelAndView process(RenderRequest request, Model model) throws IOException {
		Map map = new HashMap();
		map.put("files", xdrReceiveResults.getFileJson());
		map.put("result", xdrReceiveResults.getJsonResponseBody());
		return new ModelAndView("xdrValidatorJsonView", map);
	}
	
	@RequestMapping(params = "javax.portlet.action=precannedXDR")
	public ModelAndView processPrecanned(RenderRequest request, Model model)
			throws IOException {
		Map map = new HashMap();
		map.put("files", xdrReceiveResults.getFileJson());
		map.put("result", xdrReceiveResults.getJsonResponseBody());
		return new ModelAndView("xdrValidatorJsonView", map);
	}

	@RenderMapping()
	public ModelAndView handleRenderRequest(RenderRequest request, RenderResponse response) throws IOException {
		if (this.props == null) {
			this.loadProperties();
		}
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("view");
		modelAndView.addObject("xdrSoapEndpoint", props.get("xdrvalidator.service.endpoint"));
		return modelAndView;
	}
	
	public byte[] read(File file) throws IOException {
	    byte []buffer = new byte[(int) file.length()];
	    InputStream ios = null;
	    try {
	        ios = new FileInputStream(file);
	        if ( ios.read(buffer) == -1 ) {
	            throw new IOException("EOF reached while trying to read the whole file");
	        }        
	    } finally { 
	        try {
	             if ( ios != null ) 
	                  ios.close();
	        } catch ( IOException e) {
	        }
	    }

	    return buffer;
	}
}
