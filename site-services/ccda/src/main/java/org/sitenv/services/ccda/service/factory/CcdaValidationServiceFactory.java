package org.sitenv.services.ccda.service.factory;

import org.sitenv.services.ccda.service.ValidationService;

public interface CcdaValidationServiceFactory {
	ValidationService getCcdaValidatorService(String serviceName);
}
