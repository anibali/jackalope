**!!! Work in progress !!!**

# Jackalope

A browser-based multiplayer implementation of [One-Eyed Jack](https://www.pagat.com/misc/jack.html),
also known as "Jack Foolery", "Jack Off", and "Sequence".

## Development

### Running

1. From `backend/`, run `npx nodemon`
2. From `frontend/`, run `npm start`

### TODO

* Allow players to reorder cards in hand.
* Button for copying room link to clipboard
  (https://www.w3schools.com/howto/howto_js_copy_clipboard.asp).
* More efficient representation of `boardChips`.
* Put `room` in the store and get rid of the room context and roomInfo.
* Add current turn check to canDrop.
* Limit dead card replacement to one per turn.
* Add a quick way to reset the room and play again once a game finishes.
