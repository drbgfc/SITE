package org.sitenv.services.ccda.web.controller;

import org.sitenv.services.ccda.service.manager.CcdaValidatorServiceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "", produces = MediaType.TEXT_XML_VALUE)
public class CCDAValidationController {
	@Autowired
	private CcdaValidatorServiceManager ccdaValidatorServiceManager;

	@RequestMapping(value = "/r1.1/", headers = "content-type=multipart/*", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
	public String validater1_1(@RequestParam(value = "type_val", required = false) String type_val,
			@RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
		return ccdaValidatorServiceManager.callCcda1_1ValidationServices(file, type_val);
	}
}
