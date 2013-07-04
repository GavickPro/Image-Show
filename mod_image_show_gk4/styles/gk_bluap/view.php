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

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_bluap" data-textpos="<?php echo $this->config['config']->gk_bluap->gk_bluap_text_block_position; ?>">
	<div class="gkIsPreloader"><span>Loading&hellip;</span></div>
	
	<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
	<?php if($this->config['image_show_data'][$i]->published) : ?>
		<?php 
			unset($path, $title, $link, $content);
			// creating slide path
			$path = '';
			// check if the slide have to be generated or not
			if($this->config['generate_thumbnails'] == 1) {
				$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Bluap_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
			} else {
				$path = $this->config['image_show_data'][$i]->image;
			}
            // creating slide title
			$title = htmlspecialchars(($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->name : 'Only the text slides can be used');
			$title = preg_replace('/__(.*?)__/i', '<strong>${1}</strong>', $title);
			// creating slide content
			$content = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->content : 'Only the text slides can be used';
			$content_sub = false;
			$subcontent_match_text = array();
			if(preg_match('/__(.*?)__/mis', $content, $subcontent_match_text) == 1) {
				$content_sub = $subcontent_match_text[1];
				$content = preg_replace('/__(.*?)__/mis', '', $content);
			}
			//
			// creating slide link
			//
			$link = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->url : '#';
			$link_text = '';
			// parsing custom texts
			$link_match_text = array();
			
			if(preg_match('@^\[(.*?)\]@mis', $link, $link_match_text) == 1) {
				$link = preg_replace('@^\[.*?\]@mis', '', $link);
				$link_text = $link_match_text[1];
				
				if(stripos($link_text, ',') !== FALSE) {
					$icon_match = array();
					preg_match('@icon-(.*?),@mis', $link_text, $icon_match);
					$link_text = preg_replace('@icon-(.*?),@mis', '<i class="icon-${1}"></i> ', $link_text);
				}
			} else {
				$link_text = JText::_('MOD_IMAGE_SHOW_ROCKWALL_READMORE');
			}
		?>
		<div class="figure" data-url="<?php echo $path; ?>" data-link="<?php echo $link; ?>" data-zindex="<?php echo $i+1; ?>" data-title="<?php echo $title; ?>" data-img-width="<?php echo 100 - $this->config['config']->gk_bluap->gk_bluap_text_block_width; ?>">
			<div class="figure-img" style="width: <?php echo 100 - $this->config['config']->gk_bluap->gk_bluap_text_block_width; ?>%;"></div>
			<div class="figcaption" <?php echo ' style="width: '.$this->config['config']->gk_bluap->gk_bluap_text_block_width.'%;"'; ?>>
				<h2><?php echo $title; ?></h2>
				<p><?php echo $content; ?></p>
				<a href="<?php echo $link; ?>" class="button"><?php echo $link_text; ?></a>
				<?php if($content_sub) : ?>
				<u><?php echo $content_sub; ?></u>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
	<?php endfor; ?>
	
	<ul class="gkIsPagination">
	<?php 
	$j = 0;
	for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
		<?php if($this->config['image_show_data'][$i]->published) : ?>
		<li<?php if($j == 0) : ?> class="active"<?php endif; ?>><?php echo $j++; ?></li>
		<?php endif; ?>
	<?php endfor; ?>
	</ul>
</div>