# song-number

SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

### Build

- Install dependencies
  `bun i`
- Build app
  `bun run build`

### Run

- Optional generate [certs](.cert/README.md) for https for local dev

- Run app in browser
  `bun run dev`

### Electron

- Add deployment platform
  `bunx cap add @capacitor-community/electron`
- Build and copy files to platform
  `bun run build-only && bunx cap copy`
- Open project for electron
  `bunx cap open @capacitor-community/electron`

### Android

- Add deployment platform
  `bunx cap add android`
- Build and copy files to platform
  `bun run build-only && bunx cap copy`
- Generate assets (icon and splash)
  `bun run assets`
- Shortcut (build + sync)
  `bun run sync`

- (Optional) Add permissions to `AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### IOS

- Add deployment platform
  `bunx cap add ios`
- Build and copy files to platform
  `bun run build-only && bunx cap copy`
- Generate assets (icon and splash)
  `bun run assets`

### Deploy

- Open platform ide for native build. You might need to change path in `capacitor.config.ts`
  `bunx cap open android`
  optional with intellij
  `CAPACITOR_ANDROID_STUDIO_PATH=/usr/bin/intellij-idea-ultimate-edition bunx cap open android`
- For iOS open xcode
  `bunx cap open ios`

#### Android

- From android studio build the project and run it on mobile device
- To change the android version edit `./android/app/build.gradle`

### Setup Receiver App

- Get a Chromecast device and get it set up for
  development: https://developers.google.com/cast/docs/developers#Get_started
- Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option
  and specify the URL to where you are hosting the receiver index.html file
- Insert your App ID in the `APPLICATION_ID` in `src/store/crome-cast.store.ts`
- Copy index.html from receiver to your own server

### License

[GPLv2](LICENSE)
