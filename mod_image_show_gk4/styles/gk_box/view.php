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

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_box">
	<?php $firstFlag = false; ?>
	<?php foreach($this->config['image_show_data'] as $slide) : ?>
		<?php if($slide->published) : ?>
			<?php
				unset($path, $title, $link);
				// creating slide path
				$path = '';
				// check if the slide have to be generated or not
				if($this->config['generate_thumbnails'] == 1) {
					$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Box_Image::translateName($slide->image, $this->config['module_id']);
				} else {
					$path = $uri->root();
					$path .= $slide->image;
				}

				if($slide->type == "k2"){
					$title = htmlspecialchars($this->articlesK2[$slide->artK2_id]["title"]);
					$link =  $this->articlesK2[$slide->artK2_id]["link"];
				} else {
					// creating slide title
					$title = htmlspecialchars(($slide->type == "text") ? $slide->name : $this->articles[$slide->art_id]["title"]);
					// creating slide link
					$link = ($slide->type == "text") ? $slide->url : $this->articles[$slide->art_id]["link"];
				}

				// img alt attribute
				$alt = htmlspecialchars($slide->alt);
			?>
			<?php if(!$firstFlag) : ?>
				<img src="<?php echo $path; ?>" class="gkIsImage active" alt="<?php echo $alt; ?>" title="<?php echo $title; ?>" data-link="<?php echo $link; ?>" />
				<?php $firstFlag = true; ?>
			<?php else : ?>
				<div
					class="gkIsSlide"
					title="<?php echo $title; ?>"
					data-alt="<?php echo $alt; ?>"
					data-path="<?php echo $path; ?>"
					data-link="<?php echo $link; ?>">
				</div>
			<?php endif; ?>
		<?php endif; ?>
	<?php endforeach; ?>
	
	<?php if($this->config['config']->gk_box->gk_box_pagination) : ?>
	<?php $firstFlag = false; ?>
	<ol class="gkIsPagination">
		<?php foreach($this->config['image_show_data'] as $slide) : ?>
			<?php if($slide->published) : ?>
				<li<?php echo !$firstFlag ? ' class="active"' : ''; ?>>
					<?php
						if($this->config['generate_thumbnails'] == 1) {
							$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Box_Image::translateName($slide->image, '-thumb-' . $this->config['module_id']);
						} else {
							$path = $uri->root();
							$path .= $slide->image;
						}
					?>
					<img src="<?php echo $path; ?>" alt="" />
				</li>
				<?php $firstFlag = true; ?>
			<?php endif; ?>
		<?php endforeach; ?>
	</ol>
	<?php endif; ?>

	<?php if($this->config['config']->gk_box->gk_box_show_text_block == '1') : ?>
	<?php $firstFlag = false; ?>
	<ol class="gkIsText">
		<?php foreach($this->config['image_show_data'] as $slide) : ?>
			<?php if($slide->published) : ?>
				<li<?php echo !$firstFlag ? ' class="active"' : ''; ?>>
					<?php
						if($slide->type == "k2"){
							$text = htmlspecialchars($this->articlesK2[$slide->artK2_id]["text"]);
						} else {
							$text = htmlspecialchars(($slide->type == "text") ? $slide->content : $this->articles[$slide->art_id]["text"]);
						}

						if(JString::strlen($text) > $this->config['config']->gk_box->gk_box_text_block_length) {
							$text = JString::substr($text, 0, $this->config['config']->gk_box->gk_box_text_block_length);
						}

						echo $text;
					?>
				</li>
				<?php $firstFlag = true; ?>
			<?php endif; ?>
		<?php endforeach; ?>
	</ol>
	<?php endif; ?>
</div>