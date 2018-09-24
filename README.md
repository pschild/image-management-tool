Based on https://github.com/maximegris/angular-electron

# Install
1. Run ```npm install```
2. Run ```.\node_modules\.bin\electron-rebuild.cmd -f -w sqlite3``` to be able to use sqlite3 with Electron (see Use SQLite with Electron).
3. Run ```npm start``` to start development version, or ```npm run electron:windows``` to build for windows.

## Use sqlite3 with Electron
1. Start a terminal as admin
2. ```$ npm install --save-dev electron-rebuild```
3. ```$ npm install sqlite3 --save```
4. ```$ npm --add-python-to-path='true' --debug install --global --vs2015 windows-build-tools``` (it's currently not working without the ```--vs2015``` flag)
5. Restart terminal (so that changed PATH is available)
6. ```$ .\node_modules\.bin\electron-rebuild.cmd -f -w sqlite3```

# Publish
