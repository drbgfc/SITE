package org.sitenv.services.ccda.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Level;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.services.ccda.enums.CcdaValidationCategories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

public abstract class BaseCCDAValidationService implements ValidationService {
	private final Logger logger = LogManager.getLogger(BaseCCDAValidationService.class.getName());
	private static final String NO_DATA_FOUND = "no_data_found";
	protected String validatorId;
	@Autowired
	private StatisticsManager statisticsManager;

	private static final Map<String, String> typeOfCCDAValueMap;

	static {
		typeOfCCDAValueMap = Collections.unmodifiableMap(buildServiceValidatorTypeLookupMap());
	}

	private static Map<String, String> buildServiceValidatorTypeLookupMap() {
		Map<String, String> tpMap = new HashMap<String, String>();
		tpMap.put("ClinicalOfficeVisitSummary", "ClinicalOfficeVisitSummary");
		tpMap.put("TransitionsOfCareAmbulatorySummaryb2", "TransitionsOfCareAmbulatorySummary");
		tpMap.put("TransitionsOfCareAmbulatorySummaryb7", "TransitionsOfCareAmbulatorySummary");
		tpMap.put("TransitionsOfCareAmbulatorySummaryb1", "TransitionsOfCareAmbulatorySummary");
		tpMap.put("TransitionsOfCareAmbulatorySummary", "TransitionsOfCareAmbulatorySummary");
		tpMap.put("TransitionsOfCareInpatientSummaryb2", "TransitionsOfCareInpatientSummary");
		tpMap.put("TransitionsOfCareInpatientSummaryb7", "TransitionsOfCareInpatientSummary");
		tpMap.put("TransitionsOfCareInpatientSummaryb1", "TransitionsOfCareInpatientSummary");
		tpMap.put("TransitionsOfCareInpatientSummary", "TransitionsOfCareInpatientSummary");
		tpMap.put("VDTAmbulatorySummary", "VDTAmbulatorySummary");
		tpMap.put("VDTInpatientSummary", "VDTInpatientSummary");
		tpMap.put("NonSpecificCCDA", "NonSpecificCCDA");
		tpMap.put("NonSpecificCCDAR2", "NonSpecificCCDAR2");
		return tpMap;
	}

	@Override
	public JSONObject callValidationService(MultipartFile ccdaFileToValidate, String ccdaDocumentType, Object... validationParams) {
		JSONObject json = new JSONObject();
		try {
			if (typeOfCCDAValueMap.containsKey(ccdaDocumentType)) {
				ccdaDocumentType = typeOfCCDAValueMap.get(ccdaDocumentType);
			}
			HttpClient client = new DefaultHttpClient();
			HttpPost post = setupHttpPost(ccdaFileToValidate, ccdaDocumentType, validationParams);
			HttpResponse relayResponse = client.execute(post);
			json = handleCCDAValidationResponse(relayResponse);
		} catch (IOException | JSONException e) {
			try {
				json.put("error", "callValidationService caught the following exception: " + e.getMessage());
			} catch (JSONException e1) {
				throw new RuntimeException("Error creating JSON response in " + this.getClass().getName() + " with error: "
						+ e.getMessage());
			}
		}
		return json;
	}

	private HttpPost setupHttpPost(MultipartFile ccdaFileToValidate, String ccdaDocumentType, Object[] validationParams)
			throws IOException, UnsupportedEncodingException {
		HttpPost post = new HttpPost(getServiceLocation());

		MultipartEntity entity = new MultipartEntity();
		entity.addPart("file", new InputStreamBody(ccdaFileToValidate.getInputStream(), ccdaFileToValidate.getName()));
		entity.addPart("ccda_type", new StringBody(ccdaDocumentType == null ? "" : ccdaDocumentType));
		entity.addPart("return_json_param", new StringBody("true"));
		entity.addPart("debug_mode", new StringBody("true"));
		if (validationParams.length > 0) {
			for (Object param : validationParams) {
				if (param instanceof String) {
					entity.addPart("referenceFile", new StringBody((String) param));
				}
			}
		}
		post.setEntity(entity);
		return post;
	}

	protected JSONObject handleCCDAValidationResponse(HttpResponse relayResponse) throws JSONException, ClientProtocolException,
			IOException {
		ResponseHandler<String> handler = new BasicResponseHandler();
		int code = relayResponse.getStatusLine().getStatusCode();
		JSONObject jsonbody = null;

		if (code != HttpStatus.SC_OK) {
			jsonbody = handleBadServiceResponse(relayResponse, code);
		} else {
			jsonbody = handleServiceResponse(relayResponse, handler);
		}
		return jsonbody;
	}

	protected JSONObject handleBadServiceResponse(HttpResponse relayResponse, int code) throws JSONException {
		logHttpError(relayResponse, code);
		return createJsonResponseForHttpError(relayResponse, code);
	}

	private void logHttpError(HttpResponse relayResponse, int code) {
		logger.log(Level.ERROR, "Error while accessing CCDA service: " + code + ": "
				+ relayResponse.getStatusLine().getReasonPhrase());
	}

	private JSONObject createJsonResponseForHttpError(HttpResponse relayResponse, int code) throws JSONException {
		JSONObject jsonbody = new JSONObject();
		jsonbody.put("error", " Error while accessing CCDA service -" + code + "-"
				+ relayResponse.getStatusLine().getReasonPhrase());
		return jsonbody;
	}

	private JSONObject handleServiceResponse(HttpResponse relayResponse, ResponseHandler<String> handler)
			throws ClientProtocolException, IOException, JSONException {
		JSONObject jsonbody = new JSONObject();
		String body = handler.handleResponse(relayResponse);
		Document doc = Jsoup.parseBodyFragment(body);
		org.jsoup.nodes.Element json = doc.select("pre").first();

		if (json == null) {
			if (relayResponse.getHeaders("error_message").length > 0) {
				org.apache.http.Header[] errorHeaders = relayResponse.getHeaders("error_message");
				jsonbody.put("error", errorHeaders);
			} else {
				jsonbody.put("error",
						"The web service has encountered an unknown error. Please try again. If this issue persists, please contact the SITE team.");
			}
		} else {
			jsonbody = new JSONObject(json.text());
			handleReturnedValidationResultsForValidationCategory(jsonbody, CcdaValidationCategories.ERRORS);
			handleReturnedValidationResultsForValidationCategory(jsonbody, CcdaValidationCategories.WARNINGS);
			handleReturnedValidationResultsForValidationCategory(jsonbody, CcdaValidationCategories.INFO);
			addPerformance(relayResponse, jsonbody);
		}
		return jsonbody;
	}

	private void handleReturnedValidationResultsForValidationCategory(JSONObject jsonbody, CcdaValidationCategories category)
			throws JSONException {
		String validationCategory = category.getValidationCategory();
		if (jsonbody.has(validationCategory)) {
			JSONArray result = jsonbody.getJSONArray(validationCategory);
			if (result.length() > 0) {
				JSONObject firstElement = result.getJSONObject(0);
				if (firstElement.has("message")) {
					String message = firstElement.getString("message");
					if (message.equals(NO_DATA_FOUND)) {
						jsonbody.remove(validationCategory);
						jsonbody.put(validationCategory, new ArrayList<Object>());
					}
				}
			}

		}
	}

	private void addPerformance(HttpResponse relayResponse, JSONObject jsonbody) throws JSONException {
		org.apache.http.Header[] timeAndDateHeaders = relayResponse.getHeaders("response_time_and_date");
		String timeAndDate = "";

		if (timeAndDateHeaders.length > 0) {
			org.apache.http.Header timeAndDateHeader = timeAndDateHeaders[0];
			timeAndDate = timeAndDateHeader.getValue();
		}

		org.apache.http.Header[] processingTimeHeaders = relayResponse.getHeaders("round_trip_response_time");
		String processingTime = "";

		if (timeAndDateHeaders.length > 0) {
			org.apache.http.Header processingTimeHeader = processingTimeHeaders[0];
			processingTime = processingTimeHeader.getValue();
		}

		JSONObject performance_object = new JSONObject().put("dateTimeOfRequest", timeAndDate);
		performance_object.put("processingTime", processingTime);
		jsonbody.put("performance", performance_object);
	}

	protected abstract String getServiceLocation();

	protected abstract void setValidatorId(String validatorId);

}
