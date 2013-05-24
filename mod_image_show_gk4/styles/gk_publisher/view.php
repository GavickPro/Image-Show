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

?>

<div id="gkIs-<?php echo $this->config['module_id'];?>" class="gkIsWrapper-gk_publisher">
	<div class="gkIsPreloader"></div>
	
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
			// check if the slide have to be generated or not
			if($this->config['generate_thumbnails'] == 1) {
				$path = $uri->root().'modules/mod_image_show_gk4/cache/'.GKIS_Publisher_Image::translateName($slide->image, $this->config['module_id']);
			} else {
				$path = $this->config['image_show_data'][$x]->image;
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
		?>
		<figure<?php echo !$firstFlag ? ' class="active"' : ''; ?>>
			<div class="gkIsSlide" style="z-index: <?php echo $x+1; ?>;" title="<?php echo $title; ?>"><?php echo $path; ?><a href="<?php echo $link; ?>">link</a></div>
			<?php if($this->config['config']->gk_publisher->gk_publisher_show_content_block) : ?>	
			<?php 
				$additional_class = '';
			
				if($this->config['config']->gk_publisher->gk_publisher_pagination_position == $this->config['config']->gk_publisher->gk_publisher_title_block_position) {
					$additional_class = ' contains-pagination';
				}
			?>
			<figcaption<?php echo ' class="'. $this->config['config']->gk_publisher->gk_publisher_title_block_position . $additional_class .'"'; ?>>
				<?php if($this->config['config']->gk_publisher->gk_publisher_show_title_block) : ?>	
				<h3><a href="<?php echo $link; ?>"><?php echo JString::substr($title, 0, $this->config['config']->gk_publisher->gk_publisher_title_block_length); ?></a></h3>
				<?php endif; ?>
				
				<?php if($this->config['config']->gk_publisher->gk_publisher_show_text_block) : ?>	
				<p><a href="<?php echo $link; ?>"><?php echo JString::substr($text, 0, $this->config['config']->gk_publisher->gk_publisher_text_block_length); ?></a></p>
				<?php endif; ?>
			</figcaption>
			<?php endif; ?>
		</figure>
	<?php 
		$firstFlag = true;
		endif; 
	?>
	<?php endforeach; ?>
	
	<?php if($this->config['config']->gk_publisher->gk_publisher_pagination) : ?>
	<ol<?php echo ' class="'.$this->config['config']->gk_publisher->gk_publisher_pagination_position.'"'; ?>>
		<?php for($y = 0; $y < count($this->config['image_show_data']); $y++) : ?>
		<?php if($slide->published) : ?>
		<li<?php echo !$firstFlagPag ? ' class="active"' : ''; ?>><?php echo $y; ?></li>
		<?php 
			$firstFlagPag = true;
			endif; 
		?>
		<?php endfor; ?>
	</ol>
	<?php endif; ?>
</div>