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
<div class="gkIsWrapperFixed">
	<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_creativity notloaded" data-bganim="<?php echo $this->config['config']->gk_creativity->gk_creativity_bganim; ?>">
		<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
		<?php if($this->config['image_show_data'][$i]->published) : ?>
			<?php 
				
				unset($path, $title, $link, $content);
				// creating slide path
				$path = '';
				// check if the slide have to be generated or not
				if($this->config['generate_thumbnails'] == 1) {
					if(preg_match('@^#[0-9a-fA-F]{3,6}$@mi', $this->config['image_show_data'][$i]->image) == 0) {
						$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Creativity_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
					} else {
						$path = $this->config['image_show_data'][$i]->image;
					}
				} else {
					$path = $this->config['image_show_data'][$i]->image;
				}    
	            //
	            // creating slide title
	            //
				$title = htmlspecialchars(($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->name : 'Only the text slide types are allowed!');
				// parsing icons
				if(preg_match('@\[icon-(.*?)\]@mis', $title) == 1) {
					$ticons_matches = array();
					preg_match_all('@\[icon-(.*?)\]@mis', $title, $ticons_matches);
					$ticons_count = count($ticons_matches[1]);
					$ticons_out_str = array();
					$ticons_out_code = array();
					
					for($j = 0; $j < $ticons_count; $j++) {
						array_push($ticons_out_str, '[icon-' . $ticons_matches[1][$j] . ']');
						$ticon_data = explode(',', $ticons_matches[1][$j]);
						
						if(count($ticon_data) == 1) {
							array_push($ticons_out_code, '<i class="icon-'.$ticon_data[0].'"></i>');
						} elseif (count($ticon_data) == 2 && !is_numeric($ticon_data[1])) {
							array_push($ticons_out_code, '<i class="icon-'.$ticon_data[0].' icon-'.$ticon_data[1].'"></i>');
						} elseif (count($ticon_data) == 2 && is_numeric($ticon_data[1])) {
							array_push($ticons_out_code, '<i class="icon-'.$ticon_data[0].'" style="font-size: '.$ticon_data[1].'px;"></i>');
						} elseif (count($ticon_data) == 3) {
							array_push($ticons_out_code, '<i class="icon-'.$ticon_data[0].' icon-'.$ticon_data[2].'" style="font-size: '.$ticon_data[1].'px;"></i>');
						}
					}
					
					$title = str_replace($ticons_out_str, $ticons_out_code, $title);
				}
				// title anim
				$title_anim = $this->config['config']->gk_creativity->gk_creativity_title_anim;
				if(preg_match('@\[anim-(.*?)\]@mis', $title) == 1) {
					preg_match('@\[anim-(.*?)\]@mis', $title, $title_anim_matches);
					$title = preg_replace('@\[anim-(.*?)\]@mis', '', $title);
					$title_anim = $title_anim_matches[1];
				}
				//
				// creating slide content
				//
				$content = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->content : 'Only the text slide types are allowed!';
				// parsing icons
				if(preg_match('@\[icon-(.*?)\]@mis', $content) == 1) {
					$cicons_matches = array();
					preg_match_all('@\[icon-(.*?)\]@mis', $content, $cicons_matches);
					$cicons_count = count($cicons_matches[1]);
					$cicons_out_str = array();
					$cicons_out_code = array();
					
					for($j = 0; $j < $cicons_count; $j++) {
						array_push($cicons_out_str, '[icon-' . $cicons_matches[1][$j] . ']');
						$cicon_data = explode(',', $cicons_matches[1][$j]);
						
						if (count($cicon_data) == 1) {
							array_push($cicons_out_code, '<i class="icon-'.$cicon_data[0].'"></i>');
						} elseif (count($cicon_data) == 2 && !is_numeric($cicon_data[1])) {
							array_push($cicons_out_code, '<i class="icon-'.$cicon_data[0].' icon-'.$cicon_data[1].'"></i>');
						} elseif (count($cicon_data) == 2 && is_numeric($cicon_data[1])) {
							array_push($cicons_out_code, '<i class="icon-'.$cicon_data[0].'" style="font-size: '.$cicon_data[1].'px;"></i>');
						} elseif (count($cicon_data) == 3) {
							array_push($cicons_out_code, '<i class="icon-'.$cicon_data[0].' icon-'.$cicon_data[2].'" style="font-size: '.$cicon_data[1].'px;"></i>');
						}
					}
					
					$content = str_replace($cicons_out_str, $cicons_out_code, $content);
				}
				// content anim
				$content_anim = $this->config['config']->gk_creativity->gk_creativity_text_anim;
				if(preg_match('@\[anim-(.*?)\]@mis', $content) == 1) {
					preg_match('@\[anim-(.*?)\]@mis', $content, $content_anim_matches);
					$content = preg_replace('@\[anim-(.*?)\]@mis', '', $content);
					$content_anim = $content_anim_matches[1];
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
				} else {
					$link_text = JText::_('MOD_IMAGE_SHOW_CREATIVITY_READMORE');
				}
				
				// slide iterator
				$num = 0;
			?>
			<div 
				class="gkIsSlide figure slide<?php echo ++$num; ?>"
				<?php if(preg_match('@^#[0-9a-fA-F]{3,6}$@mi', $path) == 0) : ?>
				 style="background-image: url('<?php echo $path; ?>');" 
				<?php else : ?>
				 style="background-color: <?php echo $path; ?>;" 
				<?php endif; ?>
				data-link="<?php echo $link; ?>" 
			>	
				<div class="figcaption slide<?php echo $num; ?>">
					<div>
						<h2 data-anim="<?php echo $title_anim; ?>"><?php echo $title; ?></h2>
						<h1 data-anim="<?php echo $content_anim; ?>"><?php echo $content; ?></h1>
					</div>
					<a href="<?php echo $link; ?>" class="gkLearnMore" data-anim="slidedownbtn"><?php echo $link_text; ?></a>
				</div>
			</div>
		<?php endif; ?>
		<?php endfor; ?>
		
		<?php if($this->config['config']->gk_creativity->gk_creativity_pagination) : ?>
		<div class="gkIsPrevBtn"><i class="icon-angle-left"></i></div>
		<div class="gkIsNextBtn"><i class="icon-angle-right"></i></div>
		<?php endif; ?>
		
		<div class="gkIsLoader"></div>
	</div>
</div>