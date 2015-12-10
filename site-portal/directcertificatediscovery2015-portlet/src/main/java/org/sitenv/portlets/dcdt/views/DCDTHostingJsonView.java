package org.sitenv.portlets.dcdt.views;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.AbstractView;

@Component("dcdtHostingJsonView")
public class DCDTHostingJsonView extends AbstractView {

	
private Logger logger = Logger.getLogger(DCDTHostingJsonView.class);
	
	public DCDTHostingJsonView() {
		super();
		
		setContentType("text/plain");
	}
	
	@Override
    protected void renderMergedOutputModel(Map map, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    logger.info("Resolving ajax request view - " + map);
    
    JSONObject jsonObj = new JSONObject();
    
    // json population here:
    //jsonObj.put("files", map.get("files"));
    //jsonObj.put("body", map.get("body"));
    
    logger.info(jsonObj.toString());
    
    logger.info("content Type = " + getContentType());
    response.setContentType("text/plain");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write(jsonObj.toString());
    response.getWriter().flush();
    }
}
