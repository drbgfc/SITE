package org.sitenv.portlets.ccdavalidator.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.portlet.ActionResponse;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.sitenv.portlets.ccdavalidator.JSONResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.bind.annotation.RenderMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

@Controller
@RequestMapping("VIEW")
public class CCDAValidatorController extends BaseController {

	@Autowired
	private JSONResponse responseJSON;

	@Autowired
	private StatisticsManager statisticsManager;

	public JSONResponse getResponseJSON() {
		return responseJSON;
	}

	private Map<String, Object> getResultMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("files", responseJSON.getFileJson());
		map.put("body", responseJSON.getJSONResponseBody());
		return map;

	}

	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	@RenderMapping()
	public ModelAndView handleRenderRequest(RenderRequest request, RenderResponse response) throws IOException {

		if (props == null) {
			loadProperties();
		}

		ModelAndView modelAndView = new ModelAndView();

		modelAndView.setViewName("view");

		modelAndView.addObject("showVocabulary", props.getProperty("showVocabularyValidation"));
		modelAndView.addObject("showDataQualityValidation", props.getProperty("showDataQualityValidation"));
		return modelAndView;
	}

	@RequestMapping(params = "javax.portlet.action=uploadCCDA1.1")
	public ModelAndView processCCDA1_1(RenderRequest request, Model model) throws IOException {
		return new ModelAndView("cCDAValidatorJsonView", getResultMap());
	}

	@RequestMapping(params = "javax.portlet.action=uploadCCDA2.0")
	public ModelAndView processCCDA2_0(RenderRequest request, Model model) throws IOException {
		return new ModelAndView("cCDAValidatorJsonView", getResultMap());
	}

	@ActionMapping(params = "javax.portlet.action=uploadCCDA1.1")
	public void responseCCDA1_1(MultipartActionRequest request, ActionResponse response) throws IOException {

		String ccda_type = null;

		if (props == null) {
			loadProperties();
		}

		// handle the files:

		response.setRenderParameter("javax.portlet.action", "uploadCCDA1.1");
		MultipartFile file = request.getFile("file");

		responseJSON.setFileJson(new JSONArray());

		try {

			JSONObject jsono = new JSONObject();
			jsono.put("name", file.getOriginalFilename());
			jsono.put("size", file.getSize());

			responseJSON.getFileJson().put(jsono);

			ccda_type = request.getParameter("ccda_type_val") == null ? "" : request.getParameter("ccda_type_val");

			HttpClient client = new DefaultHttpClient();

			String ccdaURL = props.getProperty("CCDAValidationServiceURL");
			ccdaURL += "/r1.1/";

			HttpPost post = new HttpPost(ccdaURL);

			MultipartEntity entity = new MultipartEntity();
			// set the file content
			entity.addPart("file", new InputStreamBody(file.getInputStream(), file.getOriginalFilename()));

			// set the CCDA type
			entity.addPart("type_val", new StringBody(ccda_type));

			post.setEntity(entity);

			HttpResponse relayResponse = client.execute(post);

			// create the handler
			ResponseHandler<String> handler = new BasicResponseHandler();

			int code = relayResponse.getStatusLine().getStatusCode();

			if (code != HttpStatus.SC_OK) {
				// do the error handling.
				statisticsManager.addCcdaValidation(ccda_type, false, false, false, true, "r1.1");
			} else {
				boolean ccdaHasErrors = true, ccdaHasWarnings = true, ccdaHasInfo = true;
				boolean extendedCcdaHasErrors = true, extendedCcdaHasWarnings = true, extendedCcdaHasInfo = true;

				String json = handler.handleResponse(relayResponse);
				JSONObject jsonbody = new JSONObject(json);

				if (jsonbody.getJSONObject("ccdaResults").has("error")
						|| jsonbody.getJSONObject("ccdaExtendedResults").has("error")) {
					// TODO: Make sure the UI handles this gracefully.
					responseJSON.setJSONResponseBody(jsonbody);
					statisticsManager.addCcdaValidation(ccda_type, false, false, false, false, "r1.1");
				} else {
					JSONObject ccdaReport = jsonbody.getJSONObject("ccdaResults").getJSONObject("report");
					ccdaHasErrors = ccdaReport.getBoolean("hasErrors");
					ccdaHasWarnings = ccdaReport.getBoolean("hasWarnings");
					ccdaHasInfo = ccdaReport.getBoolean("hasInfo");

					JSONObject extendedCcdaReport = jsonbody.getJSONObject("ccdaExtendedResults").getJSONObject("report");
					extendedCcdaHasErrors = extendedCcdaReport.getBoolean("hasErrors");
					extendedCcdaHasWarnings = extendedCcdaReport.getBoolean("hasWarnings");
					extendedCcdaHasInfo = extendedCcdaReport.getBoolean("hasInfo");

					boolean hasErrors = ccdaHasErrors || extendedCcdaHasErrors;
					boolean hasWarnings = ccdaHasWarnings || extendedCcdaHasWarnings;
					boolean hasInfo = ccdaHasInfo || extendedCcdaHasInfo;

					responseJSON.setJSONResponseBody(jsonbody);
					statisticsManager.addCcdaValidation(ccda_type, hasErrors, hasWarnings, hasInfo, false, "r1.1");
				}
			}

		} catch (JSONException e) {
			statisticsManager.addCcdaValidation(ccda_type, false, false, false, true, "r1.1");
			throw new RuntimeException(e);
		}

	}

	@ActionMapping(params = "javax.portlet.action=uploadCCDA2.0")
	public void responseCCDA2_0(MultipartActionRequest request, ActionResponse response) throws IOException {
		String CCDAR2_0_type_val = null;
		String referenceFileUsedPath = null;

		if (props == null) {
			loadProperties();
		}

		response.setRenderParameter("javax.portlet.action", "uploadCCDA2.0");
		MultipartFile file = request.getFile("file");
		responseJSON.setFileJson(new JSONArray());
		try {
			JSONObject jsono = new JSONObject();
			jsono.put("name", file.getOriginalFilename());
			jsono.put("size", file.getSize());

			responseJSON.getFileJson().put(jsono);

			CCDAR2_0_type_val = request.getParameter("CCDAR2_0_type_val") == null ? "" : request
					.getParameter("CCDAR2_0_type_val");

			referenceFileUsedPath = request.getParameter("referenceFileUsed") == null ? "" : request
					.getParameter("referenceFileUsed");

			HttpClient client = new DefaultHttpClient();
			String ccdaURL = props.getProperty("ReferenceCCDAValidationServiceURL");
			HttpPost post = new HttpPost(ccdaURL);
			MultipartEntity entity = new MultipartEntity();
			entity.addPart("ccdaFile", new InputStreamBody(file.getInputStream(), file.getOriginalFilename()));
			entity.addPart("validationObjective", new StringBody(CCDAR2_0_type_val));
			entity.addPart("referenceFileName", new StringBody(referenceFileUsedPath));
			post.setEntity(entity);

			HttpResponse relayResponse = client.execute(post);
			ResponseHandler<String> handler = new BasicResponseHandler();

			int code = relayResponse.getStatusLine().getStatusCode();
			if (code != HttpStatus.SC_OK) {
				statisticsManager.addCcdaValidation(CCDAR2_0_type_val, false, false, false, true, "r2.0");
				throw new RuntimeException("ERROR: " + code + " details: " + relayResponse.getStatusLine().getReasonPhrase());
			} else {
				String json = handler.handleResponse(relayResponse);
				JSONObject jsonbody = new JSONObject(json);

				responseJSON.setJSONResponseBody(jsonbody);
				statisticsManager.addCcdaValidation(CCDAR2_0_type_val, true, true, true, false, "r2.0");
			}

		} catch (JSONException e) {
			statisticsManager.addCcdaValidation(CCDAR2_0_type_val, false, false, false, true, "r2.0");
			throw new RuntimeException(e);
		}

	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
}
