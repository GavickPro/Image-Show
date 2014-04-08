window.addEvent("load",function(){
	setTimeout(function() {
	    $$(".gkIsWrapper-gk_creativity").each(function(el){
	        var elID = el.getProperty("id");
	        var wrapper = document.id(elID);
	        var $G = $Gavick[elID];
	        var slides = [];
	        var links = [];
	        var imagesToLoad = [];
	        var swipe_min_move = 30;
	        var swipe_max_time = 500;
	        var figcaptions = [];
	        // animation progress flag
	        $G['animating'] = false;
	        // animation variables
	        $G['animation_timer'] = false;
	        // blank flag
	        $G['blank'] = false;
	        // load the images
		    $G['actual_slide'] = 0;
		    wrapper.getElement('.figure').fade('in');
		    wrapper.getElement('.figure').addClass('active');
		    wrapper.removeClass('notloaded');
		    
		    wrapper.getElements(".gkIsSlide").each(function(elmt,i){
		        slides[i] = elmt;
		        links[i] = elmt.getProperty('data-link');
		    }); 
		    
		    slides[0].getElement('.figcaption').setStyle('opacity', 0);
		    
		    slides.each(function(slide, i) {
	    		var fig = slides[i].getElement('.figcaption');
	    		fig.inject(wrapper, 'bottom');
	    		figcaptions.push(fig);
	    		
	    		if(i == 0) {	
	    			fig.addClass('gkIsNextTextLayer');
	    			setTimeout(function() {
	    				fig.getElement('h1').addClass('loaded');
	    				fig.getElement('h2').addClass('loaded');
	    				fig.getElement('.gkLearnMore').addClass('loaded');
	    			}, 500);
	    			
	    			fig.fade('in');
	    		} else {
	    			fig.getElement('.gkLearnMore').addClass('loaded');
	    		}
		    });    
		    // handler for figcaptions array
		    $G['figcaptions'] = figcaptions;		    
		    // auto-animation
		    if($G['autoanim'] == 1) {	                	
		    	$G['animation_timer'] = setTimeout(function() {
		    		gk_creativity_autoanimate($G, wrapper, 'next', null);
		    	}, $G['anim_interval']);
		    }
		    
		    // pagination
	    	var slide_pos_start_x = 0;
	    	var slide_pos_start_y = 0;
	    	var slide_time_start = 0;
	    	var slide_swipe = false;
	    	
	    	wrapper.addEvent('touchstart', function(e) {
	    		if(!$G['animating']) {
		    		slide_swipe = true;
		    		
		    		if(e.changedTouches.length > 0) {
		    			slide_pos_start_x = e.changedTouches[0].pageX;
		    			slide_pos_start_y = e.changedTouches[0].pageY;
		    			slide_time_start = new Date().getTime();
		    		}
	    		}
	    	});
	    	
	    	wrapper.addEvent('touchmove', function(e) {
	    		if(!$G['animating']) {
		    		if(e.changedTouches.length > 0 && slide_swipe) {
		    			if(
		    				Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) > Math.abs(e.changedTouches[0].pageY - slide_pos_start_y)
		    			) {
		    				e.preventDefault();
		    			} else {
		    				slide_swipe = false;
		    			}
		    		}
	    		}
	    	});
	    	
	    	wrapper.addEvent('touchend', function(e) {
	    		if(!$G['animating']) {
		    		if(e.changedTouches.length > 0 && slide_swipe) {					
		    			if(
		    				Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) >= swipe_min_move && 
		    				new Date().getTime() - slide_time_start <= swipe_max_time
		    			) {
		    				if(e.changedTouches[0].pageX - slide_pos_start_x > 0) {
		    					$G['blank'] = true;
		    					gk_creativity_autoanimate($G, wrapper, 'prev', null);
		    				} else {
		    					$G['blank'] = true;
		    					gk_creativity_autoanimate($G, wrapper, 'next', null);
		    				}
		    			}
		    		}
	    		}
	    	});
	    	
	    	// nav buttons
	    	if(wrapper.getElement('.gkIsPrevBtn')) {
	    		wrapper.getElement('.gkIsPrevBtn').addEvent('click', function() {
	    			if(!$G['animating']) {
	    				$G['blank'] = true;
	    				gk_creativity_autoanimate($G, wrapper, 'prev', null);
	    			}
	    		});
	    		
	    		wrapper.getElement('.gkIsNextBtn').addEvent('click', function() {
	    			if(!$G['animating']) {
	    				$G['blank'] = true;
	    				gk_creativity_autoanimate($G, wrapper, 'next', null);
	    			}
	    		});
	    		
	    		wrapper.addEvent('mouseenter', function() {
	    			wrapper.addClass('hover');
	    		});
	    		
	    		wrapper.addEvent('mouseleave', function() {
	    			wrapper.removeClass('hover');
	    		});
	    	}
	    });
    }, 1000);
});

var gk_creativity_animate = function($G, wrapper, imgPrev, imgNext, prev, next) {	
	var animtype = wrapper.getProperty('data-bganim');
	//
	imgNext.addClass('animated');
	$G['animating'] = true;
	//
	if(animtype != 'opacity') {
		imgPrev.setStyle('opacity', 1);
		imgNext.setStyle('opacity', 1);
		
		if(animtype == 'vertical') {
			imgNext.setStyle('top', '100%');
		}
		
		if(animtype == 'horizontal') {
			imgNext.setStyle('left', '100%');
		}
	}
	
	var prev_prop = '';
	var prev_val = '';
	var next_prop = '';
	var next_val = '';
	
	if(animtype == 'opacity') {
		prev_prop = 'opacity';
		prev_val = '0';
		next_prop = 'opacity';
		next_val = '1';
	} else if(animtype == 'vertical') {
		prev_prop = 'top';
		prev_val = '-100%';
		next_prop = 'top';
		next_val = '0%';
	} else {
		prev_prop = 'left';
		prev_val = '-100%';
		next_prop = 'left';
		next_val = '0%';
	}
	
	new Fx.Tween(imgPrev, {
		duration: $G['anim_speed'],
		unit: (animtype != 'opacity') ? '%' : false,
		onComplete: function() {
			imgPrev.removeClass('active');
			
			if(animtype == 'vertical') {
				imgPrev.setStyle('top', '100%');
			}
			
			if(animtype == 'horizontal') {
				imgPrev.setStyle('left', '100%');
			}
		}
	}).start(prev_prop, prev_val);
	
	
	$G['figcaptions'][prev].removeClass('gkIsNextTextLayer').addClass('gkIsPrevTextLayer');
	$G['figcaptions'][prev].getElement('h1').removeClass('loaded');
	$G['figcaptions'][prev].getElement('h2').removeClass('loaded');
	
	setTimeout(function() {
		$G['figcaptions'][next].addClass('gkIsNextTextLayer');	
		$G['figcaptions'][prev].removeClass('gkIsPrevTextLayer');
		
		$G['figcaptions'][next].getElement('h1').addClass('loaded');
		$G['figcaptions'][next].getElement('h2').addClass('loaded');
	}, $G['anim_speed']);
	
	//
	new Fx.Tween(imgNext, {
		duration: $G['anim_speed'],
		unit: (animtype != 'opacity') ? '%' : false,
		onComplete: function() {			
			imgNext.addClass('active');
			$G['animating'] = false;
			
			if($G['autoanim'] == 1) {
				clearTimeout($G['animation_timer']);
				
				$G['animation_timer'] = setTimeout(function() {
					if($G['blank']) {
						$G['blank'] = false;
						clearTimeout($G['animation_timer']);
						
						$G['animation_timer'] = setTimeout(function() {
							gk_creativity_autoanimate($G, wrapper, 'next', null);
						}, $G['anim_interval']);
					} else {
						gk_creativity_autoanimate($G, wrapper, 'next', null);
					}
				}, $G['anim_interval']);
			}
		} 
	}).start(next_prop, next_val);
}; 

var gk_creativity_autoanimate = function($G, wrapper, dir, next) {
	var i = $G['actual_slide'];
	var imgs = wrapper.getElements('.figure');
	
	if(next == null) {
		next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
	}
	
	gk_creativity_animate($G, wrapper, imgs[i], imgs[next], i, next);
	$G['actual_slide'] = next;
};

document.addEvent('keyup', function(e){
    switch(e.key) {
        case 'left': // left key
        	document.getElement('.gkIsPrevBtn').fireEvent('click');
        break;
        
        case 'right': // right key
        	document.getElement('.gkIsNextBtn').fireEvent('click');
        break;
        
        default: 
        	return;
    }
});