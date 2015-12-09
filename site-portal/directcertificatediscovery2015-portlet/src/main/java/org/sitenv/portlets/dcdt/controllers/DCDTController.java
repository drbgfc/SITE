package org.sitenv.portlets.dcdt.controllers;

import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.sitenv.common.statistics.manager.StatisticsManager;
import org.sitenv.common.utilities.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.portlet.bind.annotation.RenderMapping;

@Controller
@RequestMapping("VIEW")
public class DCDTController extends BaseController {

	@Autowired
	private StatisticsManager statisticsManager;
	
	@RenderMapping()
	public ModelAndView handleRenderRequest(RenderRequest request,
			RenderResponse response) {

		ModelAndView modelAndView = new ModelAndView();

		modelAndView.setViewName("view");

		return modelAndView;
	}

	public StatisticsManager getStatisticsManager() {
		return statisticsManager;
	}

	public void setStatisticsManager(StatisticsManager statisticsManager) {
		this.statisticsManager = statisticsManager;
	}
}
