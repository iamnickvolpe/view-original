# View
View is real-time dashboard for your life, designed to be permanently showcased on large screen in your home. It connects to many popular APIs to display relevant and timely information about recent news, weather, your commute and your calendar.

## Using View in the Cloud
Create your own View account at [www.getview.io](http://www.getview.io/) and connect to the external APIs under the settings cog on the bottom right of the dashboard. Google Calendar is easy to connect with a simple authentication flow; however, for Feedly and WeatherUnderground, you must input your own developer keys. Your credentials are stored securely in a Firebase database and the app can be accessed on any device with an Internet browser. The project is stored on Heroku. [www.getview.io/remote](http://www.getview.io/remote) is designed to remotely control the dashboard in real time.

## Develping with View
### Technical Overview
View uses [NodeJS](https://nodejs.org/en/) on the back-end and [AngularJS](https://angularjs.org/) on the front-end. It uses [Firebase](https://firebase.google.com) to manage logins and store user data. It also connects to a few external APIs ([Google Cloud](https://cloud.google.com), [Feedly](http://www.feedly.com), [WeatherUnderground](https://www.wunderground.com/), and the [MTA](http://web.mta.info/developers/)) to display relevant information to users.

### API Creds and .env Keys
Before running the app locally, you'll need to get some keys from Google Cloud and Firebase. These keys should be stored in a file called .env in the projects root directory. Copy and rename .env-example to .env and follow the instructions below.

#### 1. Google Cloud Keys (for Calendar oAuth)

![1](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-01.png)
If you don't have one already, go to [https://cloud.google.com](https://cloud.google.com) and sign up for a Google Cloud account. Create a new project.

![2](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-02.png)
Name your project something recognizable. This project will be used to authenticate your app with Google Calendar.

![3](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-04.png)
Add the Google Calendar API to your project under the "Library" section.

![4](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-07.png)
Add credentials to your project. You will be calling your API from a web server and you'll be accessing user data.

![5](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-08.png)
Add restrictions. If you're only running locally, include http://localhost:3000 to your Authorized Javascript origins. If you're running on a webserver with a domain, you can add that domain as well (http://www.yourdomain.com). Similarly, if you're running locally include http://localhost:3000/google-auth to the list of Authorized redirect URIs and if you're on a webserver, add your domain with the /google-auth route (http://www.yourdomain.com/google-auth).

![6](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-10.png)
Add the product name that will be shown to users. Something like "View" is fine here.

![7](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-12.png)
Download the credentials.

![8](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-13.png)
Open the credentials up in your favorite text editor. Copy and paste the 2 relevant credentials into .env.
* GOOGLE_CLIENTSECRET: client_secret (eg. x_IuGsrwPc7M9UO9Y37V8_w2)
* GOOGLE_CLIENTID: client_id (eg. 8362947163820-7x5sgasdfpbiop8qr8y4x678wydmxk63.apps.googleusercontent.com)

#### 2. Redirect URIs

Now that you've added the appropriate redirect URIs to Google Cloud, go ahead and add them to into .env.

* GOOGLE_PRODREDIRECT: http://www.yourdomain.com/google-auth (or leave this blank if only running locally)
* GOOGLE_DEVREDIRECT: http://localhost:3000/google-auth

#### 3. Firebase Creds

![9](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-14.png)
If you don't have one already, go to [https://firebase.google.com](https://firebase.google.com) and sign up for a Firebase account.

![10](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-15.png)
Create a new project and name it something recognizable. This project will be used to store and access user data.

![11](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-17.png)
Navigate home and click on "Add Firebase to your web app".

![12](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-18.png)
Copy and paste the credentials into .env.

* FBC_APIKEY: apiKey (eg. XE83ksBd-832bKda_eis93nKeDIaoe35ds-12dB)
* FBC_AUTHDOMAIN: authDomain (eg. app-3l3bH.firebaseapp.com)
* FBC_DBURL: databaseURL (eg. https://app-3l3bH.firebaseio.com)
* FBC_STORAGE: storageBucket (eg. app-3l3bH.appspot.com)

#### 4. Firebase Project Name

![13](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-16.png)
Under the gear on the top-left of the Firebase console, navigate to "Project Settings" and copy and paste the "Project ID" into the FBS_PROJECTID section of .env.

#### 5. Firebase Service Account Private Key

![14](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-20.png)
Navigate to "Permissions" under the gear at the top left of the Firebase console.

![15](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-23.png)
Navigate to "Service Accounts". Under the default service account, click "..." then "Create key".

![16](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-24.png)
Download the JSON and open it up in your favorite text editor.

![17](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-25.png)
Copy and paste the private_key into FBS_PRIVATEKEY in .env.

### Setup Firebase Rules
![18](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-26.png)
In your Firebase project, navigate to "Database > Rules". Copy and paste the following:
```
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      } 
    }
  }
}
```
This will protect your Firebase project from unwanted reads or writes.

### Enable Firebase Login

![19](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-27.png)
In your Firebase project, navigate to "Authentication > Sign-in Method". Enable the Email/Password Provider.

### Add OAuth Redirect Domains (If running from a domain on a web server)

![20](https://raw.githubusercontent.com/iamnickvolpe/view/master/documentation-images/View%20Documentation-28.png)
In your Firebase project, navigate to "Authentication > Sign-in Method". Add your domain to the list of authorized domains (eg. getview.io).

### Run the Project
You'll need to install Node, NPM, and Gulp. After that, you can run these commands in your terminal or command prompt.

#### Install Dependencies
```
npm install
```

#### Build the App
```
gulp build
```

#### Build and Watch for Changes
This will re-build and reload the browser every time a change is made.
```
gulp watch
```

#### Run!
While "watching for changes", type this command in a new terminal or command prompt window then navigate to [http://localhost:3000/](http://localhost:3000/).
```
npm start
```