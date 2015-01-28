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

jimport('joomla.utilities.string');

if($this->config['random_slides'] == 1) {
	shuffle($this->config['image_show_data']);
}
?>

<div id="gkIs-<?php echo $this->config['module_id'];?>"
	data-sr="scale up 50% over 0.8s" 
	class="gkIsWrapper-gk_quark"
	<?php if($this->config['config']->gk_quark->gk_quark_show_preview === '1'): ?> data-preview="true"<?php endif; ?>
	<?php if($this->config['config']->gk_quark->gk_quark_autoanimation === '1'): ?>
	 data-autoanimation="true"
	<?php endif; ?>
	 data-interval="<?php echo $this->config['config']->gk_quark->gk_quark_animation_interval; ?>">
	<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
	<?php if($this->config['image_show_data'][$i]->published) : ?>
		<?php 
			
			unset($path, $title, $link, $content);
			// creating slide path
			$path = '';
			// check if the slide have to be generated or not
			if($this->config['generate_thumbnails'] == 1) {
				$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Quark_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
			} else {
				$path = $uri->root();
				$path .= $this->config['image_show_data'][$i]->image;
			}
			$content = '';
			
            if($this->config['image_show_data'][$i]->type == "k2"){
              	if(isset($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id])) {
              		$title = htmlspecialchars($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["title"]);
              		$content = $title;
                	$link =  $this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["link"];
                } else {
                	$title = 'Selected article doesn\'t exist!';
                	$content = $title;
                	$link = '#';
                }
            } else {
                // creating slide title
				$title = htmlspecialchars(($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->name : $this->articles[$this->config['image_show_data'][$i]->art_id]["title"]);
				// creating slie content
				$content = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->content : $title;
				$content = str_replace(array('[leftbracket]', '[rightbracket]', '[ampersand]'), array('<', '>', '&amp;'), $content);
				// creating slide link
				$link = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->url : $this->articles[$this->config['image_show_data'][$i]->art_id]["link"];	
			}
			
			$figure_class = '';
			
			if($i == 0) {
				$figure_class = ' class="gk-current"';
			}
			
			if($i == 1) {
				$figure_class = ' class="gk-next"';
			}
		?>
		<figure<?php echo $figure_class; ?>>
			<img src="<?php echo $path; ?>" data-link="<?php echo $link; ?>" />
		
			<?php if($title != '' && $content != '') : ?>
			<figcaption>
			<?php if($title != '') : ?>	
				<h2>
					<?php if($link != ''): ?><a href="<?php echo $link; ?>" class="inverse"><?php endif; ?>
					<?php echo $title; ?>
					<?php if($link != ''): ?></a><?php endif; ?>
				</h2>
			
				<?php if($content != '') : ?>
				<p><?php echo $content; ?></p>
				<?php endif; ?>
			<?php endif; ?>
			</figcaption>
			<?php endif; ?>
		</figure>
	<?php endif; ?>
	<?php endfor; ?>
	
	<?php if($this->config['config']->gk_quark->gk_quark_show_slider === '1'): ?>
	<div class="gkSlider">
		<span class="gkSliderBar"></span>
		<span class="gkSliderButton"></span>
	</div>
	<?php endif; ?>
	
	<?php if($this->config['config']->gk_quark->gk_quark_show_pagination === '1'): ?>	
	<ul class="gkIsQuarkPagination">
	<?php 
	$j = 0;
	for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
		<?php if($this->config['image_show_data'][$i]->published) : ?>
		<li<?php if($j++ == 0) : ?> class="active"<?php endif; ?>></li>
		<?php endif; ?>
	<?php endfor; ?>
	</ul>
	<?php endif; ?>
</div>
