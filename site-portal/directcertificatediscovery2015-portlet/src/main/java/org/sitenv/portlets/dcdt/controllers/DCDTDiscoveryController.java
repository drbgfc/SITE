package org.sitenv.portlets.dcdt.controllers;

import javax.portlet.ActionResponse;

import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.ActionMapping;
import org.springframework.web.portlet.multipart.MultipartActionRequest;

@Controller
@RequestMapping("VIEW")
public class DCDTDiscoveryController extends BaseController {

	@Autowired
	private StatisticsManager statisticsManager;
	
	@ActionMapping(params = "javax.portlet.action=DCDTDiscovery")
	public void response(MultipartActionRequest request, ActionResponse response) {

		ModelAndView modelAndView = new ModelAndView();

		modelAndView.setViewName("view");

	}

	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
	
}
