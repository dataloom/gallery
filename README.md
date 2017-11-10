# gallery

Gallery provides OpenLattice's UI for interacting with the entity data model, as well as downloading and visualizing datasets.


##Setup for Mac

1. Clone [gallery](https://github.com/kryptnostic/gallery), [conductor](https://github.com/dataloom/conductor), and [datastore](https://github.com/dataloom/datastore)
2. Install cassandra version 3.9
```
brew install cassandra
```
3. Install elasticsearch version 5.1.1
```
brew install elasticsearch
```
4. Install JS/NPM dependencies within the gallery project.

```
cd gallery
npm install
```


###Running locally

*Steps 3 and 4 assume you're in [loom](https://github.com/dataloom/loom) root*

1. Run cassandra
```
cassandra
```
2. Run elasticsearch with cluster name "loom_development"
```
elasticsearch -E cluster.name=loom_development
```
3. Run [conductor](https://github.com/dataloom/conductor) and [datastore](https://github.com/dataloom/datastore) from the outer directory they are contained in.
```
./gradlew :conductor:run
./gradlew :datastore:run
```
4. Run the server on http://localhost:9000/gallery/ within the gallery project (`/gallery/` trailing slash required).
    * *Option 1:* Run normal dev server `cd gallery; npm run app`
    * *Option 2:* Run [webpack-dashboard](https://www.npmjs.com/package/webpack-dashboard) `cd gallery; npm run dev`

**NOTE: Gallery will run on `/gallery/`, not `/gallery`; the trailing slash `/gallery/` is required.**

###Tests

Test suite is Karma, Mocha, Chai. The default test run - `npm test` - runs Karma with PhantomJS.

**Writing Tests**

To add a tests for `foo.js`, create a `foo.test.js` file adjacent to `foo.js`. The karma will automatically pick up and run it.

If you're actively writing tests, you may want to debug them in a browser.
Karma supports running tests in a browser, and auto-reloading test code when it changes.
The following command starts Chrome and runs tests in the browser. You can debug it with Chrome dev tools.
```
npm run test:dev
```

**Adding Chai Plugins**

To add a Chai plugin, add the import and call of `chai.use(plugin)` to `config/chai/plugins.config`


###Building for prod

Run the prod build within the gallery project.
```
cd gallery
npm run build:prod
```
