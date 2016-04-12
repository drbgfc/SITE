package org.sitenv.services.ccda.service;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component(value="NonSpecificCCDADocTypeCCDA1_1")
public class NoSpecificCCDA1_1DocTypeValidationService extends BaseCCDAValidationService {
	Logger logger = LogManager.getLogger(NoSpecificCCDA1_1DocTypeValidationService.class.getName());

	@Value("${NonSpecificCCDAValidationServiceURL}")
	private String nonSpecificCCDAValidationServiceURL;

	@Override
	protected void setValidatorId(String validatorId) {
		this.validatorId = "1.1";
	}

	@Override
	public String getServiceLocation() {
		return nonSpecificCCDAValidationServiceURL;
	}
}
