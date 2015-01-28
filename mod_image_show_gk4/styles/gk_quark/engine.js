(function($) {
	$(document).ready(function(){
	    $(".gkIsWrapper-gk_quark").each(function(i, wrapper){
	        var slideshow = new gkQuarkIS($(wrapper));
	    });
	    
	    function gkQuarkIS(wrapper) {
	    	this.slides = wrapper.find('figure');
	    	this.current_slide = 0;
	    	this.animation_timer = false;
	    	this.swipe_min_move = 30;
	    	this.swipe_max_time = 500;
	    	this.slider_click = false;
	    	this.breakpoints = [0];
	    	this.breakpoints_inc = 0;
	    	this.breakpoint_limiter = 0;
	    	//
	    	this.pagination = wrapper.find('.gkIsQuarkPagination');
	    	
	    	if(this.pagination.length) {
	    		this.pagination_items = this.pagination.find('li');
	    	}
	    	// helper handler
	    	var $this = this;
	    	// generating breakpoints;
	    	this.slider = wrapper.find('.gkSlider');
	    	
	    	if(this.slider.length) {
	    		this.slider_bar = wrapper.find('.gkSliderBar');
	    		this.slider_button = wrapper.find('.gkSliderButton');
	    	
		    	var breakpoints_amount = this.slides.length - 1;
		    	this.breakpoints_inc = 100 / breakpoints_amount;
		    	this.breakpoint_limiter = this.breakpoints_inc / 2;
		    	
		    	for(var i = 1, l = breakpoints_amount; i <= l; i++) {
		    		this.breakpoints.push(this.breakpoints_inc * i);
		    	}
	    	
		    	wrapper.mousemove(function(e) {
		    		e.preventDefault();
		    		if($this.slider_click) {
		    			var x = e.pageX - $this.slider.offset().left;
		    			var result = (x / $this.slider.outerWidth()) * 100;
		    			if(result >= 0 && result <= 100) {
		    				$this.slider_button.css('left', result + "%");
		    				$this.slider_bar.css('width', result + "%");
		    				var next_slide = 0;
		    				while(result >= $this.breakpoints[next_slide] + $this.breakpoint_limiter) {
		    					next_slide++;
		    				}
		    				$this.anim(next_slide);
		    			}
		    		}
		    	});
		    	
		    	this.slider.mousedown(function(e) {
		    		e.preventDefault();
		    		$this.slider_click = true;
		    	});
		    	
		    	wrapper.mouseup(function(e) {
		    		e.preventDefault();
		    		$this.slider_click = false;
		    		$this.slider_button.css('left', ($this.breakpoints_inc * $this.current_slide) + "%");
		    		$this.slider_bar.css('width', ($this.breakpoints_inc * $this.current_slide) + "%");
		    	});
	    	}
	    	
	    	wrapper.find('figure img').each(function(i, img) {
	    		$(img).click(function() {
	    			window.location.href = $(img).attr('data-link');
	    		});
	    	});
	    	
	    	this.anim = function(next_slide) {
	    		if(next_slide !== this.current_slide) {
	    			this.slides.removeClass('gk-prev-prev');
	    			this.slides.removeClass('gk-prev');
	    			this.slides.removeClass('gk-current');
	    			this.slides.removeClass('gk-next');
	    			
	    			for(var i = 0, l = this.slides.length; i < l; i++) {
	    				switch(i) {
	    					case next_slide - 2:
	    						$(this.slides[i]).addClass('gk-prev-prev');
	    						break;
	    					case next_slide - 1:
	    						$(this.slides[i]).addClass('gk-prev');
	    						break;
	    					case next_slide:
	    						$(this.slides[i]).addClass('gk-current');
	    						break;
	    					case next_slide + 1:
	    						$(this.slides[i]).addClass('gk-next');
	    						break;
	    				}
	    			}
	    			
	    			if($this.pagination.length) {
	    				this.pagination_items.removeClass('active');
	    				$(this.pagination_items[next_slide]).addClass('active');
	    			}
	    			
	    			if($this.slider.length && !$this.slider_click) {
	    				$this.slider_button.css('left', ($this.breakpoints_inc * next_slide) + "%");
	    				$this.slider_bar.css('width', ($this.breakpoints_inc * next_slide) + "%");
	    			}
	    		}
	    		
	    		this.current_slide = next_slide;
	    	};
	    	
	    	this.autoanim = function() {
	    		if(!$this.slider_click) {
		    		if($this.current_slide < $this.slides.length - 1) {
		    			$this.anim($this.current_slide + 1);
		    		} else {
		    			$this.anim(0);
		    		}
	    		}
	    		
	    		setTimeout(function() {
	    			$this.autoanim();
	    		}, wrapper.attr('data-interval'));
	    	};
	    	
	    	/* Run auto animation */
	    	if(wrapper.attr('data-autoanimation') === 'true') {
	    		setTimeout(function() {
	    			$this.autoanim();
	    		}, wrapper.attr('data-interval'));
	    	}
	    	/* Touch events */
	    	var arts_pos_start_x = 0;
			var arts_pos_start_y = 0;
			var arts_time_start = 0;
			var arts_swipe = false;
			
			wrapper.bind('touchstart', function(e) {
				arts_swipe = true;
				var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
	
				if(touches.length > 0) {
					arts_pos_start_x = touches[0].pageX;
					arts_pos_start_y = touches[0].pageY;
					arts_time_start = new Date().getTime();
				}
			});
			
			wrapper.bind('touchmove', function(e) {
				var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
				
				if(touches.length > 0 && arts_swipe) {
					if(
						Math.abs(touches[0].pageX - arts_pos_start_x) > Math.abs(touches[0].pageY - arts_pos_start_y)
					) {
						e.preventDefault();
					} else {
						arts_swipe = false;
					}
				}
			});
						
			wrapper.bind('touchend', function(e) {
				var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
				
				if(touches.length > 0 && arts_swipe) {									
					if(
						Math.abs(touches[0].pageX - arts_pos_start_x) >= $this.swipe_min_move && 
						new Date().getTime() - arts_time_start <= $this.swipe_max_time
					) {					
						if(touches[0].pageX - arts_pos_start_x > 0 && $this.current_slide > 0) {
							$this.anim($this.current_slide - 1);
						} else if(touches[0].pageX - arts_pos_start_x < 0 && $this.current_slide < $this.slides.length - 1) {
							$this.anim($this.current_slide + 1);
						}
					}
				}
			});
	    }  
	});
})(jQuery);