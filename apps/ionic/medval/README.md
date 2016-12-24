# medval

## Prerequisites

* Node.js 4.2.2 or later
* Typescript 2.0 (npm install typescript -g; direct your IDE to use this)


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
