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

    const profileButton = document.getElementById('profile-button');
    const profileView = document.getElementById('profile-view');
    const profileForm = document.getElementById('profile-form');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    const createPinView = document.getElementById('create-pin-view');
    const createPinLink = document.getElementById('create-pin-link');
    const createPinForm = document.getElementById('create-pin-form');

    // Helper function to show a specific view and hide others
    function showView(viewToShow) {
        homeView.style.display = 'none';
        loginView.style.display = 'none';
        signupView.style.display = 'none';
        profileView.style.display = 'none'; // Hide profile view
        createPinView.style.display = 'none'; // Hide Create Pin view
        viewToShow.style.display = 'block';
    }

    // Show Create Pin page
    createPinLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView(createPinView);
    });

    // Display profile view
    profileButton.addEventListener('click', () => {
        showView(profileView); // Show profile view when profile button is clicked
    });

    // Default view on page load
    showView(homeView);

    // Event listener for navigation
    homeLink.addEventListener('click', () => showView(homeView));
    loginLink.addEventListener('click', () => showView(loginView));
    signupLink.addEventListener('click', () => showView(signupView));

    // Handle Create Pin form submission
    createPinForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Removed title
        const fileInput = document.getElementById('pin-image');
        const tags = document.getElementById('pin-tags').value.split(',').map(tag => tag.trim());
        const description = document.getElementById('pin-description').value;

        if (fileInput.files.length === 0) {
            alert('Please upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('tags', tags);
        formData.append('description', description); // Include the description

        const token = localStorage.getItem('authToken'); // Get the token from localStorage

        try {
            const response = await fetch('http://localhost:3000/create-pin', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the Authorization header
                },
                body: formData,
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                alert('Pin created successfully! Returning to Home.');
                showView(homeView);
            }
        } catch (error) {
            alert('Failed to create pin: ' + error.message);
        }
    });

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
                localStorage.setItem('authToken', data.token); // Store the token in localStorage
                alert(data.message);
                loginForm.reset();
                handleLoginSuccess(username);
            } else {
                alert(data.message || 'Invalid username or password');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById('profile-pic');
        const description = document.getElementById('profile-description').value;
        const formData = new FormData();

        // Append file and description to formData
        if (fileInput.files.length > 0) {
            formData.append('profilePic', fileInput.files[0]);
        }
        formData.append('description', description);
        formData.append('username', usernameDisplay.textContent);

        const token = localStorage.getItem('authToken'); // Get the token from localStorage

        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the Authorization header
                },
                body: formData,  // Send form data (not JSON)
            });

            const data = await response.json();  // Ensure response is JSON
            alert(data.message);

            if (response.ok) {
                // Update profile view with the uploaded picture and description
                const profileDisplay = document.getElementById('profile-display');
                profileDisplay.innerHTML = `
                <div class="profile-details">
                     <img src="${URL.createObjectURL(fileInput.files[0])}" alt="Profile Picture" class="profile-picture">
                    <h3>${usernameDisplay.textContent}</h3>
                    <p>${description}</p>
                </div>`;
            }
        } catch (error) {
            alert('Failed to update profile: ' + error.message);
        }
    });

// Handle login success
    function handleLoginSuccess(username) {
        usernameDisplay.textContent = username;
        authNav.style.display = 'none'; // Hide login and signup links
        welcomeMessage.style.display = 'block'; // Show welcome message
        profileButton.style.display = 'block'; // Show profile button
        createPinLink.style.display = 'block'; // Show Create Pin link
        showView(homeView);
    }

    // Handle logout
    logoutButton.addEventListener('click', () => {
        authNav.style.display = 'flex'; // Show login and signup links
        welcomeMessage.style.display = 'none'; // Hide welcome message
        usernameDisplay.textContent = ''; // Clear username
        profileButton.style.display = 'none'; // Hide profile button
        createPinLink.style.display = 'none'; // Hide Create Pin link
        showView(homeView); // Redirect to home page
    });
});
