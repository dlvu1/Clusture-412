const bcrypt = require('bcrypt');

// Generate a hash for the plaintext password
bcrypt.hash('password1', 10, (err, hash) => {
    if (err) throw err;

    console.log('Generated Hash:', hash);

    // Compare the plaintext password with the generated hash
    bcrypt.compare('password1', hash, (err, result) => {
        if (err) throw err;

        console.log('Password Match:', result); // true
    });
});
