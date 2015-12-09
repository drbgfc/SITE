package org.sitenv.portlets.dcdt.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.portlet.ActionResponse;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.bind.annotation.ResourceMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

@Controller
@RequestMapping("VIEW")
public class DCDTEmailMappingController extends BaseController {

	public static final String DCDT_EMAIL_MAPPING_URL = "http://demo31.direct-test.com/dcdt-web/discovery/mail/mapping/add";
	
	@Autowired
	private StatisticsManager statisticsManager;
	
	@ActionMapping(params = "javax.portlet.action=DCDTEmailMapping")
	public void response(MultipartActionRequest request, ActionResponse response)  {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("view");
	}
	
	@ResourceMapping(value="queryDcdtEmailMapping")
	@ResponseBody
	public void queryDcdtEmailMapping(ResourceRequest request, ResourceResponse response) throws PortalException, SystemException, IOException, ClientProtocolException, RuntimeException
	{
		/*
		 * 	Make a HTTP post request to obtain the email mapping information.
		 */
		String line;
		StringBuilder output;
		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpPost postRequest = new HttpPost(DCDT_EMAIL_MAPPING_URL);
		
		/*
		 * 	Obtain the original JSON response in the payload.
		 */
		output = new StringBuilder();
		BufferedReader bufferedRequest = request.getReader();
		while ((line = bufferedRequest.readLine()) != null) 
		{
			output.append(line);
		}
		StringEntity input = new StringEntity(output.toString());		
		input.setContentType("application/json");
		postRequest.setEntity(input);
		postRequest.addHeader("accept", "application/json");
		HttpResponse httpResponse = httpClient.execute(postRequest);
		if (httpResponse.getStatusLine().getStatusCode() != 200) 
		{
			throw new RuntimeException("Failed : HTTP error code : " + httpResponse.getStatusLine().getStatusCode());
		}
		
		/*
		 * 	Pass back the response from DCDT to the calling script.
		 */
		BufferedReader br = new BufferedReader(new InputStreamReader((httpResponse.getEntity().getContent())));
		output = new StringBuilder();
		while ((line = br.readLine()) != null) 
		{
			output.append(line);
		}
		httpClient.getConnectionManager().shutdown();	
		JSONObject json = JSONFactoryUtil.createJSONObject(output.toString());
		response.getWriter().write(json.toString());
	}

	/*
	 * 	GET/SET
	 */
	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
	
}
