window.addEvent("load",function(){
    $$(".gkIsWrapper-gk_shop_and_buy").each(function(el){
        var elID = el.getProperty("id");
        var wrapper = document.id(elID);
        var $G = $Gavick[elID];
        var slides = [];
        var imagesToLoad = [];
        var loadedImages = 0;
        // animation variables
        $G['animation_timer']= false;
        $G['actual_slide'] = 0;
        $G['blank'] = false;
        $G['progress'] = false;
        $G['scrollarea'] = wrapper.getElement('.gkIsImageScroll');
        // load the images
        wrapper.getElements('div.gkIsSlide').each(function(el,i){
            var newImg = new Element('img',{
                "title":el.getProperty('title'),
                "class":el.getProperty('class'),
                "style":el.getProperty('style')
            });
            newImg.setProperty('data-url', el.getProperty('data-link'));
            newImg.setProperty("src", el.getProperty('data-path'));
            imagesToLoad.push(newImg);
            newImg.inject(el, 'after');
            el.destroy();
        });
        
        var time = (function(){
            var process = 0;                
            imagesToLoad.each(function(el,i) {
                if(el.complete) process++;
            });
            
            if(process === imagesToLoad.length) {
                clearInterval(time);
                loadedImages = process;
                (function(){
        			wrapper.getElement('.gkIsPreloader').fade('out');
        		}).delay(400);
            }
        }).periodical(200);
        
        var time_main = (function() {
            if(loadedImages){
                clearInterval(time_main);
                
                wrapper.getElements(".gkIsSlide").each(function(elmt,i){
                    slides[i] = elmt;
                    if($G['slide_links']){
                        elmt.addEvent("click", function(e){ 
                            window.location = e.target.getProperty('data-url'); 
                        });
                        elmt.setStyle("cursor", "pointer");
                    }
                });
                
                // pagination
                if(wrapper.getElement('ol')) {
                    wrapper.getElements('ol li').each(function(btn, i) {
                    	btn.addEvent('click', function() {
                    		if(i != $G['actual_slide']) {
                    			$G['blank'] = true;
                    			gk_shop_and_buy_autoanimate($G, wrapper, 'next', i);
                    		}		
                    	});
                    });
                }
                //
                var initText = wrapper.getElement('.figcaption');
                if(initText) { initText.setStyle('margin-top', -0.5 * initText.getSize().y + "px"); }
                // buttons 
                if(wrapper.getElement('.gkIsBtnPrev')) {
                	wrapper.getElement('.gkIsBtnPrev').addEvent('click', function() {
                		$G['blank'] = true;
                		gk_shop_and_buy_autoanimate($G, wrapper, 'prev', null);
                	});
                	
                	wrapper.getElement('.gkIsBtnNext').addEvent('click', function() {
                		$G['blank'] = true;
                		gk_shop_and_buy_autoanimate($G, wrapper, 'next', null);
                	});
                }
                
                wrapper.addEvent('mouseenter', function() {
                	wrapper.addClass('hover');
                });
                
                wrapper.addEvent('mouseleave', function() {
                	wrapper.removeClass('hover');
                });
                
                // auto animation
                if($G['autoanim'] == 1) {
                	$G['animation_timer'] = setTimeout(function() {
                	 	gk_shop_and_buy_autoanimate($G, wrapper, 'next');
                	}, $G['anim_interval']);
                }
                
                // pagination
		    	var slide_pos_start_x = 0;
		    	var slide_pos_start_y = 0;
		    	var slide_time_start = 0;
		    	var slide_swipe = false;
		    	
		    	wrapper.addEvent('touchstart', function(e) {
		    		slide_swipe = true;
		    		
		    		if(e.changedTouches.length > 0) {
		    			slide_pos_start_x = e.changedTouches[0].pageX;
		    			slide_pos_start_y = e.changedTouches[0].pageY;
		    			slide_time_start = new Date().getTime();
		    		}
		    	});
		    	
		    	wrapper.addEvent('touchmove', function(e) {
		    		if(e.changedTouches.length > 0 && slide_swipe) {
		    			if(
		    				Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) > Math.abs(e.changedTouches[0].pageY - slide_pos_start_y)
		    			) {
		    				e.preventDefault();
		    			} else {
		    				slide_swipe = false;
		    			}
		    		}
		    	});
		    	
		    	wrapper.addEvent('touchend', function(e) {
		    		if(e.changedTouches.length > 0 && slide_swipe) {					
		    			if(
		    				Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) >= 80 && 
		    				new Date().getTime() - slide_time_start <= 500
		    			) {
		    				if(e.changedTouches[0].pageX - slide_pos_start_x > 0) {
		    					$G['blank'] = true;
		    					gk_shop_and_buy_autoanimate($G, wrapper, 'prev', null);
		    				} else {
		    					$G['blank'] = true;
		    					gk_shop_and_buy_autoanimate($G, wrapper, 'next', null);
		    				}
		    			}
		    		}
		    	});
            }
        }).periodical(250);
    });
});

var gk_shop_and_buy_animate = function($G, wrapper, imgPrev, imgNext, dir, next) {	
	var prevText = imgPrev.getElement('.figcaption');
	var nextText = imgNext.getElement('.figcaption');
	
	if(prevText) {
		prevText.setStyle('margin-top', -0.5 * prevText.getSize().y + "px");
		nextText.setStyle('margin-top', -0.5 * nextText.getSize().y + "px");
		
		if(dir == 'next') {
			//
			new Fx.Tween(imgPrev.getElement('img'), {
				duration: $G['anim_speed'],
				property: 'margin-left',
				transition: Fx.Transition.linear,
				onComplete: function() {
					setTimeout(function() {
						imgPrev.getElement('img').setStyle('margin-left', 0);
					}, 100);
				}
			}).start(0, 300);
			//
			new Fx.Tween(imgNext.getElement('img'), {
				duration: $G['anim_speed'],
				property: 'margin-left',
				transition: Fx.Transition.linear,
				onComplete: function() {
					setTimeout(function() {
						imgNext.getElement('img').setStyle('margin-left', 0);
					}, 100);
				}
			}).start(-300, 0);
		} else {
			//
			new Fx.Tween(imgPrev.getElement('img'), {
				duration: $G['anim_speed'],
				property: 'margin-left',
				transition: Fx.Transition.linear,
				onComplete: function() {
					setTimeout(function() {
						imgPrev.getElement('img').setStyle('margin-left', 0);
					}, 100);
				}
			}).start(0, -300);
			//
			new Fx.Tween(imgNext.getElement('img'), {
				duration: $G['anim_speed'],
				property: 'margin-left',
				transition: Fx.Transition.linear,
				onComplete: function() {
					setTimeout(function() {
						imgNext.getElement('img').setStyle('margin-left', 0);
					}, 100);
				}
			}).start(300, 0);
		}
	}
	//
	imgPrev.removeClass('active');
	imgNext.addClass('active');
	//
	new Fx.Tween(
		$G['scrollarea'], 
		{ 
			duration: $G['anim_speed'], 
			property: 'margin-left', 
			unit: '%',
			onComplete: function() {
				$G['progress'] = false;
				if($G['autoanim'] == 1) {
					clearTimeout($G['animation_timer']);
		
					$G['animation_timer'] = setTimeout(function() {
						if($G['blank']) {
							$G['blank'] = false;
							clearTimeout($G['animation_timer']);
		
							$G['animation_timer'] = setTimeout(function() {
								gk_shop_and_buy_autoanimate($G, wrapper, 'next', null);
							}, $G['anim_interval']);
						} else {
							gk_shop_and_buy_autoanimate($G, wrapper, 'next', null);
						}
					}, $G['anim_interval']);
				} 
			}
		}
	).start(next * -1 * 100);
}; 

var gk_shop_and_buy_autoanimate = function($G, wrapper, dir, nextSlide) {
	if(!$G['progress']) {
		$G['progress'] = true;
		var i = $G['actual_slide'];
		var imgs = wrapper.getElements('.figure');
		var next = nextSlide;
		
		if(nextSlide == null) {
			next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
		}
		
		gk_shop_and_buy_animate($G, wrapper, imgs[i], imgs[next], ((next > $G['actual_slide']) ? 'next' : 'prev'), next);
		$G['actual_slide'] = next;
		wrapper.getElements('ol li').setProperty('class', '');
		wrapper.getElements('ol li')[next].setProperty('class', 'active');
	}
};