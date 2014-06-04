window.addEvent("load",function(){
	setTimeout(function() {
	    $$(".gkIsWrapper-gk_university").each(function(el){
	        var elID = el.getProperty("id");
	        var wrapper = document.id(elID);
	        var $G = $Gavick[elID];
	        var slides = [];
	        var links = [];
	        var imagesToLoad = [];
	        var swipe_min_move = 30;
	        var swipe_max_time = 500;
	        // animation variables
	        $G['animation_timer'] = false;
	        // blank flag
	        $G['blank'] = false;
	        // load the images
	        wrapper.getElements('figure').each(function(el,i){
	            var newImg = new Element('img',{
	                "title": el.getProperty('data-title'),
	                "class": 'gkIsSlide',
	                "style": 'z-index: ' + el.getProperty('data-zindex') + ';',
	                "src": el.getProperty('data-url')
	            });
	            links[i] = el.getProperty('data-link');
	            imagesToLoad.push(newImg);
	            newImg.inject(el, 'top');
	        });
	        //
	        var time = setInterval(function(){
	            var process = 0;                
	            imagesToLoad.each(function(el,i){
	                if(el.complete) process++;
	            });
	            
	            if(process == imagesToLoad.length){
	                clearInterval(time);
					
					wrapper.getElements('figure').each(function(fig, i) {
						var img = fig.getElement('img');
						var newDiv = new Element('div', {
							'class': 'gkIsSlide',
							'style': img.getProperty('style'),
							'title': img.getProperty('title')
						});
						newDiv.setStyle('background-image', "url('" + img.getProperty('src') + "')");
						fig.setStyle('opacity', 0);
						newDiv.inject(img, 'before');
						img.dispose();
					});
					
	                setTimeout(function(){
	        			wrapper.addClass('loaded');
	        			wrapper.getElement('.gkIsPreloader').set('tween', { duration: 'long' });
	        			wrapper.getElement('.gkIsPreloader').tween('opacity', 0);
        				
        				wrapper.getElements('figure').each(function(fig, i) {
        					fig.setStyle('opacity', 1);
        				});
        				
        				setTimeout(function() {
        					wrapper.getElement('.gkIsPreloader').dispose();
        				}, 1000);
        				
        				wrapper.getElement('figure').setStyle('opacity', 1);
        				wrapper.getElement('figure').addClass('active');
        				
        				if(
        					wrapper.getProperty('data-one-slide') != 'true' &&
        					wrapper.getElement('figure').getElement('figcaption')
        				) {
        					wrapper.getElement('figure').getElement('.gkProgressBar').addClass('active');
        				}
	        		}, 400);
	        		
        		    $G['actual_slide'] = 0;
        		    
        		    wrapper.getElements(".gkIsSlide").each(function(elmt,i){
        		        slides[i] = elmt;
        		    });
        		    
        		    setTimeout(function() {
        		        var initfig = slides[0].getParent().getElement('figcaption');
        		        if(initfig) {
        		        	initfig.set('morph', { duration: 250, unit: '%' });
        		        	
    		        		initfig.morph({
    		        			'opacity': [0, 1]
    		        		});
        		        }
        		    }, 250);
        		    
        		    if($G['slide_links']){
        		        wrapper.getElements('.gkIsSlide').addEvent("click", function(e){ 
        		            window.location = links[$G['actual_slide']]; 
        		        });
        		        wrapper.getElements('.gkIsSlide').setStyle('cursor', 'pointer');
        		    }
        		    
        		    // auto-animation	
        		    if(wrapper.getProperty('data-one-slide') != 'true') {                	
    		    		$G['animation_timer'] = setTimeout(function() {
    		    			gk_university_autoanimate($G, wrapper, 'next', null);
    		    		}, $G['anim_interval']);
    		    	}
	            }
	        }, 500);
	    });
    }, 1000);
});

var gk_university_animate = function($G, wrapper, imgPrev, imgNext) {	
	var prevfig = imgPrev.getElement('figcaption');
	//
	if(prevfig) {
		prevfig.set('morph', { duration: 150, unit: '%' });
		prevfig.morph({
			'opacity': [1, 0]
		});
	}
	//
	imgNext.setProperty('class', 'animated');
	//imgPrev.fade('out');
	setTimeout(function() {
		new Fx.Tween(imgPrev, {
			duration: $G['anim_speed'],
			onComplete: function() {
				imgPrev.setProperty('class', '');
				if(imgPrev.getElement('.gkProgressBar')) {
					imgPrev.getElement('.gkProgressBar').removeClass('active');
				}
			}
		}).start('opacity', 0);
	}, $G['anim_speed'] / 2);
	
	new Fx.Tween(imgNext, {
		duration: $G['anim_speed'],
		onComplete: function() {			
			imgNext.setProperty('class', 'active');
			var nextfig = imgNext.getElement('figcaption');
			if(nextfig) {
				nextfig.set('morph', { duration: 150, unit: '%' });
				
				nextfig.morph({
					'opacity': [0, 1]
				});
			}

			clearTimeout($G['animation_timer']);
			
			if(!(
	    		wrapper.getProperty('data-no-loop') == 'true' && 
	    		$G['actual_slide'] == wrapper.getElements('figure').length - 1
	    	)) {
				$G['animation_timer'] = setTimeout(function() {
					if($G['blank']) {
						$G['blank'] = false;
						clearTimeout($G['animation_timer']);
						
						$G['animation_timer'] = setTimeout(function() {
							gk_university_autoanimate($G, wrapper, 'next', null);
						}, $G['anim_interval']);
					} else {
						gk_university_autoanimate($G, wrapper, 'next', null);
					}
				}, $G['anim_interval']);
	    	} else {
	    		setTimeout(function() {
		    		if(wrapper.getElement('figure')) {
		    			wrapper.getElements('.gkProgressBar').getParent().fade('out');
		    		}
	    		}, $G['anim_interval']);
	    	}
		} 
	}).start('opacity', 1);
}; 

var gk_university_autoanimate = function($G, wrapper, dir, next) {
	var i = $G['actual_slide'];
	var imgs = wrapper.getElements('figure');
	
	if(next == null) {
		next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
	}
	
	gk_university_animate($G, wrapper, imgs[i], imgs[next]);
	$G['actual_slide'] = next;
};
