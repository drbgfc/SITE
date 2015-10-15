package org.sitenv.services.reference.ccda.validators.vocabulary;

import org.apache.commons.io.IOUtils;
import org.sitenv.services.reference.ccda.validators.RefCCDAValidationResult;
import org.sitenv.services.reference.ccda.validators.enums.ValidationResultType;
import org.sitenv.xml.validators.ccda.CcdaValidatorResult;
import org.sitenv.xml.xpathvalidator.engine.XPathValidationEngine;
import org.sitenv.xml.xpathvalidator.engine.data.XPathValidatorResult;
import org.xml.sax.SAXException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;


public class VocabularyCCDAValidator {
    private static final String DEFAULT_PROPERTIES_FILE = "environment.properties";
    private static XPathValidationEngine engine = null;

    protected static Properties props;

    protected static void loadProperties() throws IOException {
        InputStream in = VocabularyCCDAValidator.class.getClassLoader().getResourceAsStream(DEFAULT_PROPERTIES_FILE);

        if (in == null) {
            props = null;
            throw new FileNotFoundException("Environment Properties File not found in class path.");
        } else {
            props = new Properties();
            props.load(in);
        }
    }

    public static ArrayList<RefCCDAValidationResult> validate(String ccdaFile) throws IOException {
        ArrayList<RefCCDAValidationResult> results = new ArrayList<RefCCDAValidationResult>();
        if (props == null) {
            loadProperties();
        }

        if (engine == null) {
            engine = new XPathValidationEngine();
            engine.initialize(props.getProperty("referenceccda.configFile"));
        }

        try {
            if (ccdaFile != null) {
                List<XPathValidatorResult> validationResults = engine.validate(IOUtils.toInputStream(ccdaFile, "UTF-8"));

                for (XPathValidatorResult result : validationResults) {
                   results.add(createValidationResult(result));
                }
            }
        } catch (IOException | SAXException e) {
            e.printStackTrace();
        }

        return results;

    }

    private static RefCCDAValidationResult createValidationResult(XPathValidatorResult result) {
        if (result instanceof CcdaValidatorResult){
            CcdaValidatorResult convertedResult = (CcdaValidatorResult)result;
            convertedResult.getRequestedCode();
            convertedResult.getRequestedCodeSystem();
            convertedResult.getRequestedCodeSystemName();
            convertedResult.getRequestedDisplayName();
            convertedResult.getExpectedValues();
            String resultMessage;
            ValidationResultType type;
            if(result.hasError()){
                resultMessage = result.getErrorMessage();
                type = ValidationResultType.CCDA_VOCAB_CONFORMANCE_ERROR;
            }else if(result.hasWarning()){
                resultMessage = result.getWarningMessage();
                type = ValidationResultType.CCDA_VOCAB_CONFORMANCE_WARN;
            }else{
                resultMessage = result.getInfoMessage();
                type = ValidationResultType.CCDA_VOCAB_CONFORMANCE_INFO;
            }
            return new RefCCDAValidationResult.RefCCDAValidationResultBuilder(resultMessage, result.getXpathExpression(), type, "0").actualCode(convertedResult.getRequestedCode()).actualCodeSystem(convertedResult.getRequestedCodeSystem()).actualDisplayName(convertedResult.getRequestedDisplayName()).expectedValueSet(Arrays.toString(convertedResult.getExpectedValues().toArray())).build();
        }
        return null;
    }

}
