<?php

/**
* @author: GavickPro
* @copyright: 2008-2012
**/
	
// no direct access
defined('_JEXEC') or die('Restricted access');

class GKIS_Startup_Image extends GKIS_Image {
	// Creating thumbnails
	function createThumbnail($path, $config, $width, $image_bg, $image_stretch, $quality) {
		if(GKIS_Image::checkCache(GKIS_Image::translateName($path,$config['module_id']), $config['last_modification'], $config['module_id'])){
			return TRUE;	
		}else{
			// importing classes
			jimport('joomla.filesystem.file');
			jimport('joomla.filesystem.folder');
			jimport('joomla.filesystem.path');
			//script configuration - increase memory limit to value specified by user - default 128MB
			ini_set('memory_limit', $config['memory_limit']);
			// cache dir
			$cache_dir = JPATH_ROOT.DS.'modules'.DS.'mod_image_show_gk4'.DS.'cache'.DS;
			// file path
			$file = GKIS_Image::getRealPath($path);
			// filename
			$filename = GKIS_Image::translateName($path,$config['module_id']);
			// Getting informations about image
			if(is_file($file)){
				$imageData = getimagesize($file);
				// loading image depends from type of image		
				if($imageData['mime'] == 'image/jpeg' || $imageData['mime'] == 'image/pjpeg' || $imageData['mime'] == 'image/jpg') $imageSource = @imagecreatefromjpeg($file);
				elseif($imageData['mime'] == 'image/gif') $imageSource = @imagecreatefromgif($file);
				else $imageSource = @imagecreatefrompng($file); 
				// here can be exist an error when image is to big - then class return blank page	
				// setting image size in variables
				$imageSourceWidth = imagesx($imageSource);
				$imageSourceHeight = imagesy($imageSource);
				// calculate the height
				$height = ($width/$imageSourceWidth) * $imageSourceHeight;
				// Creating blank canvas
                $imageBG = imagecreatetruecolor($width, $height);
				// If image is JPG or GIF
				if($imageData['mime'] == 'image/jpeg' || $imageData['mime'] == 'image/pjpeg' || $imageData['mime'] == 'image/jpg' || $imageData['mime'] == 'image/gif') {
					// when bg is set to transparent - use black background
					if($image_bg == 'transparent'){
						$bgColorR = 0;
						$bgColorG = 0;
						$bgColorB = 0;				
					}else{ // in other situation - translate hex to RGB
						$bg = $image_bg;
						if(strlen($bg) == 4) $bg = $bg[0].$bg[1].$bg[1].$bg[2].$bg[2].$bg[3].$bg[3];
						$hex_color = strtolower(trim($bg,'#;&Hh'));
			  			$bg = array_map('hexdec',explode('.',wordwrap($hex_color, ceil(strlen($hex_color)/3),'.',1)));
						$bgColorR = $bg[0];
						$bgColorG = $bg[1];
						$bgColorB = $bg[2];
					}
					// Creating color
					$rgb = imagecolorallocate($imageBG, $bgColorR, $bgColorG, $bgColorB);
					// filling canvas with new color
					imagefill($imageBG, 0, 0, $rgb);	
				}else {// for PNG images	
                    $imageBG = imagecreatetruecolor($width, $height);
					// enable transparent background 
					if($image_bg == 'transparent'){
						// create transparent color
						$rgb = imagecolorallocatealpha($imageBG, 0, 0, 0, 127);
					}else {// create normal color
						$bg = $image_bg;
						// translate hex to RGB
						$hex_color = strtolower(trim($bg,'#;&Hh'));
			  			$bg = array_map('hexdec',explode('.',wordwrap($hex_color, ceil(strlen($hex_color)/3),'.',1)));
						// creating color
						$rgb = imagecolorallocate($imageBG, $bg[0], $bg[1], $bg[2]);
					}
					// filling the canvas
					imagefill($imageBG, 0, 0, $rgb);
					// enabling transparent settings for better quality
					imagealphablending($imageBG, false);
					imagesavealpha($imageBG, true);
				}
				// when stretching is disabled		
				if(!$image_stretch){
                    // calculate ratio for first scaling
					$ratio = ($imageSourceWidth > $imageSourceHeight) ? $width/$imageSourceWidth : $height/$imageSourceHeight;
					// calculate new image size
					$imageSourceNWidth = $imageSourceWidth * $ratio;
					$imageSourceNHeight = $imageSourceHeight * $ratio;
					// calculate ratio for second scaling
					if($width > $height){					
						if($imageSourceNHeight > $height){
							$ratio2 = $height / $imageSourceNHeight;
							$imageSourceNHeight *= $ratio2;
							$imageSourceNWidth *= $ratio2;
						}
					}else{
						if($imageSourceNWidth > $width){
							$ratio2 = $width / $imageSourceNWidth;
							$imageSourceNHeight *= $ratio2;
							$imageSourceNWidth *= $ratio2;
						}
					}
					// setting position of putting thumbnail on canvas
					$base_x = floor(($width - $imageSourceNWidth) / 2);
					$base_y = floor(($height - $imageSourceNHeight) / 2);
				} else { // when stretching is disabled
					$imageSourceNWidth = $width;
					$imageSourceNHeight = $height;
					$base_x = 0;
					$base_y = 0;
				}
				// copy image	
				imagecopyresampled($imageBG, $imageSource, $base_x, $base_y, 0, 0, $imageSourceNWidth, $imageSourceNHeight, $imageSourceWidth, $imageSourceHeight);
				// save image depends from MIME type	
				if($imageData['mime'] == 'image/jpeg' || $imageData['mime'] == 'image/pjpeg' || $imageData['mime'] == 'image/jpg') imagejpeg($imageBG,$cache_dir.$filename, $quality);
				elseif($imageData['mime'] == 'image/gif') imagegif($imageBG, $cache_dir.$filename); 
				else imagepng($imageBG, $cache_dir.$filename);
				return TRUE;
			}else{
				return FALSE;
			}	
		}
	}	
}

// EOF