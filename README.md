**!!! Work in progress !!!**

# Jackalope

A browser-based multiplayer implementation of [One-Eyed Jack](https://www.pagat.com/misc/jack.html),
also known as "Jack Foolery", "Jack Off", and "Sequence".

The commands to build and run the app in production mode are:

```
$ export NODE_ENV=production
$ npm install
$ npm start
```

## Development

### Running

1. From `backend/`, run `npx nodemon`
2. From `frontend/`, run `npm start`

### TODO

* Add a quick way to reset the room and play again once a game finishes.
* More efficient representation of `boardChips`.
* Add current turn check to canDrop (maybe---it's kind of nice to be able to
  check moves when it's not your turn).
