$(document).ready(function() {
	jQuery(".responsive-menu-items").html("<ul class='resp-menu'><li class='active'></li></ul><ul class='resp-menu-hidden'></ul>");
	jQuery('#block_main_menu .active a:first').each(function(index) {
		var thisli = $(this).clone();
		jQuery(".resp-menu li").append(thisli);
	});
	jQuery('.resp-menu > li').clone().append('<ul />');

	jQuery('#block_main_menu nav > ul > li').each(function(index) {
		var thisli = $(this).clone();
		jQuery(".resp-menu-hidden").append(thisli);
	});

	jQuery('.resp-menu a').click(function(e) {
		e.preventDefault();
		$('.active .bg i').toggleClass('active');
		jQuery('.resp-menu-hidden').slideToggle('fast');
	})

	jQuery('.resp-menu-hidden li').has('ul').addClass('inner');

	jQuery('.resp-menu-hidden li.inner a').live('click', function(e) {
		if (jQuery(this).parent().hasClass('inner')) {
			e.preventDefault();
			jQuery(this).parent().find('ul').slideToggle('fast');
		}
	})
	$('.responsive-menu-items .bg').append('<i></i>');
});
