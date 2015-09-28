package org.sitenv.services.reference.ccda.dto;

import java.util.List;

import org.sitenv.referenceccda.validator.RefCCDAValidationResult;

public class ValidationResultsDto {
	private ValidationResultsMetaData resultsMetaData;
	private List<RefCCDAValidationResult> ccdaValidationResults;

	public List<RefCCDAValidationResult> getCcdaValidationResults() {
		return ccdaValidationResults;
	}

	public void setCcdaValidationResults(List<RefCCDAValidationResult> ccdaValidationResults) {
		this.ccdaValidationResults = ccdaValidationResults;
	}

	public ValidationResultsMetaData getResultsMetaData() {
		return resultsMetaData;
	}

	public void setResultsMetaData(ValidationResultsMetaData resultsMetaData) {
		this.resultsMetaData = resultsMetaData;
	}

}
