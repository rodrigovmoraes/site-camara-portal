jQuery(function() {
	// Set Date in Header - this part only for Demo, in real life please create date on server
	var weekDay = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	var monthName = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	var today = new Date();
	var todayString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	jQuery('time.today, time.last_update').attr({
		'datetime' : todayString
	});
	jQuery('time.today').empty().text(weekDay[today.getDay()] + ', ' + monthName[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear());

	// override default jQuery FadeTo method for IE < 9
	if ((jQuery.browser.msie) && (parseInt(jQuery.browser.version) < 9)) {
		jQuery.fn.fadeTo = function(speed, to, easing, callback) {
			return this.animate({}, speed, easing, callback);
		}
	}
	// Gallery Front Page
	jQuery('#block_front_slider .content').adGallery({
		loader_image : 'images/preloader.gif',
		width : 472,
		height : 332,
		scroll_jump : 1,
		display_next_and_prev : false,
		display_back_and_forward : false,
		slideshow : {
			enable : true,
			autostart : true,
			speed : 10000
		}
	});

	// Slider Editors Choice

	jQuery('#block_editors_choice .thumbNav li:nth-child(3n+1)').show();
	// show nav

	// Popup images

	jQuery('#block_in_pictures .item a, #gallery_list .photo a').append('<span class="bg"/>');
	jQuery('#block_in_pictures .item a, #gallery_list .photo a').hover(function() {// show zoom bg
		jQuery(this).find('.bg').css({
			'display' : 'block'
		});
	}, function() {
		jQuery(this).find('.bg').css({
			'display' : 'none'
		});
	});

	// Gallery List
	jQuery('.gallery_4columns .gallery_without_description li:nth-child(4n), .gallery_4columns .gallery_with_description li:nth-child(2n), .gallery_3columns .gallery_without_description li:nth-child(3n)').addClass('last_gallery');
	// remove padding in last item
	jQuery('.change_gallery a').click(function() {
		if (!jQuery(this).hasClass('active')) {
			if (jQuery(this).hasClass('with_description')) {
				var remove = 'gallery_without_description', add = 'gallery_with_description';
			} else {
				var remove = 'gallery_with_description', add = 'gallery_without_description';
			}
			jQuery('#gallery_list ul').fadeOut('fast', function() {
				jQuery(this).removeClass(remove).addClass(add);
				jQuery('#gallery_list li').removeClass('last_gallery');
				jQuery('.gallery_4columns .gallery_without_description li:nth-child(4n), .gallery_4columns .gallery_with_description li:nth-child(2n), .gallery_3columns .gallery_without_description li:nth-child(3n)').addClass('last_gallery');
				// remove padding in last item
				jQuery(this).fadeIn();
			});
			jQuery(this).addClass('active').siblings().removeClass('active');
		}
		return false;
	});

	// Tabs, cookie expires in days
	jQuery('#block_sidebar_tabs, #block_content_top_tabs, .tabs').tabs({
		cookie : {
			expires : 7
		}
	});

	// Scroll window to Top
	jQuery('#scroll_to_top').click(function() {
		jQuery('body,html').animate({
			scrollTop : 0
		});
		return false;
	});

	// animate hover
	jQuery('.view_all:not(.active), .view_all_medium:not(.active), .view_all_big:not(.active), .anythingSlider .arrow, .anythingSlider .start-stop, input.form-submit, .button_plus, .button_minus, .button_next, .button_back, .change_gallery a, .email_print_pdf a').fadeTo('fast', 0.5);
	ChangeOpacity = function(obj) {
		jQuery(obj).fadeTo(400, 1);
		jQuery(obj).fadeTo(400, 0.5);
	};
	var IntervalId = 0;
	jQuery('.view_all:not(.active), .view_all_medium:not(.active), .view_all_big:not(.active), .anythingSlider .arrow, .anythingSlider .start-stop, input.form-submit, .button_plus, .button_minus, .button_next, .button_back, .change_gallery a, .email_print_pdf a').hover(function() {
		var _this = this;
		ChangeOpacity(_this);
		IntervalId = setInterval(function() {
			ChangeOpacity(_this)
		}, 800);
		return false;
	}, function() {
		clearInterval(IntervalId);
		return false;
	});

	/* Add margin-right:0 fo Archive block */
	jQuery('.archive:nth-child(2n)').addClass('last');

	/* animate social links */
	jQuery('a.social_icons').each(function(index) {
		if (jQuery(this).hasClass('social_icons_right')) {
			jQuery(this).append('<span class="icon"></span>');
		} else {
			jQuery(this).prepend('<span class="icon"></span>');
		}
	});
	jQuery('#block_follow li a, #block_web_services li a').hover(function() {
		if (jQuery(window).width() > 979) {
			jQuery(this).stop().animate({
				'paddingLeft' : '20px'
			}, 200);
		} else {
			jQuery(this).stop().animate({
				'paddingLeft' : '7px'
			}, 200);
		}

	}, function() {
		jQuery(this).stop().animate({
			'paddingLeft' : '0'
		}, 200);
	});

	/* Change Font Size */
	var change_font_size = jQuery('#content .node section.content p, #comments .content p, #comments .date, #content .date_main');
	jQuery('#change_font_size .font_size_normal').click(function() {
		change_font_size.css({
			'fontSize' : '12px'
		});
		return false;
	});
	jQuery('#change_font_size .font_size_down').click(function() {
		if (parseInt(jQuery('#content .node section.content p').css('fontSize')) > 10) {
			change_font_size.animate({
				'fontSize' : '-=1'
			});
		}
		return false;
	});
	jQuery('#change_font_size .font_size_up').click(function() {
		if (parseInt(jQuery('#content .node section.content p').css('fontSize')) < 16) {
			change_font_size.animate({
				'fontSize' : '+=1'
			});
		}
		return false;
	});

	/* Shortcodes */
	jQuery('blockquote').prepend('<span class="quote_start"></span>').append('<span class="quote_end"></span>');
	/* Content Toggle */
	jQuery('.toggle:not(.active) .toggle_content').hide();
	jQuery('.toggle .toggle_title').click(function() {
		jQuery(this).parent().find('.toggle_content').slideToggle();
		return false;
	});
	jQuery('.accordions').accordion({
		autoHeight : false,
		navigation : true
	});
	// accordions

	/* Show Code */
	jQuery('.show_code a').click(function() {
		jQuery(this).parent().toggleClass('show_code_active').parent().find('.code').slideToggle();
		return false;
	});

	/* Extend jQuery, function toggleAttr, working with checked, disabled and readonly */
	jQuery.fn.extend({
		toggleAttr : function(attrib) {
			if (this.attr(attrib)) {
				this.removeAttr(attrib);
			} else {
				this.attr(attrib, attrib);
			}
			return this;
		}
	});

	/* Block LogIn,Register */
	jQuery('#block_header_login a, #block_login_register .close a').click(function() {
		jQuery('#block_login_register').slideToggle('fast');
		return false;
	});
	/* Replace checkbox with background-image */
	jQuery('input.checkbox_replace').wrap('<span class="checkbox_replace_wrap"></span>').parent().append('<a href="#" class="checkbox_replace_bg"></a>');
	jQuery('a.checkbox_replace_bg').click(function() {
		jQuery(this).toggleClass('checked').parent().find('input.checkbox_replace').toggleAttr('checked');
	});
	jQuery('input.checkbox_replace').change(function() {
		jQuery(this).toggleAttr('checked').parent().find('a.checkbox_replace_bg').toggleClass('checked');
	});

	$('#block_main_slides').flexslider({
		animation : "slide",
		controlNav : false,
		directionNav : false,
		animationLoop : false,
		slideshow : true,
		animationDuration : 1000
	});

	$('#block_main_carousel').flexslider({
		animation : "slide",
		controlNav : true,
		directionNav : true,
		itemWidth : 72,
		itemMargin : 5,
		animationDuration : 1000,
		asNavFor : '#block_main_slides'
	});

	$('#block_breaking_news .slider').flexslider({
		animation : "fade",
		controlNav : false,
		slideshow : true,
		pausePlay : true,
		animationDuration : 1000,
		slideshowSpeed : 4000
	});

	$('#block_front_slides').flexslider({
		animation : "slide",
		controlNav : false,
		directionNav : false,
		animationLoop : false,
		slideshow : false,
		animationDuration : 1000,
		sync : "#block_front_carousel"
	});

	$('#block_front_carousel').flexslider({
		animation : "slide",
		controlNav : false,
		directionNav : true,
		itemWidth : 75,
		itemMargin : 15,
		animationDuration : 1000,
		asNavFor : '#block_front_slides'
	});

	$('#block_editors_choice .carousel').flexslider({
		animation : "slide",
		controlNav : true,
		animationLoop : false,
		slideshow : false,
		itemWidth : 305
	});

	$('#block_in_pictures .carousel').flexslider({
		animation : "slide",
		controlNav : true,
		animationLoop : false,
		slideshow : false,
		itemMargin : 5
	});

    $('#block_big_video').flexslider({
        animation : "slide",
        controlNav : false,
        directionNav : false,
        animationLoop : false,
        slideshow : false,
        itemWidth : 286,
        itemMargin: 0,
        sync : "#block_small_video"
    });

	$('#block_small_video').flexslider({
		animation : "slide",
        controlNav : false,
        directionNav : true,
		itemWidth : 66,
		itemMargin : 5,
        asNavFor : "#block_big_video"
    });


	 $('#banner').flexslider({
		 animation : "slide",
		 controlNav : true
	 });


	if ($(window).width() > 979) {
		jQuery('#content .ad-gallery').adGallery({
			loader_image : 'images/preloader.gif',
			width : 618,
			height : 468,
			scroll_jump : 1,
			display_next_and_prev : true,
			display_back_and_forward : true
		});
		$('.ad-gallery').attr('style', 'width: 618px');
		$('.ad-image-wrapper').attr('style', 'width: 618px; height: 468px;');
		$('.ad-image-wrapper .ad-image').attr('style', 'width: 618px; height: 468px;');
		$('.ad-image-wrapper .ad-image img').attr('style', 'width: 618px; height: 468px;');
	}
	if ($(window).width() < 979) {
		jQuery('#content .ad-gallery').adGallery({
			loader_image : 'images/preloader.gif',
			width : 500,
			height : 340,
			scroll_jump : 1,
			display_next_and_prev : true,
			display_back_and_forward : true
		});
		$('.ad-gallery').attr('style', 'width: 500px');
		$('.ad-image-wrapper').attr('style', 'width: 500px; height: 340px;');
		$('.ad-image-wrapper .ad-image').attr('style', 'width: 500px; height: 340px;');
		$('.ad-image-wrapper .ad-image img').attr('style', 'width: 500px; height: 340px;');
	}
	if ($(window).width() < 768) {
		jQuery('#content .ad-gallery').adGallery({
			loader_image : 'images/preloader.gif',
			width : 456,
			height : 327,
			scroll_jump : 1,
			display_next_and_prev : true,
			display_back_and_forward : true
		});
		$('.ad-gallery').attr('style', 'width: 456px');
		$('.ad-image-wrapper').attr('style', 'width: 456px; height: 327px;');
		$('.ad-image-wrapper .ad-image').attr('style', 'width: 456px; height: 327px;');
		$('.ad-image-wrapper .ad-image img').attr('style', 'width: 456px; height: 327px;');
	}
	if ($(window).width() < 480) {
		jQuery('#content .ad-gallery').adGallery({
			loader_image : 'images/preloader.gif',
			width : 277,
			height : 212,
			scroll_jump : 1,
			display_next_and_prev : true,
			display_back_and_forward : true
		});
		$('.ad-gallery').attr('style', 'width: 277px;');
		$('.ad-image-wrapper').attr('style', 'width: 277px; height: 212px;');
		$('.ad-image-wrapper .ad-image').attr('style', 'width: 277px; height: 212px;');
		$('.ad-image-wrapper .ad-image img').attr('style', 'width: 277px; height: 212px;');
	}
	$(window).resize(function() {
		if ($(window).width() > 979) {
			$.colorbox.resize({
				innerWidth : 618
			});
			$('.ad-gallery').attr('style', 'width: 618px');
			$('.ad-image-wrapper').attr('style', 'width: 618px; height: 468px;');
			$('.ad-image-wrapper .ad-image').attr('style', 'width: 618px; height: 468px;');
			$('.ad-image-wrapper .ad-image img').attr('style', 'width: 618px; height: 468px;');
		}
		if ($(window).width() < 979) {
			$.colorbox.resize({
				innerWidth : 500
			});
			$('.ad-gallery').attr('style', 'width: 500px');
			$('.ad-image-wrapper').attr('style', 'width: 500px; height: 340px;');
			$('.ad-image-wrapper .ad-image').attr('style', 'width: 500px; height: 340px;');
			$('.ad-image-wrapper .ad-image img').attr('style', 'width: 500px; height: 340px;');
		}
		if ($(window).width() < 768) {
			$.colorbox.resize({
				innerWidth : 400
			});
			$('.ad-gallery').attr('style', 'width: 456px');
			$('.ad-image-wrapper').attr('style', 'width: 456px; height: 327px;');
			$('.ad-image-wrapper .ad-image').attr('style', 'width: 456px; height: 327px;');
			$('.ad-image-wrapper .ad-image img').attr('style', 'width: 456px; height: 327px;');
		}
		if ($(window).width() < 480) {
			$.colorbox.resize({
				innerWidth : 280
			});
			$('.ad-gallery').attr('style', 'width: 277px;');
			$('.ad-image-wrapper').attr('style', 'width: 277px; height: 212px;');
			$('.ad-image-wrapper .ad-image').attr('style', 'width: 277px; height: 212px;');
			$('.ad-image-wrapper .ad-image img').attr('style', 'width: 277px; height: 212px;');
		}
	});

	/* Contact form */
	jQuery('#contact_form_submit').submit(function() {
		$this = jQuery(this);
		var name = $this.find('#edit-submitted-name').val();
		var email = $this.find('#edit-submitted-email').val();
		var phone = $this.find('#edit-submitted-phone').val();
		$this.find('.message').remove();
		if (name == "") {
			$this.prepend('<div class="message message_error">Error!<br/>Please enter your Name.</div>');
			$this.find('#edit-submitted-name').focus();
			return false;
		}
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (email == "" || !emailReg.test(email)) {
			$this.prepend('<div class="message message_error">Error!<br/>Please enter your email.</div>');
			$this.find('#edit-submitted-email').focus();
			return false;
		}
		$this.prepend('<div class="message message_info">Loading<br/>Please wait...</div>');
		jQuery.ajax({
			type : 'POST',
			url : jQuery(this).attr('action'),
			data : jQuery(this).serializeArray(),
			success : function(msg) {
				$this.find('.message').remove();
				$this.prepend(msg);
			},
			timeout : 30000,
			error : function(jqXHR, textStatus, errorThrown) {
				$this.find('.message').remove();
				$this.prepend('<div class="message message_error">Error!<br/>' + jqXHR.status + ' - ' + jqXHR.statusText + '</div>');
			}
		});
		return false;
	});

	// Slider In Pictures

	if ($(window).width() > 979) {
		jQuery('#block_in_pictures .item a').colorbox({
			rel : true,
			current : false,
			preloading : false,
			transition : 'fade',
			innerWidth : 618
		});
	}
	if ($(window).width() < 979) {
		jQuery('#block_in_pictures .item a').colorbox({
			rel : true,
			current : false,
			preloading : false,
			transition : 'fade',
			innerWidth : 500
		});
	}
	if ($(window).width() < 768) {
		jQuery('#block_in_pictures .item a').colorbox({
			rel : true,
			current : false,
			preloading : false,
			transition : 'fade',
			innerWidth : 400
		});
	}
	if ($(window).width() < 480) {
		jQuery('#block_in_pictures .item a').colorbox({
			rel : true,
			current : false,
			preloading : false,
			transition : 'fade',
			innerWidth : 280
		});
	}
});
