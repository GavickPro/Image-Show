<?php

/**
* GK Image Show - main PHP file
* @package Joomla!
* @Copyright (C) 2009-2014 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK4 1.0 $
**/

// no direct access
defined('_JEXEC') or die;
// Image class loading
require_once (dirname(__FILE__).DS.'class.image.php');
// Model class loading
require_once (dirname(__FILE__).DS.'model.php');

class GKIS_gk_hotel_tabs_Controller {
	// configuration array
	private $config;
	// module info
	private $module;
	// article data
	private $articles;
    private $articlesK2;
	// constructor
	function __construct($module, $config) {
		// init the style config
		$this->config = $config;
		// init the module info
		$this->module = $module;
		// init the articles array
		$this->articles = array();
        $this->articlesK2 = array();
		// check the module images
		$this->checkImages();
		// get the articles data
		$this->getArticleData();
		// generate the view
		$this->generateView();
	}
	// check the images
	function checkImages() {
		// if the thumbnail generation is enabled
		if($this->config['generate_thumbnails'] == 1) {
			// basic images params		
			$img_width = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_image_width;
			$img_height = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_image_height;
			$img_bg = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_image_bg;
			$quality = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_quality;
			// check the slides
			foreach($this->config['image_show_data'] as $slide) {
				$stretch = ($slide->stretch == 'nostretch') ? false : true;
				GKIS_HotelTabs_Image::createThumbnail($slide->image, $this->config, $img_width, $img_height, $img_bg, $stretch, $quality);	
			}
		}
	}
	// get the articles data
	function getArticleData() {
		// create the array
		$ids = array();
        $idsK2 = array();
		// generate the content of the array
		foreach($this->config['image_show_data'] as $slide) {
			if($slide->type == 'article') {
				if($slide->art_id) {
					array_push($ids, $slide->art_id);
				} else {
					array_push($ids, 0);
				}
			}
			
			if($slide->type == 'k2') {
				if($slide->artK2_id) {
					array_push($idsK2, $slide->artK2_id);
				} else {
					array_push($idsK2, 0);
				}
			}
		}
		// get the data
		if(count($idsK2) > 0) {
			$this->articlesK2 = GKIS_gk_hotel_tabs_Model::getDataK2($idsK2);
		}
		if(count($ids) > 0) {
			$this->articles = GKIS_gk_hotel_tabs_Model::getData($ids);
		}
	}
	// generate view
	function generateView() {
		// generate the head section
		$document = JFactory::getDocument();
		$uri = JURI::getInstance();
		// get the head data
		$headData = $document->getHeadData();
		// generate keys of script section
		$headData_js_keys = array_keys($headData["scripts"]);
		// generate keys of css section
		$headData_css_keys = array_keys($headData["style"]);
		// set variables for false
		$engine_founded = false;
		$css_founded = false;
		// searching engine in scripts paths
		if(array_search($uri->root().'modules/mod_image_show_gk4/styles/'.$this->config['styles'].'/engine.js', $headData_js_keys) > 0) {
			$engine_founded = true;
		}
		// searching css in CSSs paths
		if(array_search($uri->root().'modules/mod_image_show_gk4/styles/'.$this->config['styles'].'/style.css', $headData_css_keys) > 0) {
			$css_founded = true;
		}
		// if mootools file doesn't exists in document head section
		if(!$engine_founded){ 
			// add new script tag connected with mootools from module
			$document->addScript($uri->root().'modules/mod_image_show_gk4/styles/'.$this->config['styles'].'/engine.js');
		}
		// if CSS not found
		if(!$css_founded && $this->config['use_style_css'] == 1) {
			// add stylesheets to document header
			$document->addStyleSheet($uri->root().'modules/mod_image_show_gk4/styles/'.$this->config['styles'].'/style.css' );
		}
		// add script fragment
		$document->addScriptDeclaration('try {$Gavick;}catch(e){$Gavick = {};};$Gavick["gkIs-'.$this->config['module_id'].'"] = { "animSpeed": '.$this->config['config']->gk_hotel_tabs->gk_hotel_tabs_animation_speed.', "animInterval": '.$this->config['config']->gk_hotel_tabs->gk_hotel_tabs_animation_interval.', "slideLinks": '.$this->config['config']->gk_hotel_tabs->gk_hotel_tabs_slide_links.' };');
		// generate necessary variables
		$width = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_image_width;
		$height = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_image_height;
		$t_width = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_tablet_image_width;
		$t_height = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_tablet_image_height;
		$m_width = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mobile_image_width;
		$m_height = $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mobile_image_height;
		// add styles fragment
		$document->addStyleDeclaration('
		#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs {
			min-height: '.$height.'px;
		}
		
		#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs,
		#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsSlide {
			height: '.$height.'px;
			max-width: '.$width.'px;
		}
		
		#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs figure,
		#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsPreloader {
			max-width: '.$width.'px;
		}
		
		@media (max-width: 1040px) {
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs {
				min-height: '.$t_height.'px;
			}
			
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs,
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsSlide {
				height: '.$t_height.'px;
				max-width: '.$t_width.'px;
			}
			
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs figure,
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsPreloader {
				max-width: '.$t_width.'px;
			}
		}
		
		@media (max-width: 640px) {
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs {
				min-height: '.$m_height.'px;
			}
			
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs,
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsSlide {
				height: '.$m_height.'px;
				max-width: '.$m_width.'px;
			}
			
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs figure,
			#gkIs-'.$this->config['module_id'].'.gkIsWrapper-gk_hotel_tabs .gkIsPreloader {
				max-width: '.$m_width.'px;
			}
		}
		');
		// Prepare data
		if($this->config['random_slides'] == 1) {
			shuffle($this->config['image_show_data']);
		}

		$slides_count = 0;

		for($i = 0; $i < count($this->config['image_show_data']); $i++) {
			if($this->config['image_show_data'][$i]->published) {
				$slides_count++;
			}
		}

		// load view
		require(dirname(__FILE__).DS.'view.php');
	}
}

// EOF
