# Creating a Google API Console project and client ID

Before you can integrate Google Sign-In into your website, you must have a Google API Console project. In the project, you create a client ID, which you need to call the sign-in API.

To create a Google API Console project and client ID, follow these steps:

1. Go to the [Google API Console](https://console.cloud.google.com/apis/credentials).
2. From the project drop-down, select an existing project, or create a new one by clicking New Project.
3. In the sidebar under "APIs & Services", select OAuth consent screen.
   1. In the new screen, under User Type, select External.
   2. In this step, enter App Name, and select a support email.
   3. Skip adding a logo because then your app will require verification which takes days.
   4. Save & Continue
   5. In the scopes, make sure you only add the scopes `profile`, `email`, `openid`. Other scopes require verification.
   6. Review and submit the app
4. From the sidebar, select Credentials
   1. Click Create Credentials and select OAuth Client ID
   2. Under Application Type, select Web Application
   3. Give your application a name
   4. Add your proxy domain to Authorized JavaScript Origins. For example `http://localhost:3000`
   5. Add your redirect url to Authorized Redirect URIs. For example `http://localhost:3000/api/auth/google/callback`
   6. Hit Create
   7. Copy the Client ID and Client Secret values to your .env file
