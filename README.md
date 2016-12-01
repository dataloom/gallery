# gallery

Gallery provides Loom's UI for interacting with the entity data model, as well as downloading and visualizing datasets.

**Setup**

1. Install [cassandra](https://docs.datastax.com/en/cassandra/2.0/cassandra/install/installDeb_t.html)
2. Clone the entire [loom](http://stash.krypt.int/projects/KRYP/repos/loom/browse) superproject
3. Install dependencies.

```
npm install
```

**Running locally**

1. Run cassandra
2. Run kryptnostic-conductor and datastore from the `loom` superproject
```
./gradlew :kryptnostic-conductor:run
./gradlew :datastore:run
```
3. Run the server on http://localhost:9000/gallery/
```
npm run app
```

**Building for prod**

Run the prod build.
```
npm run build:prod
```
