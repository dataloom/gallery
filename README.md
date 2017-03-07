# gallery

Gallery provides Loom's UI for interacting with the entity data model, as well as downloading and visualizing datasets.

**Setup for Mac**

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

**Running locally**

1. Run cassandra: `cassandra`
2. Run elasticsearch with cluster name "loom_development"
```
elasticsearch -E cluster.name=loom_development
```
3. Run [conductor](https://github.com/dataloom/conductor) and [datastore](https://github.com/dataloom/datastore) from the outer directory they are contained in.
```
./gradlew :conductor:run
./gradlew :datastore:run
```
4. Run the server on http://localhost:9000/gallery/ within the gallery project.
    * *Option 1:* Run normal dev server `cd gallery; npm run app`
    * *Option 2:* Run [webpack-dashboard](https://www.npmjs.com/package/webpack-dashboard) `cd gallery; npm run dev`

**Building for prod**

Run the prod build within the gallery project.
```
cd gallery
npm run build:prod
```
