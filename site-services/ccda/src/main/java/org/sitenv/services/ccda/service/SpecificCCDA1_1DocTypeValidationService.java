package org.sitenv.services.ccda.service;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component(value="SpecificCCDADocTypeCCDA1_1")
public class SpecificCCDA1_1DocTypeValidationService extends BaseCCDAValidationService {
	Logger logger = LogManager.getLogger(SpecificCCDA1_1DocTypeValidationService.class.getName());
	@Value( "${CCDAValidationServiceURL}" )
	private String ccdaValidationServiceURL;

	@Override
	public String getServiceLocation() {
		return ccdaValidationServiceURL;
	}

	@Override
	protected void setValidatorId(String validatorId) {
		this.validatorId = "1.1";
	}
}
