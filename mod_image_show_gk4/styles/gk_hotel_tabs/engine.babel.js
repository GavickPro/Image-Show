(function($) {
    $(document).ready(function() {
        $(".gkIsWrapper-gk_hotel_tabs").each((i, wrapper) => new GKHotelTabs($(wrapper)));
    });

    class GKHotelTabs {
        constructor(wrapper) {
            // configure instance
            this.wrapper = wrapper;
            this.ID = wrapper.attr("id");
            this.config = $Gavick[this.ID];
            this.config.animationTimer = false;
            this.config.blank = false;
            this.slides = [];
            this.links = []
            this.imagesToLoad = [];
            this.currentSlide = 0;
            this.mode = wrapper.attr('data-mode');
            // load instance
            this.loadImages();
            this.initUI();
        }
        // Add events to UI
        initUI() {
            if(this.wrapper.find('.gkIsPrev').length) {
                this.wrapper.find('.gkIsPrev').click((e) => {
                    e.preventDefault();
                    this.prev(true)
                });
                this.wrapper.find('.gkIsNext').click((e) => {
                    e.preventDefault();
                    this.next(true)
                });
            }

            if(this.wrapper.find('.gkIsPagination').length) {
                this.wrapper.find('.gkIsPagination li').each((i, li) => {
                    $(li).click((e) => {
                        e.preventDefault();
                        this.rewind(i);
                    });
                });
            }
        }
        // Load images 
        loadImages() {
            if(this.mode !== 'testimonial') {
	            // prepare images for the load
	            this.wrapper.find('figure').each((i, figure) => {
	                figure = $(figure);
	                let newImg = new jQuery('<img />');
	                newImg.attr({
	                    "title": figure.attr('data-title'),
	                    "class": 'gkIsSlide',
	                    "style": 'z-index: ' + figure.attr('data-zindex') + ';',
	                    "src": figure.attr('data-url')
	                });
	                this.links[i] = figure.attr('data-link');
	                this.imagesToLoad.push(newImg);
	                figure.append(newImg);
	            });
            	//
            	var time = setInterval(() => this.waitForImages(time), 1000);
            } else {
            	this.wrapper.find('.gkIsPreloader').remove();
            	this.prepareImages();
            }
        }
        // Wait for loaded images
        waitForImages(time) {
            let process = 0;

            $(this.imagesToLoad).each((i, el) => {
                if (el[0].complete) process++;
            });

            if (process == this.imagesToLoad.length) {
                clearInterval(time);
                this.prepareImages();
            }
        }
        // Prepare slides based on the loaded images
        prepareImages() {
            if(this.mode === 'testimonial') {
            	let imgUrl = this.wrapper.find('figure').attr('data-url');
            	this.wrapper.css('background-image', 'url("'+imgUrl+'")');	
                this.wrapper.find('figure').each((i, figure) => $(figure).css('opacity', 1));
                this.wrapper.find('figure').css('opacity', 1);
                this.wrapper.find('figure').first().addClass('active');
	            this.wrapper.find("figure").each((i, el) => this.slides[i] = $(el));
	            this.animate(0, false);
            } else {
	            this.wrapper.find('figure').each((i, figure) => {
	                figure = $(figure);
	                let img = figure.find('img');
	                let newDiv = jQuery('<div>');
	                newDiv.attr({
	                    'class': 'gkIsSlide',
	                    'style': img.attr('style'),
	                    'title': img.attr('title')
	                });
	                newDiv.css('background-image', "url('" + img.attr('src') + "')");
	                newDiv.insertBefore(img);
	                figure.css('opacity', 0);
	                img.remove();
	            });
	
	            setTimeout(() => {
	                this.wrapper.addClass('loaded').find('.gkIsPreloader').fadeOut();
	                this.wrapper.find('figure').each((i, figure) => $(figure).css('opacity', 1));
	                setTimeout(() => this.wrapper.find('.gkIsPreloader').remove(), 1000);
	                this.wrapper.find('figure').css('opacity', 1);
	                this.wrapper.find('figure').first().addClass('active');
	            }, 400);
	            
	            this.wrapper.find(".gkIsSlide").each((i, el) => this.slides[i] = $(el));
	            let initfig = $(this.slides[0]).parent().find('figcaption');
	            
	            if(initfig) {
	                initfig.delay(250).animate({ 'opacity': 1 });
	            }
            }

            this.enableSlideLinks();
            this.enableAutoAnimation();
        }
        // Enable slide links
        enableSlideLinks() {
            if (!this.config.slideLinks) {
                return false;
            }
            
            let slides = this.wrapper.find('.gkIsSlide');

            slides.click((e) => window.location = this.links[this.currentSlide]);
            slides.css('cursor', 'pointer');
        }
        // Enable auto animation
        enableAutoAnimation() {
            if (this.wrapper.attr('data-one-slide') != 'true') {
                this.config.animationTimer = setTimeout(() => this.next(), this.config.animInterval);
            }
        }
        // Show previous slide
        prev(blank = false) {
            this.animate(this.getNext('prev'), blank);
        }
        // Show next slide
        next(blank = false) {
            this.animate(this.getNext('next'), blank);
        }
        // Show nth slide
        rewind(n) {
            this.animate(n, true);
        }
        // Animate slides to the nextNum
        animate(nextNum, setBlank) {            
            let prev = $(this.wrapper.find('figure').get(this.currentSlide));
            let next = $(this.wrapper.find('figure').get(nextNum));
            let prevfig = prev.find('figcaption');
            
            if(prevfig) { 
                prevfig.animate({ 'opacity': 0 });
            }

            next.attr('class', 'animated');

            prev.delay(this.config.animSpeed / 2).animate(
                { opacity: 0 }, 
                this.config.animSpeed, 
                () => prev.attr('class', '')
            );

            next.animate(
                { opacity: 1 },
                this.config.animSpeed, 
                () => {
                    let nextfig = next.find('figcaption');
                    let pagination = this.wrapper.find('.gkIsPagination li');
                    next.attr('class', 'active');
                    
                    if(nextfig) {
                        nextfig.animate({ 'opacity': 1 });
                    }

                    clearTimeout(this.config.animationTimer);

                    if (!this.oneLoop()) {
                        this.config.animationTimer = setTimeout(() => {
                            if (this.config.blank) {
                                this.config.blank = false;
                                clearTimeout(this.config.animationTimer);
                                this.config.animationTimer = setTimeout(() => this.next(), this.config.animInterval);
                            } else {
                                this.next();
                            }
                        }, this.config.animInterval);
                    }

                    this.currentSlide = nextNum;

                    if(pagination.length) {
                        pagination.removeClass('active');
                        $(pagination.get(this.currentSlide)).addClass('active');
                    }

                    if(setBlank) {
                        this.config.blank = true;
                    }
                }
            );
        }
        // Get next slide number in a specific direction
        getNext(dir) {
            let total = this.slides.length;
            let current = this.currentSlide;
            let next = ((this.currentSlide === 0) ? total - 1 : current - 1);
                
            if(dir === 'next') {
                next = ((current < total - 1) ? current + 1 : 0);
            }

            return next;
        }
        // One loop mode
        oneLoop() {
            let total = this.wrapper.find('figure').length;
            let current = this.currentSlide;
            let noLoop = this.wrapper.attr('data-no-loop');

            return noLoop  == 'true' && current == total - 1;
        }
    }
})(jQuery);