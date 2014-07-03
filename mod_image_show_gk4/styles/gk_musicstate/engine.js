window.addEvent("load",function(){
        setTimeout(function() {
            $$(".gkIsWrapper-gk_musicstate").each(function(el){
                var elID = el.getProperty("id");
                var wrapper = document.id(elID);
                var $G = $Gavick[elID];
                var slides = [];
                var links = [];
                var imagesToLoad = [];
                var loadedImages = [];
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
                    newImg.setProperty('src', el.getProperty('data-url'));
                });
                
                imagesToLoad.forEach(function(item, i) {
                	loadedImages.push(false);
                });
                //
                var time = setInterval(function(){
                    var process = 0;                
                    imagesToLoad.each(function(elm,i){
                        if(elm.complete && !loadedImages[i]) {
                            var wrap = elm.getParent();
                            
                            var newImgLayer = new Element('div',{
                                "title": elm.getProperty('title'),
                                "class": 'gkIsSlide',
                                "style": 'z-index: ' + elm.getProperty('data-zindex') + '; background-image: url(\''+elm.getProperty('src')+'\')'
                            });
                            
                            newImgLayer.inject(wrap, 'top');
                            
                            if(i > 0) {
                                    newImgLayer.getParent().setStyle('opacity', 0);
                            }
                            
                            elm.inject(newImgLayer, 'bottom');
                            loadedImages[i] = true;
                        }
                        
                        if(elm.complete) {
                        	process++;
                        }
                    });
                    
                    if(process == imagesToLoad.length){
                        clearInterval(time);
                                        document.getElements('.gkIsSlide img').each(function(img, i){
                                                img.dispose();
                                        });
                                        
                        setTimeout(function(){
                                        wrapper.getElement('.gkIsPreloader').setStyle('position', 'absolute');
                                        wrapper.getElement('.gkIsPreloader').fade('out');
                                }, 400);
                                
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
                            
                            if($G['slide_links']){
                                wrapper.getElements('.gkIsSlide').addEvent("click", function(e){ 
                                    window.location = links[$G['actual_slide']]; 
                                });
                                wrapper.getElements('.gkIsSlide').setStyle('cursor', 'pointer');
                            }  
                            
                            wrapper.getElements('.gkIsPagination li').each(function(item, i) {
                                    item.addEvent('click', function() {
                                            if(i != $G['actual_slide']) {
                                                    $G['blank'] = true;
                                                    gk_musicstate_autoanimate($G, wrapper, 'next', i);
                                            }
                                    });
                                    
                                    item.addEvent('mouseenter', function() {
                                            var label = item.getElement('small');
                                            var x = label.getSize().x;
                                            label.set('morph', { duration: 250 });
                                            label.morph({
                                                    'left': -1 * x,
                                                    'opacity': 1
                                            });
                                    });
                                    
                                    item.addEvent('mouseleave', function() {
                                            var label = item.getElement('small');
                                            var x = label.getSize().x;
                                            label.set('morph', { duration: 250 });
                                            label.morph({
                                                    'left': 0,
                                                    'opacity': 0
                                            });
                                    });
                            });            
                            
                            // auto-animation
                            if($G['autoanim'] == 1) {                                
                                    $G['animation_timer'] = setTimeout(function() {
                                            gk_musicstate_autoanimate($G, wrapper, 'next', null);
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
                                                        Math.abs(e.changedTouches[0].pageX - slide_pos_start_x) >= swipe_min_move && 
                                                        new Date().getTime() - slide_time_start <= swipe_max_time
                                                ) {
                                                        if(e.changedTouches[0].pageX - slide_pos_start_x > 0) {
                                                                $G['blank'] = true;
                                                                gk_musicstate_autoanimate($G, wrapper, 'prev', null);
                                                        } else {
                                                                $G['blank'] = true;
                                                                gk_musicstate_autoanimate($G, wrapper, 'next', null);
                                                        }
                                                }
                                        }
                                });
                    }
                }, 500);
            });
    }, 1000);
});

var gk_musicstate_animate = function($G, wrapper, imgPrev, imgNext) {        
        //
        imgPrev.addClass('inactive');
        setTimeout(function() {
                imgPrev.removeClass('inactive');
        }, 500);
        //
        imgNext.setStyle('opacity', 1); 
        //
        new Fx.Tween(imgPrev, {
                duration: $G['anim_speed'],
                onComplete: function() {
                        imgPrev.setProperty('class', '');
                        //imgPrev.setStyle('opacity', 1);
                        
                        imgNext.setProperty('class', 'active');
                        if($G['autoanim'] == 1) {
                                clearTimeout($G['animation_timer']);
                                
                                $G['animation_timer'] = setTimeout(function() {
                                        if($G['blank']) {
                                                $G['blank'] = false;
                                                clearTimeout($G['animation_timer']);
                                                
                                                $G['animation_timer'] = setTimeout(function() {
                                                        gk_musicstate_autoanimate($G, wrapper, 'next', null);
                                                }, $G['anim_interval']);
                                        } else {
                                                gk_musicstate_autoanimate($G, wrapper, 'next', null);
                                        }
                                }, $G['anim_interval']);
                        }
                }
        }).start('opacity', 0);
}; 

var gk_musicstate_autoanimate = function($G, wrapper, dir, next) {
        var i = $G['actual_slide'];
        var imgs = wrapper.getElements('figure');
        
        if(next == null) {
                next = (dir == 'next') ? ((i < imgs.length - 1) ? i+1 : 0) : ((i == 0) ? imgs.length - 1 : i - 1); // dir: next|prev
        }
        
        gk_musicstate_animate($G, wrapper, imgs[i], imgs[next]);
        $G['actual_slide'] = next;
        
        wrapper.getElements('.gkIsPagination li').removeClass('active');
        wrapper.getElements('.gkIsPagination li')[next].addClass('active');
};