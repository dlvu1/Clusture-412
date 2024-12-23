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

    // Helper function to show a specific view and hide others
    function showView(viewToShow) {
        homeView.style.display = 'none';
        loginView.style.display = 'none';
        signupView.style.display = 'none';
        profileView.style.display = 'none'; // Hide profile view
        viewToShow.style.display = 'block';
    }

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

        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'POST',
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
                </div>
            `;
                showView(profileView);
            }
        } catch (error) {
            alert('Profile update failed: ' + error.message);
        }
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        authNav.style.display = 'flex'; // Show login and signup links
        welcomeMessage.style.display = 'none'; // Hide welcome message
        usernameDisplay.textContent = ''; // Clear username
        profileButton.style.display = 'none'; // Hide profile button
        const profileDisplay = document.getElementById('profile-display');
        if (profileDisplay) {
            profileDisplay.innerHTML = ''; // Clear the profile display
        }
        showView(homeView); // Redirect to home page
    });

    // Update UI on successful login
    function handleLoginSuccess(username) {
        usernameDisplay.textContent = username;
        authNav.style.display = 'none';
        welcomeMessage.style.display = 'block';
        profileButton.style.display = 'block'; // Show profile button
        showView(homeView);
    }
});

function showView(viewToShow) {
    const views = document.querySelectorAll('section');
    views.forEach((view) => (view.style.display = 'none')); // Hide all views
    viewToShow.style.display = 'block'; // Show the selected view
}
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-board-button')) {
        const boardId = event.target.getAttribute('data-id');

        const confirmDelete = confirm('Are you sure you want to delete this board?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/boards/${boardId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Remove the board from the DOM
                event.target.closest('div').remove();
            } else {
                alert(data.message || 'Failed to delete board');
            }
        } catch (error) {
            console.error('Error deleting board:', error);
            alert('Failed to delete board');
        }
    }
});

document.getElementById('view-boards-button').addEventListener('click', async () => {

    try {
        console.log('Fetching boards from API...');
        const response = await fetch('http://localhost:3000/boards');
        console.log('Response status:', response.status);
        const boards = await response.json();
        console.log('Boards data:', boards);

        const boardsList = document.getElementById('boards-list');
        boardsList.innerHTML = ''; // Clear any previous data

        boards.forEach((board) => {
            const boardElement = document.createElement('div');
            boardElement.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${board.imageurl}" alt="${board.boardname}" style="width: 100px; height: 100px; margin-right: 10px; object-fit: cover;">
                    <div>
                        <h3>${board.boardname}</h3>
                        <p>${board.description}</p>
                        <p>Created by: ${board.username}</p>
                        <button class="delete-board-button" data-id="${board.boardid}">Delete</button>
                    </div>
                </div>
                <hr>
            `;
            boardsList.appendChild(boardElement);
        });

        showView(document.getElementById('boards-view'));
    } catch (error) {
        console.error('Error fetching boards:', error);
        alert('Failed to fetch boards');
    }
});

document.getElementById('add-board-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const boardname = document.getElementById('board-name').value;
    const description = document.getElementById('board-description').value;
    const imageurl = document.getElementById('board-image-url').value || '/images/default.jpg';
    const userid = 1; // Replace this with the actual logged-in user's ID

    try {
        const response = await fetch('http://localhost:3000/boards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boardname, description, userid, imageurl }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            document.getElementById('add-board-form').reset();
            showView(document.getElementById('home-view'));
        } else {
            alert(data.message || 'Failed to add boaard');
        }
    } catch (error) {
        console.error('Error adding board:', error);
        alert('Failed to add board');
    }
});
/*
boards.forEach((board) => {
    const boardElement = document.createElement('div');
    boardElement.innerHTML = `
        <div style="display: flex; align-items: center;">
            <img src="${board.imageurl}" alt="${board.boardname}" style="width: 100px; height: 100px; margin-right: 10px; object-fit: cover;">
            <div>
                <h3>${board.boardname}</h3>
                <p>${board.description}</p>
                <p>Created by: ${board.username}</p>
                <button class="delete-board-button" data-id="${board.boardid}">Delete</button>
            </div>
        </div>
        <hr>
    `;
    boardsList.appendChild(boardElement);
});

// Handle delete button clicks
document.querySelectorAll('.delete-board-button').forEach((button) => {
    button.addEventListener('click', async (event) => {
        const boardId = event.target.getAttribute('data-id');
        try {
            const response = await fetch(`http://localhost:3000/boards/${boardId}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                event.target.closest('div').remove(); // Remove the board from the list
            } else {
                alert(data.message || 'Failed to delete board');
            }
        } catch (error) {
            console.error('Error deleting board:', error);
            alert('Failed to delete board');
        }
    });
});
*/
document.getElementById('back-to-home-from-add').addEventListener('click', () => {
    showView(document.getElementById('home-view'));
});

document.getElementById('add-board-button').addEventListener('click', () => {
    showView(document.getElementById('add-board-view'));
});