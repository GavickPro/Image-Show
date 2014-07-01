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

if($this->config['random_slides'] == 1) {
	shuffle($this->config['image_show_data']);
}

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_startup">
	<div class="gkIsPreloader">Loading</div>
	
	<div class="gkIsImage">
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
						$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Startup_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
					} else {
						$path = $uri->root();
						$path .= $this->config['image_show_data'][$i]->image;
					}
					
				?>
				
				<div class="gkIsSlide" style="z-index: <?php echo $i+1; ?>;" title="<?php echo $title; ?>" data-path="<?php echo $path; ?>" data-link="<?php echo $link; ?>"></div>
			<?php endif; ?>
		<?php endfor; ?>
		
		<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
			<?php if($this->config['image_show_data'][$i]->published) : ?>
				<?php 
					// cleaning variables
					unset($link, $content);
					// creating slide link
					if($this->config['image_show_data'][$i]->type == "text") {
						$title = $this->config['image_show_data'][$i]->name;
						$content = str_replace('[ampersand]', '&', str_replace('[leftbracket]', '<', str_replace('[rightbracket]', '>', $this->config['image_show_data'][$i]->content)));
						$link = $this->config['image_show_data'][$i]->url;
					} else {
						$title = 'Only the "text" slide type is allowed in this style!';
						$content = 'Only the "text" slide type is allowed in this style!';
						$link = '#';
					}		
				?>
				<div class="gkIsText">
					<h2><a href="<?php echo $link; ?>"><?php echo $title; ?></a></h2>
					<p><?php echo $content; ?></p>
				</div>
			<?php endif; ?>
		<?php endfor; ?>
		
		<?php if($this->config['config']->gk_startup->gk_startup_arrows == 1) : ?>
		<div class="gkIsPrev">&laquo;</div>
		<?php endif; ?>
		
		<?php if($this->config['config']->gk_startup->gk_startup_arrows == 1) : ?>
		<div class="gkIsNext">&raquo;</div>
		<?php endif; ?>
		
		<?php if($this->config['config']->gk_startup->gk_startup_pagination == 1) : ?>
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