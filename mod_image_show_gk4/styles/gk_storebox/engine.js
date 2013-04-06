window.addEvent("load",function(){
	(function() {
	    $$(".gkIsWrapper-gk_storebox").each(function(el){
	        var elID = el.getProperty("id");
	        var wrapper = document.id(elID);
	        var $G = $Gavick[elID];
	        var slides = [];
	        var links = [];
	        var imagesToLoad = [];
	        var loadedImages = 0;
	        var swipe_min_move = 30;
	        var swipe_max_time = 500;
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
	            links[i] = el.getElement('a').getProperty('href');
	            el.getElement('a').destroy();
	            newImg.setProperty("src",el.innerHTML);
	            imagesToLoad.push(newImg);
	            newImg.injectAfter(el);
	            el.destroy();
	        });
	        
	        var time = (function(){
	            var process = 0;                
	            imagesToLoad.each(function(el,i){
	                if(el.complete) process++;
	            });
	            
	            if(process == imagesToLoad.length){
	                $clear(time);
	                loadedImages = process;
	                (function(){
	        			wrapper.getElement('.gkIsPreloader').fade('out');
	        		}).delay(400);
	            }
	        }).periodical(200);
	        
	        var time_main = (function(){
	            if(loadedImages){
	                $clear(time_main);
	                $G['actual_slide'] = 0;
	                
	                new Fx.Tween(wrapper, { 
	                	duration: 350,
	                	onComplete: function() {
	                		wrapper.getElement('figure').fade('in');
	                		wrapper.getElement('figure').addClass('active');
	                		wrapper.setStyle('height', 'auto');
	                	}
	                }).start('height', wrapper.getElement('figure').getSize().y);
	                
	                wrapper.addClass('loaded');
	                
	                wrapper.getElements(".gkIsSlide").each(function(elmt,i){
	                    slides[i] = elmt;
	                }); 
	                
	                setTimeout(function() {
		                var initfig = slides[0].getParent().getElement('figcaption');
		                if(initfig) {
		                	initfig.set('morph', { duration: 250 });
		                	initfig.morph({
		                		'margin-top': [50, 0],
		                		'opacity': [0, 1]
		                	});
		                }
	                }, 250);
	                
	                if($G['slide_links']){
	                    wrapper.getElement('.gkIsOverlay').addEvent("click", function(e){ 
	                        window.location = links[$G['actual_slide']]; 
	                    });
	                    wrapper.getElement('.gkIsOverlay').setStyle('cursor', 'pointer');
	                }              
	                
	                // auto-animation
	                if($G['autoanim'] == 1) {	                	
	                	$G['animation_timer'] = setTimeout(function() {
	                		gk_storebox_autoanimate($G, wrapper, 'next', null);
	                	}, $G['anim_interval']);
	                }
	                
	                // prev / next
	                if(wrapper.getElement('.gkIsPrev')) {
	               		wrapper.getElement('.gkIsPrev').addEvent('click', function(e) {
	               			e.stop();
	                		$G['blank'] = true;
	                		gk_storebox_autoanimate($G, wrapper, 'prev', null);
	                	});
	                	
	                	wrapper.getElement('.gkIsNext').addEvent('click', function(e) {
	                		e.stop();
	                		$G['blank'] = true;
	                		gk_storebox_autoanimate($G, wrapper, 'next', null);
	                	});
	                	
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
	                				Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) >= swipe_min_move && 
	                				new Date().getTime() - slide_time_start <= swipe_max_time
	                			) {
	                				if(e.changedTouches[0].pageX - slide_pos_start_x > 0) {
	                					$G['blank'] = true;
	                					gk_storebox_autoanimate($G, wrapper, 'prev', null);
	                				} else {
	                					$G['blank'] = true;
	                					gk_storebox_autoanimate($G, wrapper, 'next', null);
	                				}
	                			}
	                		}
	                	});
	                }
	                
	                // events
	                wrapper.addEvents({
	                	"mouseenter": function() {
	                		wrapper.addClass('hover');
	                	},
	                	"mouseleave": function() {
	                		wrapper.removeClass('hover');
	                	}
	                });
	            }
	        }).periodical(250);
	    });
    }).delay(2000);
});

var gk_storebox_animate = function($G, wrapper, imgPrev, imgNext) {	
	var prevfig = imgPrev.getElement('figcaption');
	//
	if(prevfig) {
		prevfig.set('morph', { duration: 150 });
		prevfig.morph({
			'margin-top': [0, 50],
			'opacity': [1, 0]
		});
	}
	//
	imgNext.setProperty('class', 'animated');
	//imgPrev.fade('out');
	new Fx.Tween(imgPrev, {
		duration: $G['anim_speed'],
		onComplete: function() {
			imgPrev.setProperty('class', '');
		}
	}).start('opacity', 0);
	//imgNext.fade('in');
	new Fx.Tween(imgNext, {
		duration: $G['anim_speed'],
		onComplete: function() {			
			imgNext.setProperty('class', 'active');
			var nextfig = imgNext.getElement('figcaption');
			if(nextfig) {
				nextfig.set('morph', { duration: 150 });
				nextfig.morph({
					'margin-top': [50, 0],
					'opacity': [0, 1]
				});
			}
			if($G['autoanim'] == 1) {
				clearTimeout($G['animation_timer']);
				
				$G['animation_timer'] = setTimeout(function() {
					if($G['blank']) {
						$G['blank'] = false;
						clearTimeout($G['animation_timer']);
						
						$G['animation_timer'] = setTimeout(function() {
							gk_storebox_autoanimate($G, wrapper, 'next', null);
						}, $G['anim_interval']);
					} else {
						gk_storebox_autoanimate($G, wrapper, 'next', null);
					}
				}, $G['anim_interval']);
			}
		} 
	}).start('opacity', 1);
}; 

var gk_storebox_autoanimate = function($G, wrapper, dir, next) {
	var i = $G['actual_slide'];
	var imgs = wrapper.getElements('figure');
	
	if(next == null) {
		next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
	}
	
	gk_storebox_animate($G, wrapper, imgs[i], imgs[next]);
	$G['actual_slide'] = next;
};