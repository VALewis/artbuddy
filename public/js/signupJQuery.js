$(document).ready(function() {
	// $("#msform").validate({
	// 	rules: {
	// 		fullname: 'required',
	// 		password: {
	// 			required: true,
	// 			minlength: 8
	// 		},
	// 		cpassword: {
	// 			required: true,
	// 			minLength: 8,
	// 			equalTo: 'password'
	// 		},
	// 		email: {
	// 			required: true,
	// 			email: true
	// 		},
	// 		age: {
	// 			required: true,
	// 			digits: true,
	// 			min: 20,
	// 			max: 90
	// 		},
	// 		gender: {
	// 			required: true,
	// 			max: 1
	// 		}
	// 	},
	// 	messages: {
	// 		fullname: 'Please enter your first and last name',
	// 		password: {
	// 			required: 'Please provide a password',
	// 			minlength: 'Your password must be at least 8 characters long'
	// 		},
	// 		cpassword: {
	// 			required: 'Please provide a password',
	// 			minlength: 'Your password must be at least 8 characters long',
	// 			equalTo: 'Please enter the same password as provided above'
	// 		},
	// 		age: {
	// 			required: 'PLease provide your age',
	// 			digits: 'PLease provide a valid age number in digits',
	// 			min: 'The app is not suited for persons under 20',
	// 			max: 'The app is not suited for persons above 90'
	// 		},
	// 		gender: {
	// 			required: 'Pease provide your gender'
	// 		}
	// 	}
	// });
	
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches

	$(".next").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
				'transform': 'scale('+scale+')',
				'position': 'absolute'
				});
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});
	// $("#fileupload").change(function () {
 //        $("#filePreview").html("");
 //        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
 //        if (regex.test($(this).val().toLowerCase())) {
 //            if ($.browser.msie && parseFloat(jQuery.browser.version) <= 9.0) {
 //                $("#filePreview").show();
 //                $("#filePreview")[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = $(this).val();
 //            }
 //            else {
 //                if (typeof (FileReader) != "undefined") {
 //                    $("#filePreview").show();
 //                    $("#filePreview").append("<img />");
 //                    var reader = new FileReader();
 //                    reader.onload = function (e) {
 //                        $("#filePreview img").attr("src", e.target.result);
 //                    }
 //                    reader.readAsDataURL($(this)[0].files[0]);
 //                } else {
 //                    alert("This browser does not support FileReader.");
 //                }
 //            }
 //        } else {
 //            alert("Please upload a valid image file.");
 //        }
 //    });
});