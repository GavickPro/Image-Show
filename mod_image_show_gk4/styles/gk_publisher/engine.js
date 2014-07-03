window.addEvent("load",function(){
    $$(".gkIsWrapper-gk_publisher").each(function(el){
        var elID = el.getProperty("id");
        var wrapper = $(elID);
        var $G = $Gavick[elID];
        var slides = [];
        var links = [];
        var imagesToLoad = [];
        var loadedImages = 0;
        // animation variables
        $G['animation_timer']= false;
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
                clearTimeout(time_main);
                
                wrapper.getElements(".gkIsSlide").each(function(elmt,i){
                    slides[i] = elmt;
                    if($G['slide_links']){
                        elmt.addEvent("click", function(e){ 
                            window.location = links[$(e.target).retrieve('num')]; 
                        });
                        elmt.setStyle("cursor", "pointer");
                    }
                });
                                
                $G['actual_slide'] = 0;
                
                (function() {
                	gk_publisher_autoanimate($G, wrapper, 'next');
                }).delay($G['anim_interval']);
                // pagination
                if(wrapper.getElement('ol')) {
                    wrapper.getElements('ol li').each(function(btn, i) {
                    	btn.addEvent('click', function() {
                    		if(i != $G['actual_slide']) {
                    			gk_publisher_autoanimate($G, wrapper, 'next', i);
                    		}		
                    	});
                    });
                }
            }
        }).periodical(250);
    });
});

var gk_publisher_animate = function($G, wrapper, imgPrev, imgNext) {	
	imgPrev.set('tween', {
		duration: $G['anim_speed'],
		onComplete: function() {
			this.element.setProperty('class', '');
		}
	});
	
	imgNext.set('tween', {
		duration: $G['anim_speed'],
		onComplete: function() {
			this.element.setProperty('class', 'active');
			
			clearTimeout($G['animation_timer']);
			
			$G['animation_timer'] = setTimeout(function() {
				gk_publisher_autoanimate($G, wrapper, 'next', null);
			},$G['anim_interval']);
		} 
	});

	imgPrev.fade('out');
	imgNext.fade('in');
}; 

var gk_publisher_autoanimate = function($G, wrapper, dir, nextSlide) {
	var i = $G['actual_slide'];
	var imgs = wrapper.getElements('figure');
	var next = nextSlide;
	
	if(nextSlide == null) {
		next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
	}
	
	gk_publisher_animate($G, wrapper, imgs[i], imgs[next]);
	$G['actual_slide'] = next;
	wrapper.getElements('ol li').setProperty('class', '');
	wrapper.getElements('ol li')[next].setProperty('class', 'active');
};