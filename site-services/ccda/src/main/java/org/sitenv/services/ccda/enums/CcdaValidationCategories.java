package org.sitenv.services.ccda.enums;

public enum CcdaValidationCategories {
	INFO ("info"),
	WARNINGS ("warnings"),
	ERRORS ("errors");
	
	private final String validationCategory;

	CcdaValidationCategories(final String validationCategory) {
		this.validationCategory = validationCategory;
	}
	
	public String getValidationCategory() {
		return validationCategory;
	}
}
