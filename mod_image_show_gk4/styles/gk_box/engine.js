jQuery(window).load(function () {
    jQuery('.gkIsWrapper-gk_box').each(function(i, el) {
        el = jQuery(el);
        var elID = el.attr("id");
        var wrapper = jQuery('#' + elID);
        var $G = $Gavick[elID];
        var slides = [];
        var links = [];
        var imagesToLoad = [];
        // animation variables
        $G['animation_timer'] = false;
        // blank flag
        $G['blank'] = false;
        // load the images
        wrapper.find('.gkIsSlide').each(function(i, el) {
            el = jQuery(el);
            var newImg = new jQuery('<img title="'+el.attr('title')+'" data-link="'+el.attr('data-link') + '" class="gkIsImage" style="z-index: '+el.css('z-index')+';" src="'+el.attr('data-path') + '">');
            imagesToLoad.push(newImg);
            newImg.insertBefore(el);
            el.remove();
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
                $G['actual_slide'] = 0;
                //
                wrapper.find('.gkIsImage').each(function(i, elmt) {
                    slides[i] = jQuery(elmt);
                    links[i] = slides[i].attr('data-link');
                });
                //
                if ($G['slide_links']) {
                    wrapper.find('.gkIsImage').on('click', function() {
                        window.location = links[$G['actual_slide']];
                    });

                    wrapper.find('.gkIsImage').css('cursor', 'pointer');
                }
                //
                wrapper.find('.gkIsPagination li').each(function(i, item) {
                    jQuery(item).click(function() {
                        if (i !== $G['actual_slide']) {
                            $G['blank'] = true;
                            gk_box_autoanimate($G, wrapper, 'next', i);
                        }
                    });
                });
                // auto-animation
                if ($G['autoanim'] == 1) {
                    $G['animation_timer'] = setTimeout(function() {
                        gk_box_autoanimate($G, wrapper, 'next', null);
                    }, $G['anim_interval']);
                }
            }
        }, 250);
    });
});

var gk_box_animate = function($G, wrapper, imgPrev, imgNext) {
    //
    jQuery(imgNext).animate({
        opacity: 1
    }, $G['anim_speed'], function() {
        jQuery(imgPrev).removeClass('active');
        jQuery(imgNext).addClass('active');

        if ($G['autoanim'] == 1) {
            clearTimeout($G['animation_timer']);

            $G['animation_timer'] = setTimeout(function() {
                if ($G['blank']) {
                    $G['blank'] = false;
                    clearTimeout($G['animation_timer']);

                    $G['animation_timer'] = setTimeout(function() {
                        gk_box_autoanimate($G, wrapper, 'next', null);
                    }, $G['anim_interval']);
                } else {
                    gk_box_autoanimate($G, wrapper, 'next', null);
                }
            }, $G['anim_interval']);
        }
    });

    jQuery(imgPrev).animate({
        opacity: 0
    }, $G['anim_speed']);
};

var gk_box_autoanimate = function($G, wrapper, dir, next) {
    var i = $G['actual_slide'];
    var imgs = wrapper.find('.gkIsImage');

    if (next == null) {
        next = (dir == 'next') ? ((i < imgs.length - 1) ? i + 1: 0) : ((i == 0) ? imgs.length - 1: i - 1);
    }

    gk_box_animate($G, wrapper, imgs[i], imgs[next]);
    $G['actual_slide'] = next;

    wrapper.find('.gkIsPagination li').removeClass('active');
    wrapper.find('.gkIsPagination li').eq(next).addClass('active');
    wrapper.find('.gkIsText li').removeClass('active');
    wrapper.find('.gkIsText li').eq(next).addClass('active');
};