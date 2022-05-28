# movie-api

To build docker container use command:
```
docker build . -t qimb/movie-api
```

To run image use command:
```
docker run --name Movies -e NODE_APP_INSTANCE=3045 -p 3045:3045 -d qimb/movie-api
```
