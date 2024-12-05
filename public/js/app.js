document.addEventListener('DOMContentLoaded', function () {
    const homeView = document.getElementById('home-view');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');

    const homeLink = document.getElementById('home-link');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const authNav = document.getElementById('auth-nav');
    const welcomeMessage = document.getElementById('welcome-message');
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    // Helper function to show a specific view and hide others
    function showView(viewToShow) {
        homeView.style.display = 'none';
        loginView.style.display = 'none';
        signupView.style.display = 'none';
        viewToShow.style.display = 'block';
    }

    // Default view on page load
    showView(homeView);

    // Event listener for navigation
    homeLink.addEventListener('click', () => showView(homeView));
    loginLink.addEventListener('click', () => showView(loginView));
    signupLink.addEventListener('click', () => showView(signupView));

    // Signup form submission handler
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = signupForm['signup-username'].value;
        const password = signupForm['signup-password'].value;
        const confirmPassword = signupForm['signup-confirm-password'].value;

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match!';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                showView(loginView);
                signupForm.reset();
            }
        } catch (error) {
            alert('Sign up failed: ' + error.message);
        }
    });

    // Login form submission handler
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = loginForm['login-username'].value;
        const password = loginForm['login-password'].value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                loginForm.reset();

                // Update UI for logged-in user
                usernameDisplay.textContent = username;
                authNav.style.display = 'none';
                welcomeMessage.style.display = 'block';
                showView(homeView);
            } else {
                alert(data.message || 'Invalid username or password');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Logout button handler
    logoutButton.addEventListener('click', () => {
        authNav.style.display = 'flex'; // Show navigation links
        welcomeMessage.style.display = 'none'; // Hide welcome message
        usernameDisplay.textContent = ''; // Clear username
        showView(loginView); // Redirect to login view
    });
});
