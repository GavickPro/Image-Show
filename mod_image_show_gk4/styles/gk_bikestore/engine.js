window.addEvent("load",function(){
	(function() {
	    $$(".gkIsWrapper-gk_bikestore").each(function(el){
	        var elID = el.getProperty("id");
	        var wrapper = $(elID);
	        var $G = $Gavick[elID];
	        var slides = [];
	        var links = [];
	        var imagesToLoad = [];
	        var loadedImages = 0;
	        // animation variables
	        $G['animation_timer'] = false;
	        // blank flag
	        $G['blank'] = false;
	        // load the images
	        wrapper.getElements('.gkIsSlide').each(function(el,i){
	            var newImg = new Element('img',{
	                "title":el.getProperty('title'),
	                "class":el.getProperty('class'),
	                "style":el.getProperty('style')
	            });
	            newImg.store('num', i);
	            links[i] = el.getProperty('data-link');
	            newImg.setProperty("src",el.getProperty('data-path'));
	            imagesToLoad.push(newImg);
	            newImg.inject(el, 'after');
	            el.destroy();
	        });
	        
	        var time = (function(){
	            var process = 0;                
	            imagesToLoad.each(function(el,i){
	                if(el.complete) process++;
	            });
	            
	            if(process == imagesToLoad.length){
	                clearTimeout(time);
	                loadedImages = process;
	                (function(){
	        			wrapper.getElement('.gkIsPreloader').fade('out');
	        		}).delay(400);
	            }
	        }).periodical(200);
	        
	        var time_main = (function(){
	            if(loadedImages){
	                //$clear(time_main);
	                clearTimeout(time_main);
	                $G['actual_slide'] = 0;
	                
	
	                new Fx.Tween(wrapper, { 
	                	duration: 350,
	                	onComplete: function() {
	                		wrapper.getElement('figure').fade('in');
	                		wrapper.getElement('figure').addClass('active');
	                		
	                		var figcaption = wrapper.getElement('figure').getElement('figcaption');
	                		
	                		if(figcaption && figcaption.hasClass('top')) {
	                			new Fx.Tween(figcaption, { duration: $G['anim_speed'] / 2}).start('top', -300, 52);
	                		} else if(figcaption) {
	                			new Fx.Tween(figcaption, { duration: $G['anim_speed'] / 2 }).start('bottom', -300, 52);
	                		}
	                		 
	                		wrapper.setStyle('height', 'auto');
	                	}
	                }).start('height', wrapper.getElement('figure').getSize().y);
	                wrapper.addClass('loaded');
	                
	                wrapper.getElements(".gkIsSlide").each(function(elmt,i){
	                    slides[i] = elmt;
	                    if($G['slide_links']){
	                        elmt.addEvent("click", function(e){ 
	                            window.location = links[$(e.target).retrieve('num')]; 
	                        });
	                        elmt.setStyle("cursor", "pointer");
	                    }
	                });               
	                
	                // auto-animation
	                if($G['autoanim'] == 1) {
	                	(function() {
	                		gk_bikestore_autoanimate($G, wrapper, 'next');
	                	}).delay($G['anim_interval']);
	                }
	                
	                // prev / next
	                wrapper.getElement('.nextSlide').addEvent('click', function() {
	                	$G['blank'] = true;
	                	gk_bikestore_autoanimate($G, wrapper, 'next', null); 
	                });
	                
	                wrapper.getElement('.prevSlide').addEvent('click', function() {
	                	$G['blank'] = true;
	                	gk_bikestore_autoanimate($G, wrapper, 'prev', null);
	                });
	            }
	        }).periodical(250);
	    });
    }).delay(2000);
});

var gk_bikestore_animate = function($G, wrapper, imgPrev, imgNext) {	
	imgPrev.set('tween', {
		duration: $G['anim_speed'],
		onComplete: function() {
			this.element.setProperty('class', '');
		}
	});
	
	var figcaptionNext = imgNext.getElement('figcaption');
	if(figcaptionNext && figcaptionNext.hasClass('top')) {
		figcaptionNext.setStyle('top', -300);
	} else if(figcaptionNext) {
		figcaptionNext.setStyle('bottom', -300);
	}
	
	imgNext.set('tween', {
		duration: $G['anim_speed'],
		onComplete: function() {			
			imgNext.setProperty('class', 'active');
			var figcaption = imgNext.getElement('figcaption');
			if(figcaption && figcaption.hasClass('top')) {
				new Fx.Tween(figcaption, { duration: $G['anim_speed'] / 2}).start('top', 52);
			} else if(figcaption) {
				new Fx.Tween(figcaption, { duration: $G['anim_speed'] / 2 }).start('bottom', 52);
			}
			
			if($G['autoanim'] == 1) {
				clearTimeout($G['animation_timer']);
				
				$G['animation_timer'] = setTimeout(function() {
					if($G['blank']) {
						$G['blank'] = false;
						clearTimeout($G['animation_timer']);
						
						$G['animation_timer'] = setTimeout(function() {
							gk_bikestore_autoanimate($G, wrapper, 'next', null);
						}, $G['anim_interval']);
					} else {
						gk_bikestore_autoanimate($G, wrapper, 'next', null);
					}
				}, $G['anim_interval']);
			}
		} 
	});

	var figcaptionPrev = imgPrev.getElement('figcaption');
	if(figcaptionPrev && figcaptionPrev.hasClass('top')) {
		new Fx.Tween(figcaptionPrev, { duration: $G['anim_speed'] / 2 }).start('top', -300);
	} else if(figcaptionPrev) {
		new Fx.Tween(figcaptionPrev, { duration: $G['anim_speed'] / 2 }).start('bottom', -300);
	}

	imgNext.setProperty('class', 'animated');
	imgPrev.fade('out');
	imgNext.fade('in');
}; 

var gk_bikestore_autoanimate = function($G, wrapper, dir, nextSlide) {
	var i = $G['actual_slide'];
	var imgs = wrapper.getElements('figure');
	var next = nextSlide;
	
	if(nextSlide == null) {
		next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
	}
	
	gk_bikestore_animate($G, wrapper, imgs[i], imgs[next]);
	$G['actual_slide'] = next;
};