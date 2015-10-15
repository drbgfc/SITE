package org.sitenv.services.reference.ccda.services;

import org.apache.commons.io.IOUtils;
import org.sitenv.services.reference.ccda.dto.ValidationResultsDto;
import org.sitenv.services.reference.ccda.dto.ValidationResultsMetaData;
import org.sitenv.services.reference.ccda.validators.RefCCDAValidationResult;
import org.sitenv.services.reference.ccda.validators.schema.ReferenceCCDAValidator;
import org.sitenv.services.reference.ccda.validators.vocabulary.VocabularyCCDAValidator;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReferenceCCDAValidationService {

	public ValidationResultsDto validateCCDA(String validationObjective, String referenceFileName, MultipartFile ccdaFile) {
		ValidationResultsDto resultsDto = new ValidationResultsDto();

		List<RefCCDAValidationResult> validatorResults = getValidationResults(validationObjective, referenceFileName, ccdaFile);
		ValidationResultsMetaData resultsMetaData = buildValidationMedata(validatorResults, validationObjective);

		resultsDto.setResultsMetaData(resultsMetaData);
		resultsDto.setCcdaValidationResults(validatorResults);
		return resultsDto;
	}

	private List<RefCCDAValidationResult> getValidationResults(String validationObjective, String referenceFileName,
			MultipartFile ccdaFile) {
		List<RefCCDAValidationResult> validatorResults = new ArrayList<RefCCDAValidationResult>();
		String ccdaFileContents;
		InputStream fileIs = null;
		try {
			fileIs = ccdaFile.getInputStream();
			ccdaFileContents = IOUtils.toString(ccdaFile.getInputStream());
			validatorResults = doSchemaValidation(validationObjective, referenceFileName, ccdaFileContents);
			if (validatorResults.isEmpty()){
				validatorResults = DoVocabularyValidation(ccdaFileContents);
			}
		} catch (IOException e) {
			throw new RuntimeException("Error getting CCDA contents from provided file", e);
		} finally {
			closeFileInputStream(fileIs);
		}
		return validatorResults;
	}

	private ArrayList<RefCCDAValidationResult> DoVocabularyValidation(String ccdaFileContents) throws IOException {
		return VocabularyCCDAValidator.validate(ccdaFileContents);
	}

	private List<RefCCDAValidationResult> doSchemaValidation(String validationObjective, String referenceFileName, String ccdaFileContents) {
		return ReferenceCCDAValidator.validateCCDAWithReferenceFileName(validationObjective, referenceFileName,
				ccdaFileContents);
	}

	private ValidationResultsMetaData buildValidationMedata(List<RefCCDAValidationResult> validatorResults, String ccdaDocType) {
		ValidationResultsMetaData resultsMetaData = new ValidationResultsMetaData();
		for (RefCCDAValidationResult result : validatorResults) {
			resultsMetaData.addCount(result.getType());
		}
		resultsMetaData.setCcdaDocumentType(ccdaDocType);
		return resultsMetaData;
	}

	private void closeFileInputStream(InputStream fileIs) {
		if (fileIs != null) {
			try {
				fileIs.close();
			} catch (IOException e) {
				throw new RuntimeException("Error closing CCDA file input stream", e);
			}
		}
	}
}
