package org.sitenv.portlets.directtransport.controllers;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.Security;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

import javax.portlet.ActionResponse;
import javax.portlet.PortletContext;
import javax.portlet.RenderRequest;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.DEROutputStream;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMReader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.nhindirect.trustbundle.core.CreateUnSignedPKCS7;
import org.sitenv.common.utilities.controller.BaseController;
import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.portlets.directtransport.TrustBundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.bind.annotation.ResourceMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

import com.liferay.portal.kernel.servlet.HttpHeaders;

@Controller
@RequestMapping("VIEW")
public class TrustBundleController extends BaseController {

	private static Logger logger = Logger
			.getLogger(TrustBundleController.class);
	private static final int DEFAULT_BUFFER_SIZE = 10240; // 10KB.

	private static final int MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

	@Autowired
	private PortletContext portletContext;
	
	@Autowired
	private StatisticsManager statisticsManager;

	@Autowired
	private TrustBundle trustBundleObj;

	@ResourceMapping("getTrustBundle")
	public void getTrustBundle(ResourceRequest request,
			ResourceResponse response) throws IOException {
		if (this.props == null) {
			this.loadProperties();
		}

		// Prepare streams.
		BufferedInputStream input = null;
		BufferedOutputStream output = null;

		// get the file path from configuration.
		String filePath = props.getProperty("trustBundleFile");

		File file = new File(filePath);

		// Check if file actually exists in filesystem.
		if (!file.exists()) {
			logger.error("Certificate bundle does not exist.");
			return;
		}

		logger.trace("read bundle file web.xml:" + filePath);

		// Get content type by filename.
		String contentType = portletContext.getMimeType(file.getName());

		// If content type is unknown, then set the default value.
		// For all content types, see:
		// http://www.w3schools.com/media/media_mimeref.asp
		// To add new content types, add new mime-mapping entry in web.xml.
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		// Init servlet response.
		response.reset();
		response.setBufferSize(DEFAULT_BUFFER_SIZE);
		response.setContentType(contentType);
		response.addProperty(HttpHeaders.CONTENT_LENGTH,
				String.valueOf(file.length()));
		response.addProperty(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getName() + "\"");

		// Open streams.
		input = new BufferedInputStream(new FileInputStream(file),
				DEFAULT_BUFFER_SIZE);
		output = new BufferedOutputStream(response.getPortletOutputStream(),
				DEFAULT_BUFFER_SIZE);

		// Write file contents to response.
		byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
		int length;
		while ((length = input.read(buffer)) > 0) {
			output.write(buffer, 0, length);
		}
		logger.trace("trust bundle file served.");

		// Gently close streams.
		output.close();
		input.close();
	}

	@ActionMapping(params = "javax.portlet.action=uploadTrustAnchor")
	public void uploadTrustAnchor(MultipartActionRequest request,
			ActionResponse response) throws IOException {

		if (this.props == null) {
			this.loadProperties();
		}

		// handle the files:

		response.setRenderParameter("javax.portlet.action", "uploadTrustAnchor");
		MultipartFile file = request.getFile("anchoruploadfile");

		trustBundleObj.setFileJson(new JSONArray());

		Boolean uploadSuccess = false;
		String savedFilePath = null;
		String errorMsg = null;

		trustBundleObj.setResult(new JSONObject());

		String uploadAnchorFileDir = props.getProperty("trustAnchorDir");
		String trustBundleFile = props.getProperty("trustBundleFile");

		try {
			JSONObject jsono = new JSONObject();
			jsono.put("name", file.getOriginalFilename());
			jsono.put("size", file.getSize());

			trustBundleObj.getFileJson().put(jsono);

			try {

				logger.trace("extracting the anchor file.");

				String fileName = new File(file.getOriginalFilename()).getName();
				
				if (file.getSize() > MAX_FILE_SIZE)
				{
					throw new FileUploadException("Uploaded file exceeded maxinum number of bytes.");
				}
				
				byte[] fileBytes = IOUtils.toByteArray(file.getInputStream());

				ByteArrayInputStream stream = new ByteArrayInputStream(
						fileBytes);
				InputStreamReader streamReader = new InputStreamReader(stream);
				BufferedReader reader = new BufferedReader(streamReader);

				String firstLine = reader.readLine();

				if (firstLine.equalsIgnoreCase("-----BEGIN CERTIFICATE-----")) {
					Security.addProvider(new BouncyCastleProvider());

					stream = new ByteArrayInputStream(fileBytes);
					streamReader = new InputStreamReader(stream);

					PEMReader r = new PEMReader(streamReader);
					X509Certificate certObj = (X509Certificate) r.readObject();

					byte[] tempBytes = certObj.getEncoded();
					ASN1InputStream in = new ASN1InputStream(tempBytes);
					ByteArrayOutputStream bOut = new ByteArrayOutputStream();
					DEROutputStream dOut = new DEROutputStream(bOut);
					dOut.writeObject(in.readObject());
					byte[] derData = bOut.toByteArray();

					r.close();
					in.close();
					dOut.close();

					savedFilePath = uploadAnchorFileDir + File.separator
							+ FilenameUtils.getName(fileName) + ".der";

					FileOutputStream fos = new FileOutputStream(savedFilePath);
					fos.write(derData);
					fos.close();

					fileName = new File(FilenameUtils.getPath(fileName)
							+ FilenameUtils.getName(fileName) + ".der")
							.getName();
				} else {
					// we need to check if the BouncyCastle provider is already
					// installed
					// before installing it
					if (Security
							.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
						Security.addProvider(new BouncyCastleProvider());
					}

					CertificateFactory cf = CertificateFactory.getInstance(
							"X.509", "BC");
					X509Certificate x509cert = null;
					
					try {
						x509cert = (X509Certificate) cf
							.generateCertificate(new ByteArrayInputStream(
									fileBytes));
						
						if (x509cert != null) {
							logger.trace(String
									.format("file uploaded %s", fileName));
							
							// added this code to do additional verification of the certificate
							// if it fails, then it's not really an x.509 certificate
							byte[] tempBytes = x509cert.getEncoded();
							ASN1InputStream in = new ASN1InputStream(tempBytes);
							ByteArrayOutputStream bOut = new ByteArrayOutputStream();
							DEROutputStream dOut = new DEROutputStream(bOut);
							dOut.writeObject(in.readObject());
							byte[] derData = bOut.toByteArray();
							
							in.close();
							dOut.close();
							
							savedFilePath = uploadAnchorFileDir + File.separator
									+ fileName + ".der";
							File storeFile = new File(savedFilePath);
							FileOutputStream fos = new FileOutputStream(storeFile);
							fos.write(derData);
							fos.close();
						} else {
							throw new Exception(
									"Certificates must be in binary or base64 encoded X.509 format.");
						}
					} catch (Exception e)
					{
						throw new Exception(
								"Certificates must be in binary or base64 encoded X.509 format.");
					}

					
				}

				logger.info(String.format("Anchor file uploaded to %s",
						savedFilePath));

				uploadSuccess = true;

			} catch (FileUploadException e) {
				
				if (e.getMessage().endsWith("bytes.")) {
					errorMsg = "Maxiumum file size exceeeded. "
							+ "Please return to the previous page and select a file that is less than "
							+ MAX_FILE_SIZE / 1024 / 1024 + "MB(s).";
				} else {
					errorMsg = "There was an error uploading the file: "
							+ e.getMessage();
				}
				logger.error(errorMsg, e);
			} catch (Exception e) {
				
				errorMsg = "Failed to upload your certificate due to error: "
						+ e.getMessage();
				logger.error(errorMsg, e);
			}

			if (uploadSuccess) {
				try {
					String bundleGenRsltStr = GenTrustBundle(
							uploadAnchorFileDir, trustBundleFile);
					logger.trace(bundleGenRsltStr);

					if (bundleGenRsltStr.contains("Error")) {
						// delete the uploaded file;
						FileUtils.forceDelete(new File(savedFilePath));
						errorMsg = "Failed to include the certificate into the bundle, please verify the format of the anchor file uploaded.";
					}

					logger.info("Trust bundle generated at:" + trustBundleFile);
				} catch (ClassNotFoundException e) {
					errorMsg = e.getMessage();
					if (errorMsg == null)
					{
						errorMsg = "Failed to generate the trustbundle";
					}
					logger.error("Failed to generate the trustbundle", e);
				}

				if (errorMsg != null) {
					
					
					trustBundleObj.getResult().put("IsSuccess", "false");
					trustBundleObj.getResult().put("ErrorMessage", errorMsg);
					
					
					statisticsManager.addDirectTrustUpload(true);
				} else {
					
					trustBundleObj.getResult().put("IsSuccess", "true");
					trustBundleObj.getResult().put(
							"ErrorMessage",
							"Upload succeeded, it may take up to five minutes for the server to receive your trust anchor.(Click to hide this message)");
					
					statisticsManager.addDirectTrustUpload(false);
				}
			} else {
				
				trustBundleObj.getResult().put("IsSuccess", "false");
				trustBundleObj.getResult().put("ErrorMessage", errorMsg);
				statisticsManager.addDirectTrustUpload(true);
			}
		} catch (JSONException e) {
			statisticsManager.addDirectTrustUpload(true);
			throw new RuntimeException(e);
		}
	}

	@RequestMapping(params = "javax.portlet.action=uploadTrustAnchor")
	public ModelAndView process(RenderRequest request, Model model)
			throws IOException {
		Map map = new HashMap();

		map.put("files", trustBundleObj.getFileJson());

		map.put("result", trustBundleObj.getResult());

		return new ModelAndView("genericResultJsonView", map);
	}

	private static synchronized String GenTrustBundle(String anchorDir,
			String bundleFilePath) throws ClassNotFoundException {
		// make sure the class loaded by jvm.
		Class.forName("org.nhindirect.trustbundle.core.CreateUnSignedPKCS7");
		CreateUnSignedPKCS7 generator = new CreateUnSignedPKCS7();
		File file = new File(bundleFilePath);
		logger.trace("folder:" + file.getParent());
		logger.trace("filename:" + file.getName());
		return generator.getParameters(anchorDir, "Select Meta Data File",
				file.getParent(), file.getName());
	}

	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
	

}
