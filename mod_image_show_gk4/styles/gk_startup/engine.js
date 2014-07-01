window.addEvent("load",function(){	
	setTimeout(function() {
		$$(".gkIsWrapper-gk_startup").each(function(el){
			var elID = el.getProperty("id");
			var wrapper = document.id(elID);
			var $G = $Gavick[elID];
			var slides = [];
			var links = [];
			var loadedImages = (wrapper.getElement('.gkIsPreloader')) ? false : true;
			
			$G['blank'] = false;
			$G["base_x"] = 0;
			$G["base_y"] = 0;
			
			if(!loadedImages){
				var imagesToLoad = [];
				
				wrapper.getElements('.gkIsSlide').each(function(el,i){
					links.push(el.getProperty('data-link'));
					var newImg = new Element('img',{
						"title":el.getProperty('title'),
						"class":el.getProperty('class'),
						"style":el.getProperty('style')
					});
					
					newImg.setProperty('alt',el.getProperty('data-link'));
					newImg.setProperty("src",el.getProperty('data-path'));
					imagesToLoad.push(newImg);
					newImg.inject(el, 'after');
					el.destroy();
				});
				
				if(wrapper.getElement('.gkIsText')) {
					wrapper.getElements('.gkIsText').fade('out');
				}
				
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
							wrapper.addClass('loaded');
							if(wrapper.getElement('.gkIsText')) {
								wrapper.getElement('.gkIsText').fade('in');
								wrapper.getElement('.gkIsText').addClass('active');
							}
							
							if(!Browser.ie) {
								(function() {
									wrapper.getElement('.gkIsPreloader').destroy();
								}).delay(400);
							}
						}).delay(400);
					}
				}).periodical(200);
			}
			
			var time_main = (function(){
				if(loadedImages){
					clearTimeout(time_main);
					
					wrapper.getElements(".gkIsSlide").each(function(elmt,i){
						slides[i] = elmt;
						if($G['slide_links']){
							elmt.addEvent("click", function(){window.location = elmt.getProperty('alt');});
							elmt.setStyle("cursor", "pointer");
						}
					});
					
					$G["base_x"] = slides[0].getSize().x;
					$G["base_y"] = slides[0].getSize().y;
					
					slides.each(function(el,i){
						if(i != 0) el.setStyle('opacity', 0);
					});
					
					slides[0].addClass('active');
					
					$G['actual_slide'] = 0;
					
					if(wrapper.getElement(".gkIsNext")) {
						document.addEvent('keydown', function(e) {
							if(e.key == 'left') {
								gk_is_appsprotech_anim(wrapper, slides, $G['actual_slide']-1, $G);
								$G['blank'] = true;
							}
							
							if(e.key == 'right') {
								gk_is_appsprotech_anim(wrapper, slides, $G['actual_slide']+1, $G);
								$G['blank'] = true;
							}
						});
						
						wrapper.getElement(".gkIsNext").addEvent('click', function() {					
							gk_is_appsprotech_anim(wrapper, slides, $G['actual_slide']+1, $G);
							$G['blank'] = true;
						});
						
						wrapper.getElement(".gkIsPrev").addEvent('click', function() {
							gk_is_appsprotech_anim(wrapper, slides, $G['actual_slide']-1, $G);
							$G['blank'] = true;
						});
						
						wrapper.getElements('.gkIsPagination li')[0].setProperty('class', 'active');
						
						wrapper.getElements('.gkIsPagination li').each(function(li, i) {
							li.addEvent('click', function(e) {
								e.stop();
								gk_is_appsprotech_anim(wrapper, slides, i, $G);
								$G['blank'] = true;
							});
						});
					}
					
					if($G['autoanim']){
					    (function(){
					        if(!$G['blank']) {
					        	gk_is_appsprotech_anim(wrapper, slides, $G['actual_slide']+1, $G);
					        } else {
					        	$G['blank'] = false;
					        }
					    }).periodical($G['anim_interval']+$G['anim_speed']);
					}
				}
			}).periodical(250);
		});
	}, 1000);
});

function gk_is_appsprotech_anim(wrapper, slides, which, $G){
	if(which != $G['actual_slide']){
		var max = slides.length-1;
		if(which > max) which = 0;
		if(which < 0) which = max;
		var actual = $G['actual_slide'];
		var txts = wrapper.getElements(".gkIsText");
		
		$G['actual_slide'] = which;
		slides[$G['actual_slide']].setStyle("z-index",max+1);
		
		slides[actual].set('tween', {duration: $G['anim_speed']});
		slides[which].set('tween', {duration: $G['anim_speed']});
		
		txts[actual].set('tween', {duration: $G['anim_speed'] / 20});
		txts[which].set('tween', {duration: $G['anim_speed'] / 4});
		
		slides[actual].fade('out');
		
		if(slides[actual].hasClass('active')) {
			slides[actual].removeClass('active');
		}
		
		slides[which].fade('in');	
		
		if(!slides[which].hasClass('active')) {
			slides[which].addClass('active');
		}
		
		if(txts.length > 0) {
			txts[actual].fade('out');
			if(txts[actual].hasClass('active')) {
				txts[actual].removeClass('active');
			}
			
			txts[which].fade('in');
			if(!txts[which].hasClass('active')) {
				txts[which].addClass('active');
			}
		}
				
		if(wrapper.getElement('.gkIsPagination')) {
			wrapper.getElements('.gkIsPagination li').setProperty('class', '');
			wrapper.getElements('.gkIsPagination li')[which].setProperty('class', 'active');
		}
	}
}
