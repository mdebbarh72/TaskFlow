<h1>Suspicious Login Attempt</h1>
<p>Hello {{ $user->name }},</p>
<p>We detected multiple failed login attempts on your account. As a security measure, please use the following OTP to verify your identity and complete your login:</p>
<p><strong>{{ $otp }}</strong></p>
