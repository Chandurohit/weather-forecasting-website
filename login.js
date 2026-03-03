document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Retrieve stored user data from local storage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    // Validate the user credentials
    if (email === storedEmail && password === storedPassword) {
        alert('Login successful!');
        // Redirect to the weather page
        window.location.href = 'weather.html';
    } else {
        alert('Invalid login credentials. Please try again.');
    }
});