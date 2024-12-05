document.addEventListener('DOMContentLoaded', function() {
    // Get all sections
    const homeView = document.getElementById('home-view');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');

    // Get links
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');

    // Get the login form elements
    const loginForm = document.getElementById('login-form');
    const loginUsernameField = document.getElementById('login-username');
    const loginPasswordField = document.getElementById('login-password');

    // Get the signup form elements
    const signupForm = document.getElementById('signup-form');
    const signupUsernameField = document.getElementById('signup-username');
    const signupPasswordField = document.getElementById('signup-password');
    const confirmPasswordField = document.getElementById('signup-confirm-password');
    const errorMessage = document.getElementById('error-message');

    // Show the home view initially
    homeView.style.display = 'block';
    loginView.style.display = 'none';
    signupView.style.display = 'none';

    // Show the login form when "Login" link is clicked
    loginLink.addEventListener('click', function() {
        homeView.style.display = 'none';
        loginView.style.display = 'block';
        signupView.style.display = 'none';
    });

    // Show the sign-up form when "Sign Up" link is clicked
    signupLink.addEventListener('click', function() {
        homeView.style.display = 'none';
        loginView.style.display = 'none';
        signupView.style.display = 'block';
    });

    // Handle Sign Up form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form submission to validate

        // Check if passwords match
        if (signupPasswordField.value !== confirmPasswordField.value) {
            // Display error message if passwords do not match
            errorMessage.style.display = 'block';
        } else {
            // Proceed with form submission (send data to server)
            fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signupUsernameField.value,
                    password: signupPasswordField.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    signupForm.reset();
                })
                .catch(error => {
                    alert('Sign up failed');
                });
        }
    });

    // Handle Login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form submission

        const username = loginUsernameField.value;
        const password = loginPasswordField.value;

        // Send login data to the server
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loginForm.reset();
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    });
});
