package org.sitenv.portlets.ccdavalidator;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("JSONResponseService")
@Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
public class JSONResponseImpl implements JSONResponse {

	private JSONArray fileJson;
	private JSONObject JSONResponseBody;
	private JSONArray JSONValidationResults;

	public JSONResponseImpl() {

	}

	public JSONArray getFileJson() {
		return fileJson;
	}

	public void setFileJson(JSONArray fileJson) {
		this.fileJson = fileJson;
	}

	public JSONObject getJSONResponseBody() {
		return JSONResponseBody;
	}

	public void setJSONResponseBody(JSONObject jSONResponseBody) {
		JSONResponseBody = jSONResponseBody;
	}

	public JSONArray getJSONValidationResults() {
		return JSONValidationResults;
	}

	public void setJSONValidationResults(JSONArray results) {
		JSONValidationResults = results;
	}

}
