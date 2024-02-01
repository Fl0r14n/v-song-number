# song-number

SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

### Build

* Install global dependencies
  ```sudo npm i -g @ionic/cli cordova-res```
* Install dependencies
  ```npm i```
* Build app
  ```ionic build```

### Electron

* Add deployment platform
  ```ionic cap add @capacitor-community/electron```
* Copy build files to platform
  ```ionic cap copy```
* Open project for electron
  ```ionic cap open @capacitor-community/electron```

### Android

* Add deployment platform
  ```ionic cap add android```
* Copy build files to platform
  ```ionic cap copy```
* Generate assets (icon and splash)
  ```cordova-res android --skip-config --copy```
* Shortcut 
  ```ionic cap sync```

* Add permissions to `AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### IOS

* Add deployment platform
  ```ionic cap add ios```
* Copy build files to platform
  ```ionic cap copy```
* Generate assets (icon and splash)
  ```cordova-res ios --skip-config --copy```

### Deploy

* Open platform ide for native build. You might need to change path in `capacitor.config.ts`
  ```ionic cap open android```
  might need to add the path to android studio
  ```CAPACITOR_ANDROID_STUDIO_PATH=/usr/bin/intellij-idea-ultimate-edition ionic cap open android```
* For iOS open xcode
  ```ionic cap open ios```

#### Android

* From android studio build the project and run it on mobile device
* To change the android version edit `./android/app/build.gradle`

### Setup Receiver App

* Get a Chromecast device and get it set up for
  development: https://developers.google.com/cast/docs/developers#Get_started
* Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option
  and specify the URL to where you are hosting the receiver index.html file
* Insert your App ID in the src/providers/chromecast.ts file
* Copy index.html from receiver to your own server

### License

[GPLv2](LICENSE)
