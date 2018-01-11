//PROBLEM: Hints are shown even when form is valid.
//Solution: Hide and Show them at appropriate times.


var $password = $("#password");
var $confirmPassword = $("#confirm_password");
var $userName = $("#username");

//Hide Hints

$("form span").hide();

function isPasswordValid() {
return $password.val().length > 8;
}
function isUsernameValid() {
 return $userName.val().length;
}

function arePasswordsMatching () {
 return $password.val() === $confirmPassword.val();   
}

function canSubmit() {
 return isPasswordValid() && arePasswordsMatching() && isUsernameValid();   
}

function passwordEvent() {

  //Find out if password is valid.   
    if(isPasswordValid()) {
    
    //Hide Hint if valid.
    $password.next().hide();
   } else {
   
    //Else show hint
   $password.next().show();
  }    
}

  //Find out if password and confirmation match.
function confirmPasswordEvent() {
    if(arePasswordsMatching()) {
   
         //Hide hint if matched.
        $confirmPassword.next().hide();

      //Else show hint.
    } else { 
        $confirmPassword.next().show();
        
    } 
}

function enableSubmitEvent(){
    $("#submit").prop("disabled", !canSubmit());
}

//When event happens on password input
$password.focus(passwordEvent).keyup(passwordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

//When event happens on confirmation input
$confirmPassword.focus(confirmPasswordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

// Call Function
enableSubmitEvent();
