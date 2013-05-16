<?php

/**
* GK Image Show - view file
* @package Joomla!
* @Copyright (C) 2009-2012 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK4 1.0 $
**/

// no direct access
defined('_JEXEC') or die;
// substr function to use mb_* function if exists.
function gk_substr($text, $start, $limit) {
	if(function_exists('mb_substr')) {
		return mb_substr($text, $start, $limit);	
	} else {
		return substr($text, $start, $limit);
	}
}

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_appsprotech">
	<div class="gkIsPreloader">Loading</div>
	
	<div class="gkIsImage" style="height: <?php echo $this->config['config']->gk_appsprotech->gk_appsprotech_module_height; ?>px;">
		<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
			<?php if($this->config['image_show_data'][$i]->published) : ?>
				<?php 
								
					unset($path, $title, $link);
                    if($this->config['image_show_data'][$i]->type == "k2"){
               	        $title = htmlspecialchars($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["title"]);
                         $link =  $this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["link"];
                     } else {
				        // creating slide title
					   $title = htmlspecialchars(($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->name : $this->articles[$this->config['image_show_data'][$i]->art_id]["title"]);
	                   // creating slide link
					   $link = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->url : $this->articles[$this->config['image_show_data'][$i]->art_id]["link"];	
					}
    	            // creating slide path					
					$path = '';
					// check if the slide have to be generated or not
					if($this->config['generate_thumbnails'] == 1) {
						$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_AppsProTech_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
					} else {
						$path = $this->config['image_show_data'][$i]->image;
					}
					
				?>
				
				<div class="gkIsSlide" style="margin-left: -<?php echo floor($width / 2); ?>px; margin-top: <?php echo $this->config['config']->gk_appsprotech->gk_appsprotech_image_y; ?>px; z-index: <?php echo $i+1; ?>;" title="<?php echo $title; ?>"><?php echo $path; ?><a href="<?php echo $link; ?>">link</a></div>
			<?php endif; ?>
		<?php endfor; ?>
		
		<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_show_title == 1 || $this->config['config']->gk_appsprotech->gk_appsprotech_show_desc == 1) : ?>
			<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
				<?php if($this->config['image_show_data'][$i]->published) : ?>
					<?php 
						// cleaning variables
						unset($link, $content);
						// creating slide link
						if($this->config['image_show_data'][$i]->type == "text") {
							$title = gk_substr($this->config['image_show_data'][$i]->name, 0, $this->config['config']->gk_appsprotech->gk_appsprotech_title_chars_amount);
							$content = gk_substr(str_replace('[ampersand]', '&',str_replace('[leftbracket]', '<', str_replace('[rightbracket]', '>', $this->config['image_show_data'][$i]->content))), 0, $this->config['config']->gk_appsprotech->gk_appsprotech_desc_chars_amount);
							$link = $this->config['image_show_data'][$i]->url;
						} else if($this->config['image_show_data'][$i]->type == "k2") {
							$title = gk_substr($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["title"], 0, $this->config['config']->gk_appsprotech->gk_appsprotech_title_chars_amount);
							$content = gk_substr(strip_tags($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["text"]), 0, $this->config['config']->gk_appsprotech->gk_appsprotech_desc_chars_amount);
							$link = $this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["link"];
						} else {
							$title = gk_substr($this->articles[$this->config['image_show_data'][$i]->art_id]["title"], 0, $this->config['config']->gk_appsprotech->gk_appsprotech_title_chars_amount);
							$content = gk_substr(strip_tags($this->articles[$this->config['image_show_data'][$i]->art_id]["text"]), 0, $this->config['config']->gk_appsprotech->gk_appsprotech_desc_chars_amount);
							$link = $this->articles[$this->config['image_show_data'][$i]->art_id]["link"];
						}		
					?>
					<div class="gkIsText" style="top: <?php echo $this->config['config']->gk_appsprotech->gk_appsprotech_text_block_y; ?>px;">
						<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_show_title == 1) : ?>
						<h1><a href="<?php echo $link; ?>"><?php echo $title; ?></a></h1>
						<?php endif; ?>
						
						<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_show_desc == 1) : ?>
						<h2><a href="<?php echo $link; ?>"><?php echo $content; ?></a></h2>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			<?php endfor; ?>
		<?php endif; ?>
		
		
		<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_pagination == 1) : ?>
		<div class="gkIsPrev">&laquo;</div>
		<?php endif; ?>
		
		<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_pagination == 1) : ?>
		<div class="gkIsNext">&raquo;</div>
		<?php endif; ?>
		
		<?php if($this->config['config']->gk_appsprotech->gk_appsprotech_pagination == 1) : ?>
		<div class="gkIsPagination">
			<ol>
				<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
					<?php if($this->config['image_show_data'][$i]->published) : ?>
					<li><a href="#<?php echo $i; ?>"><?php echo $i; ?></a></li>
					<?php endif; ?>
				<?php endfor; ?>
			</ol>
		</div>
		<?php endif; ?>
	</div>	
</div>