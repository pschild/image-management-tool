import { app, BrowserWindow, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import { startServer } from '../server/src/server';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      webSecurity: false // for showing local images
    }
  });

  // when running in development mode (app.isPackaged === false), install dev tools
  if (app.isPackaged) {
    installDevtoolExtensions();
  }

  // load localhost URL when in development mode (--serve param, app.isPackaged === false)
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '..', 'node_modules', 'electron'))
    });
    win.loadURL('http://localhost:4200');
    startServer('.');

    // load index.html when in production mode (no param, app.isPackaged === true)
  } else {
    // app.getAppPath() => <PROJECT_ROOT>\release\win-unpacked\resources\app.asar
    win.loadURL(url.format({
      pathname: path.join(app.getAppPath(), 'client', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    startServer(app.getAppPath());
  }

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

global['autoUpdater'] = autoUpdater; // put autoUpdater to global namespace, so that it can be called from an Angular component

async function installDevtoolExtensions() {
  const installExtension = require('electron-devtools-installer').default;
  const { REDUX_DEVTOOLS } = require('electron-devtools-installer');

  try {
    await installExtension(REDUX_DEVTOOLS);
    console.log('Installed extension: REDUX_DEVTOOLS');
  } catch (error) {
    console.log('Error occurred when installing devtool:', error);
  }
}
