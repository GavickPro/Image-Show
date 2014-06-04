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

$firstFlag = false;
$firstFlagPag = false;

jimport('joomla.utilities.string');

if($this->config['random_slides'] == 1) {
	shuffle($this->config['image_show_data']);
}

$slidesCounter = 0;

for($y = 0; $y < count($this->config['image_show_data']); $y++) {
	if($this->config['image_show_data'][$y]->published) {
		$slidesCounter++;
	}
}

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_shop_and_buy">
	<div class="gkIsPreloader"><span></span></div>
	
	<div class="gkIsImageWrapper">
		<div class="gkIsImageScroll" data-amount="<?php echo $slidesCounter; ?>">
		<?php 
			$x = -1;
			foreach($this->config['image_show_data'] as $slide) : 
		?>
		
		<?php 
			if($slide->published) : 
			$x++;
		?>
		<?php 
			
			unset($path, $title, $link);
			// creating slide path
			$path = '';
			
			if($this->config['generate_thumbnails'] == 1) {
				$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Shop_and_Buy_Image::translateName($slide->image, $this->config['module_id']);
			} else {
				$path = $uri->root();
				$path .= $slide->image;
			}
			
	        if($slide->type == "k2"){
	          	$title = htmlspecialchars($this->articlesK2[$slide->artK2_id]["title"]);
	          	$text = htmlspecialchars($this->articlesK2[$slide->artK2_id]["text"]);
	            $link =  $this->articlesK2[$slide->artK2_id]["link"];
	        } else {
	            // creating slide title
				$title = htmlspecialchars(($slide->type == "text") ? $slide->name : $this->articles[$slide->art_id]["title"]);
				// creating slide text
				$text = htmlspecialchars(($slide->type == "text") ? $slide->content : $this->articles[$slide->art_id]["text"]);
				// creating slide link
				$link = ($slide->type == "text") ? $slide->url : $this->articles[$slide->art_id]["link"];	
			}
			
			$text = str_replace(array('[ampersand]', '[leftbracket]', '[rightbracket]'), array('&', '<', '>'), $text);
		?>
		
		<div class="figure<?php echo $x == 0 ? ' active': ''; ?>">
			<?php if($x == 0) : ?>
			<img class="gkIsSlide" style="z-index: <?php echo $x+1; ?>" title="<?php echo $title; ?>" src="<?php echo $path; ?>" data-url="<?php echo $link; ?>" alt="<?php echo $title; ?>" />
			<?php else : ?>
			<div class="gkIsSlide" data-zindex="<?php echo $x+1; ?>" title="<?php echo $title; ?>" data-path="<?php echo $path; ?>" data-link="<?php echo $link; ?>"></div>
			<?php endif; ?>
			
			<?php if($this->config['config']->gk_shop_and_buy->gk_shop_and_buy_show_content_block) : ?>	
			<div class="figcaption">
				<?php if($this->config['config']->gk_shop_and_buy->gk_shop_and_buy_show_title_block) : ?>	
				<h3><a href="<?php echo $link; ?>"><?php echo JString::substr($title, 0, $this->config['config']->gk_shop_and_buy->gk_shop_and_buy_title_block_length); ?></a></h3>
				<?php endif; ?>
				
				<?php if($this->config['config']->gk_shop_and_buy->gk_shop_and_buy_show_text_block) : ?>	
				<p><a href="<?php echo $link; ?>"><?php echo JString::substr($text, 0, $this->config['config']->gk_shop_and_buy->gk_shop_and_buy_text_block_length); ?></a></p>
				<?php endif; ?>
			</div>
			<?php endif; ?>
		</div>
		<?php 
			$firstFlag = true;
			endif; 
		?>
		<?php endforeach; ?>
		</div>
	</div>
	
	<?php if($this->config['config']->gk_shop_and_buy->gk_shop_and_buy_pagination) : ?>
	<ol>
		<?php for($y = 0; $y < $slidesCounter; $y++) : ?>
		<li<?php echo !$firstFlagPag ? ' class="active"' : ''; ?>><?php echo $y; ?></li>
		<?php $firstFlagPag = true; ?>
		<?php endfor; ?>
	</ol>
	<?php endif; ?>
	
	<?php if($this->config['config']->gk_shop_and_buy->gk_shop_and_buy_pagination_arrows) : ?>
	<span class="gkIsBtnPrev">&laquo;</span>
	<span class="gkIsBtnNext">&raquo;</span>
	<?php endif; ?>
</div>
