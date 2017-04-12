# medval

## Prerequisites

* Node.js 4.2.2 or later
* Typescript 2.0 (npm install typescript -g; direct your IDE to use this)

## Icon and splash files
* If you run ionic resources, it may changes the config.xml file and remove ios/android files. You may have to do some careful planning, but the best approach is to run it on a mac, try to generate both android and ios at the same time.

## Setup

* ionic start -v2 medval
* Add standard angular dependencies to package.json:
    
######
    "@angular/common": "2.0.0",
    "@angular/compiler": "2.0.0",
    "@angular/compiler-cli": "0.6.2",
    "@angular/core": "2.0.0",
    "@angular/forms": "2.0.0",
    "@angular/http": "2.0.0",
    "@angular/platform-browser": "2.0.0",
    "@angular/platform-browser-dynamic": "2.0.0",
    "@angular/platform-server": "2.0.0",
    "@ionic/storage": "1.0.3",
    "ionic-angular": "2.0.0-rc.1",
    "ionic-native": "2.2.3",
    "ionicons": "3.0.0",
    "rxjs": "5.0.0-beta.12",
    "zone.js": "^0.6.25"
* Add devdDependencies
######
    "@ionic/app-scripts": "^0.0.36",
    "typescript": "^2.0.3"
* Update tsconfig.json (to make Webstorm happy)
######
    Add following so that the editor will not flag 'Promise' and other es6 types as missing: 
    "files": [
      "node_modules/typescript/lib/lib.es6.d.ts"
    ]
    As a result of adding the previous line, following the rules of precedence between "include" and "files" directives, you have to tell typescript which files to compile with this:
     "include": [
       "src/**/*.ts"
     ],

After cloning the repository (and when a branch is checked out):
* npm install;
This command installs all of the dependencies of the project.

Expect to see some warnings.
######
    npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
    npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.14

* ionic <command>
######
    ionic build ios / android
    ionic emulate ios / ionic build android
    ionic serve - for development 

* Recent changes to speed up app
######
    Followed AOT
    1. Compile everything
    node_modules/.bin/ngc -p tsconfig-aot.json 
    2. Instlal rollup
    npm install rollup rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-uglify --save-dev
   
    Installed gulp (may not be required in addition to AOT)


######
IOS Project Setup

Project Revvolve
- Info/ios Deployemnt Target - default
- Build settings/code signing entity
-- debug, distribution, release, including any ios sdk: ios distribution
- development team: HC Tech

Target Revvolve/ bulid settings
- Strip debug symbols during copy - disabled for debug target only
- development team = hc tech inc; provisioning profile = automatic, release  = automatic.
- code signing identity:
--- debug: iosDistribution, any sdk: iosDeveloer
--- release: iosDistribution, any sdk: iosDeveloer
--- provisioning: iosDistribution, any sdk: iosdeveloper
- product bundle id: com.ionicframework.medval611122
-- In Info, setup Private photo library usage description AND Camera Usage Description - "Upload photos to customize branding and setup staff profiles."

target revvolve/general
- deployment target 8.0, ipad, landscipe left/right, requires full screen
- signing - automatic, team: hc tech, provisioing profie: xode managed, signing cert: iphone developer


######
Releasing changes using code-push

Command reference: https://microsoft.github.io/code-push/docs/cli.html#link-4

Install Commands:
npm install --save @ionic-native/code-push
ionic plugin add cordova-plugin-code-push --save
npm install -g code-push-cli

Startup commands:
code-push login
code-push whoami
code-push app ls

 
USE MAC for IOS
0. Mapping of code push targets to our deployment types
 Production   Not Used
 Staging      Production
 Test         For Testing
1. Check current latest code-push version in staging
code-push deployment ls Revvolve -k

Typical output:
┌────────────┬───────────────────────────────────────┬─────────────────────────────────────────┬──────────────────────┐
│ Name       │ Deployment Key                        │ Update Metadata                         │ Install Metrics      │
├────────────┼───────────────────────────────────────┼─────────────────────────────────────────┼──────────────────────┤
│ Production │ 3KIS2HnZjVp-BL0MyLJyYgIZKycqNy3W0WG9M │ No updates released                     │ No installs recorded │
├────────────┼───────────────────────────────────────┼─────────────────────────────────────────┼──────────────────────┤
│ Staging    │ I7batrN30myLfl0PX5d6qsjocHmBNy3W0WG9M │ Label: v6                               │ Active: 0% (0 of 4)  │
│            │                                       │ App Version: 0.0.4                      │ Total: 1 (2 pending) │
│            │                                       │ Mandatory: No                           │                      │
│            │                                       │ Release Time: a day ago                 │                      │
│            │                                       │ Released By: chinmay.nagarkar@gmail.com │                      │
└────────────┴───────────────────────────────────────┴─────────────────────────────────────────┴──────────────────────┘

2. Increase the version to something higher than the max of {version in config.xml, and version from the command in previous step)
3. Push a new version to Test iPad
Test iPad should have the test key in config.xml. Be very careful here as you don't want to deploy something to Apple app store with the test keys.
4. Push a new version to Staging
code-push release-cordova Revvolve ios


