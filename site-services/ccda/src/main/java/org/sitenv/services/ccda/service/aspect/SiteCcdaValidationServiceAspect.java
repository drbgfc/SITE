package org.sitenv.services.ccda.service.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.json.JSONException;
import org.json.JSONObject;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;

@Configurable
@Component
@Aspect
public class SiteCcdaValidationServiceAspect {
	@Autowired
	private StatisticsManager statisticsManager;

	@AfterReturning(pointcut="execution(* org.sitenv.services.ccda.service.BaseCCDAValidationService.callValidationService(..))", returning = "returnValue")
	public void afterExecution(JoinPoint jp, Object returnValue) {
		String validationType = (String)jp.getArgs()[1];
		String ccdaValidatorImplementation = jp.getTarget().getClass().getSimpleName();
		JSONObject returnedJSONObject = (JSONObject)returnValue;

		if (returnedJSONObject == null || returnedJSONObject.has("error")){
			recordStatistics(validationType, false, false, false, true, ccdaValidatorImplementation);
		} else {
			try {
				JSONObject report = returnedJSONObject.getJSONObject("report");
				boolean hasErrors = (report.getBoolean("hasErrors"));
				boolean hasWarnings = (report.getBoolean("hasWarnings"));
				boolean hasInfo = (report.getBoolean("hasInfo"));
				recordStatistics(validationType, hasErrors, hasWarnings, hasInfo, false, ccdaValidatorImplementation);
			}catch(JSONException e) {
				recordStatistics(validationType, false, false, false, false, ccdaValidatorImplementation);
				// why is this JSON library forcing me to catch this dumb exception if the key is not found?!?!?!
			}
		}
	}

	public void recordStatistics(String testType, Boolean hasErrors, Boolean hasWarnings, Boolean hasInfo, Boolean hasHttpError, String validatorId){
		statisticsManager.addCcdaServiceCall(testType, hasErrors, hasWarnings, hasInfo, hasHttpError, validatorId);
	}

}
