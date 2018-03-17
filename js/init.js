

function initpompey() {
	"use strict";

$('.top-block a.to-sta').hover(function(){
	$('.select-type').addClass('rot-left');
	$(this).find('img').addClass('scale');
	},function(){
		
	$('.select-type').removeClass('rot-left');
	$(this).find('img').removeClass('scale');	
		});
	$('.top-block a.to-video').hover(function(){
	$(this).find('img').addClass('scale');
	$('.select-type').addClass('rot-right');
	},function(){
	$(this).find('img').removeClass('scale');	
	$('.select-type').removeClass('rot-right');	
		});	
		
		
		
};


$(document).ready(function(){
	initpompey();
});	