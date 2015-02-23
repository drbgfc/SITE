package org.sitenv.portlets.xdrvalidator.controllers;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.crypto.Cipher;
import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.sitenv.common.utilities.controller.BaseController;
import org.sitenv.portlets.xdrvalidator.models.XdrSendGetRequestResults;
import org.sitenv.portlets.xdrvalidator.models.XdrSendRequestListResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

@Controller
@RequestMapping("VIEW")
public class XdrValidatorSendController extends BaseController {
	
	private static Logger logger = Logger.getLogger(XdrValidatorSendController.class);
	
	@Autowired
	private XdrSendGetRequestResults xdrSendGetRequestResults;
	
	@Autowired
	private XdrSendRequestListResults xdrSendRequestListResults;
	
	
	@ActionMapping(params = "javax.portlet.action=xdrSendGetRequestList")
	public void xdrSendGetRequestList(ActionRequest request, ActionResponse response) throws IOException {
		
		String lookupCode = null;
		List<String> requestTimestamps = null;
		
		if (this.props == null)
		{
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
		
		
		if (this.props == null)
		{
			this.loadProperties();
		}
		
		// handle the files:
		
		response.setRenderParameter("javax.portlet.action", "xdrSendGetRequest");
		String lookupCode = request.getParameter("lookup");
		String timestamp = request.getParameter("timestamp");
		String xmlRequest = null;
		
		try {

				xmlRequest = this.getRequestFile(lookupCode, timestamp);				

		} catch (Exception e) {
			//statisticsManager.addCcdaValidation(ccda_type_value, false, false, false, true);
			
			throw new RuntimeException(e);
		} 
		
		xdrSendGetRequestResults.setLookupCode(lookupCode);
		xdrSendGetRequestResults.setTimestamp(timestamp);
		xdrSendGetRequestResults.setRequestContent(xmlRequest);
		
	}
	
	@RequestMapping(params = "javax.portlet.action=xdrSendGetRequest")
	public ModelAndView xdrSendGetRequest(RenderRequest request, Model model)
			throws IOException {
		Map map = new HashMap();

		map.put("lookupCode", xdrSendGetRequestResults.getLookupCode());
		map.put("timestamp", xdrSendGetRequestResults.getTimestamp());
		map.put("requestContent", xdrSendGetRequestResults.getRequestContent());
		
		
		return new ModelAndView("xdrSendGetRequestJsonView", map);
	}
	
	private List<String> getRequestList(String requestLookup)
	{
		JSch jsch = new JSch();
		Session     session     = null;
        Channel     channel     = null;
        ChannelSftp channelSftp = null;
        List<String> fileNames = null;
        String requestDir = null;
        
        if (requestLookup.contains("@"))
        {
        	String[] split = requestLookup.toUpperCase().split("@");
        	requestDir = split[1] + "/" + split[0];
        }
        else {
        	requestDir = requestLookup.toUpperCase();
        }
		
		try
		{
			jsch.addIdentity(new File("/Users/chris/Desktop/xdrvalidator").getAbsolutePath());
			session = jsch.getSession("xdrvalidator", "devsoap.sitenv.org", 22);
			
			
			
			java.util.Properties config = new java.util.Properties(); 
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			
			session.connect();
			channel = session.openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp)channel;
            channelSftp.cd("/var/opt/sitenv/xdrvalidator/data/xdrvalidator/" + requestDir);
            
            Vector fileList = channelSftp.ls("/var/opt/sitenv/xdrvalidator/data/xdrvalidator/" + requestDir);
         
            
            
            for(int i=0; i<fileList.size();i++){
            	String fileLsData = fileList.get(i).toString();
                
                String[] ary = fileLsData.split(" ");
                
                String fileName = ary[ary.length-1];
                
                if (fileNames == null) {
                	fileNames = new ArrayList<String>();
                }
                
                String withoutDots = fileName.replace(".", "");
                if (withoutDots.length() > 0)
                {
                	fileNames.add(fileName.replace("Request_", "").replace(".xml", ""));
                }
            }
			
		} 
		catch (JSchException e) 
		{
			e.printStackTrace();
		}
		catch (SftpException e) 
		{
			e.printStackTrace();
		}
		finally
		{
	        channelSftp.disconnect();
	        channel.disconnect();
	        session.disconnect();
		}
		
		if (fileNames != null) {
			Collections.sort(fileNames, Collections.reverseOrder());
		}
		
		return fileNames;
	}
	
	private String getRequestFile(String requestLookup, String formattedTimestamp) throws IOException
	{
		JSch jsch = new JSch();
		Session session = null;
        Channel channel = null;
        ChannelSftp channelSftp = null;
        StringBuilder strFileContents = null;
        String requestDir = null;
        
        if (requestLookup.contains("@"))
        {
        	String[] split = requestLookup.toUpperCase().split("@");
        	requestDir = split[1] + "/" + split[0];
        }
        else {
        	requestDir = requestLookup.toUpperCase();
        }
        
		try
		{
			jsch.addIdentity(new File("/Users/chris/Desktop/xdrvalidator").getAbsolutePath());
			session = jsch.getSession("xdrvalidator", "devsoap.sitenv.org", 22);
			
			
			
			java.util.Properties config = new java.util.Properties(); 
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			
			session.connect();
			channel = session.openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp)channel;
            BufferedInputStream bis = new BufferedInputStream(channelSftp.get("/var/opt/sitenv/xdrvalidator/data/xdrvalidator/" + requestDir + "/Request_" + formattedTimestamp + ".xml"));
            
            byte[] contents = new byte[1024];

            int bytesRead=0;
            
            strFileContents = new StringBuilder(); 
            while( (bytesRead = bis.read(contents)) != -1){ 
               strFileContents.append(new String(contents, 0, bytesRead));               
            }
			
		} 
		catch (JSchException e) 
		{
			e.printStackTrace();
		}
		catch (SftpException e) 
		{
			e.printStackTrace();
		}
		finally
		{
	        channelSftp.disconnect();
	        channel.disconnect();
	        session.disconnect();
		}
		
		if (strFileContents != null)
			return strFileContents.toString();
		else
			return null;
	}
	
	public static void main(String[] args) throws IOException
	{
		XdrValidatorSendController controller = new XdrValidatorSendController();
		
		 int maxKeyLen;
		try {
			maxKeyLen = Cipher.getMaxAllowedKeyLength("AES");
			System.out.println(maxKeyLen);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		    
		
		List<String> fileNames = controller.getRequestList("129.6.24.81");
		for (String name : fileNames) 
		{
			System.out.println(name);
			String timestamp = name.replace("Request_", "").replace(".xml", "");
			System.out.println(controller.getRequestFile("129.6.24.81", timestamp));
		}
	}
}
