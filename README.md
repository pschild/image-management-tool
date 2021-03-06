Based on <https://github.com/maximegris/angular-electron>.

Used packages with link to their repository/homepage/API:

* http://typeorm.io/#/ and https://github.com/typeorm/typeorm
* https://nestjs.com/ and https://github.com/nestjs/nest
* https://github.com/scttcper/ngx-toastr
* https://material.angular.io/
* https://ngxs.gitbook.io/ngxs/

# Install
1. Run `npm install`
2. ~~Run `.\node_modules\.bin\electron-builder install-app-deps` to install native modules, like sqlite3 or drive-list. See also <https://electronjs.org/docs/tutorial/using-native-node-modules>~~
3. ~~Run `.\node_modules\.bin\electron-rebuild.cmd -f -w sqlite3` to be able to use sqlite3 with Electron (see Use SQLite with Electron).~~
4. Run one of the following commands:
   1. `npm start` to start a locally running client in Electron (development mode). The server will be started automatically.
   2. `npm run client:test` to run tests for client (not available yet)
   3. `npm run server:start` to start a locally running server only (development mode)
   4. `npm run server:test` to run tests for server
   5. `npm run electron:build:windows` to build the app for Windows
   6. `npm run publish:windows` to publish a new version to GitHub (adjust the version in `package.json`)

## Use sqlite3 with Electron
1. Start a terminal as admin
2. ~~`$ npm install --save-dev electron-rebuild`~~
3. ~~`$ npm install sqlite3 --save`~~
4. `$ npm --add-python-to-path='true' --debug install --global --vs2015 windows-build-tools` (it's currently not working without the `--vs2015` flag)
5. Restart terminal (so that changed PATH is available)
6. ~~`$ .\node_modules\.bin\electron-rebuild.cmd -f -w sqlite3`~~

## Troubleshooting
* `Error: The specified module could not be found. C:\...\node_modules\drivelist\build\Release\drivelist.node`
  * Admin terminal: `npm --add-python-to-path='true' --debug install --global --vs2015 windows-build-tools`
  * `.\node_modules\.bin\electron-rebuild.cmd -f -w drivelist`
* `Error: GitHub Personal Access Token is not set, neither programmatically, nor using env "GH_TOKEN"`
  * On Windows, run in powershell: `[Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")`
  * Restart PowerShell/IDE

# Publish
1. Generate a GitHub access token by going to <https://github.com/settings/tokens/new>.  The access token should have the `repo` scope/permission.  Once you have the token, assign it to an environment variable

    On macOS/linux:

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

    On Windows, run in powershell:

        [Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")

    Make sure to restart IDE/Terminal to inherit latest env variable.
2. Run `$ npm run publish:windows` to build and package the app for Windows.
3. A new release will automatically be created under <https://github.com/pschild/image-management-tool/releases>.  
If `"releaseType"` in `electron-builder.json` is set to `"draft"` or not set at all, edit the new release and publish it. When it's set to `"release"` it will be published automatically.
4. Download and install the app from the latest release (using the .exe file).
5. When you want to release a new version, make sure to increment the version in `package.json`, commit and push your changes.
6. Do steps 2 and 3 again.
7. The app will automatically detect the new release and update itself.

# Develop

Run `npm start` to start development version (start client in Electron, server will be started automatically).
Run `npm run server:start` to start the server only.

## Test
Jest will be used to run test suites.  
You can run tests for server with `npm run server:test`.  
Tests for client are not available yet.

## Create migration files
Run `typeorm migration:create -n SomeNameForMigrationFile` to let the CLI create a file `<TIMESTAMP>-SomeNameForMigrationFile.ts` located in `server/migration`.

Migrations are run automatically, when the flag `migrationsRun` is set to `true` in `ormconfig.json`. Changes to the entities of course need to be made manually.

See the files `1538044562515-TagLabelName.ts` and `1538046038653-TagNameLabel.ts` as an example for creating migrations. They show, how the column `label` in table `tag` is renamed to `name`, and afterwards this change is reversed.
