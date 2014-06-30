jQuery(window).load(function () {
    setTimeout(function () {
        jQuery('.gkIsWrapper-gk_storefront').each(function(i, el) {
            el = jQuery(el);
            var elID = el.attr("id");
            var wrapper = jQuery('#' + elID);
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
            wrapper.find('figure').each(function(i, el) {
                el = jQuery(el);
                var newImg = new jQuery('<img title="'+el.attr('data-title')+'" class="gkIsSlide" style="z-index: '+el.attr('data-zindex')+';" src="'+el.attr('data-url') + '">');
                links[i] = el.attr('data-link'); 
                imagesToLoad.push(newImg); 
                newImg.insertBefore(el.find('figcaption'));
            }); 
        //
        var time = setInterval(function() {
            var process = 0;
            jQuery(imagesToLoad).each(function(i, el) {
                if (jQuery(el)[0].complete){ process++; }
            });
            //
            if (process === imagesToLoad.length) {
                clearInterval(time);
                //
                wrapper.find('img.gkIsSlide').each(function(i, elm) {
                    elm = jQuery(elm);
                    var newDiv = new jQuery('<div title="' + elm.attr('title')+'" class="gkIsSlide"  style="'+elm.attr('style')+'; background-image: url(\'' + elm.attr('src') + '\');'+'"></div>');
                    newDiv.insertBefore(elm);
                });
                //
                wrapper.find('img.gkIsSlide').each(function(i, el) {
                    jQuery(el).remove();
                });
                //
                setTimeout(function() {
                    wrapper.find('.gkIsPreloader').css('position', 'absolute');
                    wrapper.find('.gkIsPreloader').fadeOut();
                    wrapper.find('figure').first().css('opacity', 1).fadeIn();
                    //wrapper.find('figure').addClass('active');
                    wrapper.addClass('loaded');

                    setTimeout(function() {
                        wrapper.find('figure').first().addClass('activated');
                    }, 50);
                    
                }, 400); 
                //
                $G['actual_slide'] = 0;
                //
                wrapper.find('.gkIsSlide').each(function(i, elmt) {
                    slides[i] = jQuery(elmt);
                });

                setTimeout(function() {
                    var initfig = slides[0].parent().find('figcaption');
                    if (initfig) {
                        initfig.css('opacity', 0);
                        initfig.animate({ opacity: 1 }, 250);
                    }
                }, 250);
                //
                if ($G['slide_links']) {
                    wrapper.find('.gkIsSlide').click(function(e) {
                        window.location = links[$G['actual_slide']];
                    });
                    wrapper.find('.gkIsSlide').css('cursor', 'pointer');
                }
                //
                wrapper.find('.gkIsPagination li').each(function(i, item) {
                    jQuery(item).click(function() {
                        if (i !== $G['actual_slide']) {
                            $G['blank'] = true;
                            gk_storefront_autoanimate($G, wrapper, 'next', i);
                        }
                    });
                });
                // auto-animation
                if ($G['autoanim'] == 1) {
                    $G['animation_timer'] = setTimeout(function() {
                        gk_storefront_autoanimate($G, wrapper, 'next', null);
                    }, $G['anim_interval']);
                }
                // pagination
                var slide_pos_start_x = 0;
                var slide_pos_start_y = 0;
                var slide_time_start = 0;
                var slide_swipe = false;

                wrapper.bind('touchstart', function(e){
                    slide_swipe = true;
                    var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
                    if (e.changedTouches.length > 0) {
                        slide_pos_start_x = touches[0].pageX;
                        slide_pos_start_y = touches[0].pageY;
                        slide_time_start = new Date().getTime();
                    }
                });
                //
                wrapper.bind('touchmove', function(e) {
                    var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
                    if (touches.length > 0 && slide_swipe) {
                        if (Math.abs(touches[0].pageX - slide_pos_start_x) > Math.abs(touches[0].pageY - slide_pos_start_y)) {
                            e.preventDefault();
                        } else {
                            slide_swipe = false;
                        }
                    }
                });
                //
                wrapper.bind('touchend', function(e) {
                    var touches = e.originalEvent.changedTouches || e.originalEvent.touches;
                    if (touches.length > 0 && slide_swipe) {
                        if (Math.abs(touches.pageX - slide_pos_start_x) >= swipe_min_move && new Date().getTime() - slide_time_start <= swipe_max_time) {
                            if (touches.pageX - slide_pos_start_x > 0) {
                                $G['blank'] = true;
                                gk_storefront_autoanimate($G, wrapper, 'prev', null);
                            } else {
                                $G['blank'] = true;
                                gk_storefront_autoanimate($G, wrapper, 'next', null);
                            }
                        }
                    }
                });
            }
        }, 500);
    });
},
1000);
});
                                
var gk_storefront_animate = function($G, wrapper, imgPrev, imgNext) {
    var prevfig = jQuery(imgPrev).find('figcaption');
    //
    if (prevfig) {
        prevfig.css('opacity', 1).animate({
            opacity: 0
        }, 250);
    }
    //
    jQuery(imgNext).attr('class', 'animated');

    jQuery(imgPrev).animate({
        opacity: 0
    }, $G['anim_speed'], function() {
        jQuery(imgPrev).attr('class', '');
    });
    
    jQuery(imgNext).animate({
        opacity: 1
    }, $G['anim_speed'], function() {
        jQuery(imgNext).attr('class', 'active');
        var nextfig = jQuery(imgNext).find('figcaption');
        
        setTimeout(function() {
            jQuery(imgNext).attr('class', 'active activated');
        }, 50);
        
        if (nextfig) {
            nextfig.css('opacity', 0);
            nextfig.animate({
                opacity: 1
            }, 250);
        }
        if ($G['autoanim'] == 1) {
            clearTimeout($G['animation_timer']);

            $G['animation_timer'] = setTimeout(function() {
                if ($G['blank']) {
                    $G['blank'] = false;
                    clearTimeout($G['animation_timer']);

                    $G['animation_timer'] = setTimeout(function() {
                        gk_storefront_autoanimate($G, wrapper, 'next', null);
                    }, $G['anim_interval']);
                } else {
                    gk_storefront_autoanimate($G, wrapper, 'next', null);
                }
            }, $G['anim_interval']);
        }
    });
};

var gk_storefront_autoanimate = function($G, wrapper, dir, next) {
    var i = $G['actual_slide'];
    var imgs = wrapper.find('figure');
    

    if (next == null) {
        next = (dir == 'next') ? ((i < imgs.length - 1) ? i + 1: 0) : ((i == 0) ? imgs.length - 1: i - 1);
        // dir: next|prev
        }

    
    gk_storefront_animate($G, wrapper, imgs[i], imgs[next]);
    $G['actual_slide'] = next;

    wrapper.find('.gkIsPagination li').removeClass('active');
    wrapper.find('.gkIsPagination li').eq(next).addClass('active');
};