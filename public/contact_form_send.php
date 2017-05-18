<?php
if(isset($_POST['submitted'])){
	
	$submitted = $_POST['submitted'];
	// Convert special characters to HTML entities
	$name = htmlspecialchars(stripslashes($submitted['name']));
	$email = htmlspecialchars(stripslashes($submitted['email']));
	$phone = htmlspecialchars(stripslashes($submitted['phone']));
	$message = htmlspecialchars(stripslashes($submitted['message']));
	
	if ($name == '') {echo '<div class="message message_error">Error!<br/>Please enter your Name.</div>'; return;}
	if ($email == '' || !preg_match('/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/', $email)) {echo '<div class="message message_error">Error!<br/>Please enter your Email.</div>'; return;}
	
	// Change this email to your email address
	$to = 'mad_caesar@bk.ru';
	
	$headers = 'From: '. $email;
	$subject = 'News Portal Contact Form';
	$body = "Name: $name\n\n"
			. "Email: $email\n\n"
			. "Subject: $subject\n\n"
			. "Message: $message\n\n"
			. "Phone: $phone"
			;
		
	if(mail($to, $subject, $body, $headers)){
		echo '<div class="message message_success">Success!<br/>Your message has been successfully sent.</div>'; return;
	}else{
		echo '<div class="message message_error">Error!<br/>Please try again.</div>'; return;
	}
}