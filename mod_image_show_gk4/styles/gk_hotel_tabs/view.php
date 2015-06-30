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
<div 
	id="gkIs-<?php echo $this->config['module_id'];?>" 
	class="gkIsWrapper-gk_hotel_tabs"
	<?php if($slides_count == 1) : ?>data-one-slide="true"<?php endif; ?>
	<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_animation_loop == 0) : ?>data-no-loop="true"<?php endif; ?>
	data-pagination="<?php echo $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_pagination; ?>"
	data-count="<?php echo $slides_count; ?>"
	data-mode="<?php echo $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mode; ?>"
>
	<div class="gkIsPreloader"></div>

	<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_pagination == 'top') : ?>
	<ul class="gkIsPagination gkIsPaginationTop" data-count="<?php echo $slides_count; ?>">
		<?php 
			$iterator = 1;
			for($i = 0; $i < count($this->config['image_show_data']); $i++) : 
		?>
			<?php if($this->config['image_show_data'][$i]->published) : ?>
			<li<?php if($iterator == 1) : ?> class="active"<?php endif; ?>>
				<a href="#<?php echo $iterator; ?>"><?php echo (($iterator < 10) ? '0' : '') . $iterator++; ?></a>
			</li>
			<?php endif; ?>
		<?php endfor; ?>
	</ul>
	<?php endif; ?>

	<?php for($i = 0; $i < count($this->config['image_show_data']); $i++) : ?>
	<?php if($this->config['image_show_data'][$i]->published) : ?>
		<?php 
			
			unset($path, $title, $link, $content);
			// creating slide path
			$path = '';
			// check if the slide have to be generated or not
			if($this->config['generate_thumbnails'] == 1) {
				$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_HotelTabs_Image::translateName($this->config['image_show_data'][$i]->image, $this->config['module_id']);
			} else {
				$path = $uri->root();
				$path .= $this->config['image_show_data'][$i]->image;
			}
			$content = '';
			
            if($this->config['image_show_data'][$i]->type == "k2"){
              	if(isset($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id])) {
              		$title = htmlspecialchars($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["title"]);
              		$content = htmlspecialchars($this->articlesK2[$this->config['image_show_data'][$i]->artK2_id]["introtext"]);
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
				$content = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->content : $this->articles[$this->config['image_show_data'][$i]->art_id]["introtext"];
				// creating slide link
				$link = ($this->config['image_show_data'][$i]->type == "text") ? $this->config['image_show_data'][$i]->url : $this->articles[$this->config['image_show_data'][$i]->art_id]["link"];	
			}

			$content = str_replace(array('[ampersand]', '[leftbracket]', '[rightbracket]'), array('&', '<', '>'), $content);
			preg_match('@^\[(.*?)\]@mis', $link, $link_match);
			$link = preg_replace('@^\[.*?\]@mis', '', $link);
			$link_label = JText::_('MOD_IMAGE_SHOW_HOTEL_TABS_READMORE');

			if(count($link_match) > 1) {
				$link_label = $link_match[1];
			}
		?>
		<figure data-url="<?php echo $path; ?>" data-link="<?php echo $link; ?>" data-zindex="<?php echo count($this->config['image_show_data']) - $i; ?>" data-title="<?php echo $title; ?>">
			<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_show_title_block && $title != '') : ?>	
			<figcaption class="gkPage mode-<?php echo $this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mode; ?>">
				<div>
					<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mode == 'slideshow') : ?>
						<small><a href="<?php echo $link; ?>"><?php echo $content; ?></a></small>
						<h2><a href="<?php echo $link; ?>"><?php echo $title; ?></a></h2>
						<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_show_button == '1') : ?>
						<a href="<?php echo $link; ?>" class="readon"><?php echo $link_label; ?></a>
						<?php endif; ?>
					<?php elseif($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_mode == 'showcase') : ?>
						<h2><a href="<?php echo $link; ?>"><?php echo $title; ?></a></h2>
					<?php else : ?>
						<blockquote>
							<?php echo $content; ?>
							<cite><?php echo $title; ?></cite>
						</blockquote>
					<?php endif; ?>
				</div>
			</figcaption>
			<?php endif; ?>
		</figure>
	<?php endif; ?>
	<?php endfor; ?>

	<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_prev_next == '1') : ?>
	<a href="#prev" class="gkIsPrev">&laquo;</a>
	<a href="#next" class="gkIsNext">&raquo;</a>
	<?php endif; ?>

	<?php if($this->config['config']->gk_hotel_tabs->gk_hotel_tabs_pagination == 'bottom') : ?>
	<ul class="gkIsPagination gkIsPaginationBottom" data-count="<?php echo $slides_count; ?>">
		<?php 
			$iterator = 1;
			for($i = 0; $i < count($this->config['image_show_data']); $i++) : 
		?>
			<?php if($this->config['image_show_data'][$i]->published) : ?>
			<li<?php if($iterator == 1) : ?> class="active"<?php endif; ?>>
				<a href="#<?php echo $iterator; ?>"><?php echo (($iterator < 10) ? '0' : '') . $iterator++; ?></a>
			</li>
			<?php endif; ?>
		<?php endfor; ?>
	</ul>
	<?php endif; ?>
</div>
