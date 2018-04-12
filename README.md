# gallery

Gallery provides OpenLattice's UI for interacting with the entity data model, as well as downloading and visualizing datasets.


##Setup for Mac

1. Clone [gallery](https://github.com/dataloom/gallery), [conductor](https://github.com/openlattice/conductor), and [datastore](https://github.com/openlattice/datastore)
2. Install postgresql
```
brew install postgresql
```
3. Install elasticsearch
```
brew install elasticsearch
```
4. Install JS/NPM dependencies within the gallery project.

```
cd gallery
npm install
```

###Running locally

*Steps 3 and 4 assume you're in [openlattice](https://github.com/openlattice/openlattice) root*

1. Run elasticsearch with cluster name "openlattice"
```
elasticsearch -E cluster.name=openlattice
```
2. Ensure postgres is running
```
brew services start postgresql
```
3. Run [conductor](https://github.com/openlattice/conductor) and [datastore](https://github.com/openlattice/datastore) from the outer directory they are contained in.
```
./gradlew :conductor:run
./gradlew :datastore:run
```
4. Run the server on http://localhost:9090/gallery/ within the gallery project (`/gallery/` trailing slash required).
```
cd gallery;
npm run app
```

**NOTE: Gallery will run on `/gallery/`, not `/gallery`; the trailing slash `/gallery/` is required.**

###Building for prod

Run the prod build within the gallery project.
```
cd gallery
npm run build:prod
```
