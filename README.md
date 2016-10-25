# View
View is real-time dashboard for your life, designed to be permanently showcased on large screen in your home. It connects to many popular APIs to display relevant and timely information about recent news, weather, your commute and your calendar.

## Using View in the Cloud
Create your own View account at [www.getview.io](http://www.getview.io/) connect to the external APIs under the settings cog. Google Calendar is easy to connect with a simple authentication flow; however, for Feedly and WeatherUnderground, you must imput your own developer keys. Your credentials are stored securely in a Firebase database and the app can be accessed on any device with an Internet browser. [www.getview.io/remote](http://www.getview.io/remote) is designed to remotely control the dashboard in real time.

## Developing and Running View Locally
### Technical Overview
View uses [NodeJS](https://nodejs.org/en/) on the back-end and [AngularJS](https://angularjs.org/) on the front-end. It uses [Firebase](https://firebase.google.com) to manage logins and store user data. It also connects to a few external APIs ([Google Cloud](https://cloud.google.com), [Feedly](http://www.feedly.com), [WeatherUnderground](https://www.wunderground.com/), and the [MTA](http://web.mta.info/developers/)) to display relevant information to users.

#### External APIs
The external APIs all use back-end REST services to deliver JSON data to the client when called via Angular $http. There is also a back-end service that protects these endpoints from being called without a token. The token is generated via the Firebase API using the user's login credentials. 

#### Firebase
Firebase is used on both the back-end and front-end to generate tokens for using the REST API and to read and update user data and manage logins respectively.

## Developer Keys
Before running the app locally, you'll need to get some keys from Google Cloud and Firebase. These keys should be stored in a file called .env in the projects root directory. Copy and rename .env-example to .env and follow the instructions below.

### 1. Google Cloud Keys (for Calendar oAuth)
This will get you the follwing keys:
* GOOGLE_CLIENTSECRET
* GOOGLE_CLIENTID
* GOOGLE_PRODREDIRECT
* GOOGLE_DEVREDIRECT

![1](https://gist.githubusercontent.com/iamnickvolpe/2822c99c0169be7765d712c110bfdc37/raw/4f639d714453af9074fdecd9a2adfb1eac58cf88/View%2520Documentation-01.png)
Go to [https://cloud.google.com](https://cloud.google.com) and sign up for a Google Cloud account. Create a new project.

![2](https://gist.githubusercontent.com/iamnickvolpe/2822c99c0169be7765d712c110bfdc37/raw/ecbe3dc94e080fb86ecad3ce27aaeab9ca26e27e/View%2520Documentation-02.png)
Rename your project to something recognizable. This project will be used to authenticate your app with Google Calendar.

![3](https://gist.githubusercontent.com/iamnickvolpe/2822c99c0169be7765d712c110bfdc37/raw/ecbe3dc94e080fb86ecad3ce27aaeab9ca26e27e/View%2520Documentation-04.png)
Add the Google Calendar API to your project under the "Library" section.

![4](https://gist.githubusercontent.com/iamnickvolpe/2822c99c0169be7765d712c110bfdc37/raw/ecbe3dc94e080fb86ecad3ce27aaeab9ca26e27e/View%2520Documentation-07.png)
Add credentials to your project. You will be calling your API from a web server and you'll be accessing user data.

![5](https://gist.githubusercontent.com/iamnickvolpe/2822c99c0169be7765d712c110bfdc37/raw/ecbe3dc94e080fb86ecad3ce27aaeab9ca26e27e/View%2520Documentation-08.png)
Add restrictions. If you're only running locally, include http://localhost:3000 to your Authorized Javascript origins. If you're running on a webserver with a domain, you can add that domain as well (http://www.yourdomain.com). Similarly, if you're running locally include http://localhost:3000/google-auth to the list of Authorized redirect URIs and if you're on a webserver, add your domain with the /google-auth route (http://www.yourdomain.com/google-auth).