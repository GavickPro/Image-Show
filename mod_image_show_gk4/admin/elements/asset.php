<?php

defined('JPATH_BASE') or die;
if(!defined('DS')){
   define('DS',DIRECTORY_SEPARATOR);
}

jimport('joomla.form.formfield');

JHtml::_('behavior.framework', true);

class JFormFieldAsset extends JFormField {
        protected $type = 'Asset';

        protected function getInput() {
                $doc = JFactory::getDocument();
                $doc->addStyleSheet(JURI::root().$this->element['path'].'style.css');  
                
                return '<script src="'.JURI::root().$this->element['path'].'script.js"></script>';
        }
}