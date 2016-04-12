package org.sitenv.portlets.ccdavalidator;

import org.json.JSONArray;
import org.json.JSONObject;

public interface JSONResponse {

	public JSONArray getFileJson();

	public void setFileJson(JSONArray fileJson);

	public JSONObject getJSONResponseBody();

	public void setJSONResponseBody(JSONObject jSONResponseBody);

	public void setJSONValidationResults(JSONArray results);

	public JSONArray getJSONValidationResults();
}
