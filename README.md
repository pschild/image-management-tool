Based on https://github.com/maximegris/angular-electron

# Install

## Use SQLite with Electron
1. Start a terminal as admin
2. ```$ root> npm install --save-dev electron-rebuild```
3. ```$ root/server> npm install sqlite --save```
4. ```$ root/server> npm --add-python-to-path='true' --debug install --global --vs2015 windows-build-tools``` (it's currently not working without the ```--vs2015``` flag)
5. Restart terminal (so that changed PATH is available)
6. ```$ root/server> ..\node_modules\.bin\electron-rebuild.cmd -f -w sqlite3```
