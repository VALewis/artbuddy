module.exports = (app, client) => {
	app.get("/", (req, res) => {
				res.render ("login")
	})
}


//////////////////////////////////
			//   FB.getLoginStatus(function(response) {
			//     if (response.status === 'connected') {
			//       console.log('Logged in.');
			//     }
			//     else {
			//       FB.login();
			//     }
			//   }); 
			// }; //allows users to register or sign in to app with Facebook.

			// function myFacebookLogin() {
			//   FB.login(function(){
			//     if (response.status === 'connected') {
			//         res.render("")
			//     } else {
			//       res.render("")
			//     }
			//   }, {scope: 'public_profile,email'});
			// } // trigger a login dialog that'll request the relevant permissions

			// (function(d, s, id){
			// 	 var js, fjs = d.getElementsByTagName(s)[0];
			// 	 if (d.getElementById(id)) {return;}
			// 	 js = d.createElement(s); js.id = id;
			// 	 js.src = "https://connect.facebook.net/en_US/sdk.js";
			// 	 fjs.parentNode.insertBefore(js, fjs);
			// 	 }(document, 'script', 'facebook-jssdk'));  
