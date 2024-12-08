# User manual

## first section, how to run. Second section, how to use application

### How to run application

In order to run the application, you'll need to do two separate things. clone the repo and create the database. These are run locally. Enter the database dump and create the database in your local environment. Clone the repo and then open the terminal while in the server.js file. When there, enter in 'npm install' to download all dependencies. There should be around 17 or 18. You may also need to do this in the app.js file as well but shouldn't be an issue. Change your requirements accordingly for this image: 

<img width="297" alt="Screenshot 2024-12-07 at 5 52 49 PM" src="https://github.com/user-attachments/assets/89455a41-aed4-4d4a-b2f2-fdfdc7814018">


based on your database name.

Once all dependencies are downloaded, enter 'node server.js' in terminal and then click to the app.js file and run or just run 'npm start' and open a browser to localhost or use the run button in IDE. Each of us worked in separate environments so we ran it multiple ways. Most of us used IntelliJ in a Linux environment and ran the database in the same Linux environment as well. Make sure to grant permissions to whatever user is linked to the backend to access the database. 

Below are postgres terminal commands to grant access to the database for backend. The first one should be sufficient but we used all of these just in case. You can change clusture_db to whatever your database name is and clusture_user to whatever your username is.

GRANT ALL PRIVILEGES ON DATABASE clusture_db TO clusture_user;
GRANT USAGE, SELECT ON SEQUENCE users_userid_seq TO clusture_user;
GRANT CONNECT ON DATABASE clusture_db TO clusture_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO clusture_user;

Once you have done all this, you should see a message that looks like this when you run it with node server.js: 
<img width="619" alt="Screenshot 2024-12-07 at 5 53 40 PM" src="https://github.com/user-attachments/assets/4db79fed-d802-4751-8c2b-dcd2697d5ce8">


### How to use application

When you first load the application up, you should be on the home page and logged out. Create a profile in the sign up tab.

<img width="1126" alt="Screenshot 2024-12-07 at 6 00 42 PM" src="https://github.com/user-attachments/assets/2ebb0022-f70c-48f4-8705-7df6a219f4aa">


Once sign up is complete, you should automatically rerouted to the login screen. Please enter the credentials you used to sign up.
After you are logged in, you may access all features of application.
To create a pin, simpy click on "Create Pin". This is located in the top left of the application:

<img width="489" alt="Screenshot 2024-12-07 at 6 02 08 PM" src="https://github.com/user-attachments/assets/facf9e4d-ef10-4414-9eb0-b19616958bbf">


Once in that tab, enter info needed to create pin and upload an image. 

Once the pin is created, it will appear on the homescreen. 
To update your profile pic and add a description about you, go to profile tab. This will be in the right hand side of the search bar.

<img width="897" alt="Screenshot 2024-12-07 at 6 03 43 PM" src="https://github.com/user-attachments/assets/653839cb-359f-489f-8534-8ecc0612076b">

Once in there, you may upload a image and write something nice about yourself. 

To use the search bar, simply search tags like 'cat' or 'dog'. This is decided when creating each pin.

To use the board functionality, simply click on the board tab at the top right or use the add board button at the top right.

this will bring you to a view like this if you wish to view them:

<img width="941" alt="Screenshot 2024-12-07 at 6 09 23 PM" src="https://github.com/user-attachments/assets/2e162fcb-74a9-4741-aca6-8b87178f4f9d">

If you choose add a board, you will be brought to a view that is for creating one. simply go through and add each section and upload an image. Once the board is created, you can view it on the boards tab or choose to delete it with the delete button.

