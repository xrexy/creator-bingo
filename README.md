App that strives to improve the Creator Bingo(series by [@JJJacksfilms](https://www.youtube.com/@jjjacksfilms)) experience.

## Features

- Every user can authenticate themselves with their Twitch account.
- Everyone, after authenticating with their Twitch account, can register as a creator by linking their YouTube account.
  - Logging in with their Google/YouTube account is required so that the app can verify that they're they own the channel.
- Every creator can create a bingo board with a video chosen by them. The board will then be available for everyone to play.
  - The board title is separate from the youtube title so it is possible to fix "title desync" issues.
- Every user can play a board by clicking on the video thumbnail.
  - Board links follow the format - /play/:youtubeResourceId. Which makes it possible to copy the resourceId from the youtube video url and easily access the bingo board.
    - `https://www.youtube.com/watch?v=**LQ2r15c02U1** => /play/LQ2r15c02U1
- `[Concept]` After the user gets a bingo on the board the board would be persisted and sent to the creator as "feedback".
  - The creator would be able to see all the "feedback" on their content dash

## Development

### Running locally

Make sure you have the required environment variables properly set. See [Environment variables](#environment-variables) for more info.

All steps below use npm as the package manager but you can use your preferred package manager.

1. Install dependencies

```bash
npm install
```

2. Make sure migrations are up to date

```bash
npm run db:generate
```

3. Update your database

```bash
npm run db:migrate

# Step 2 and 3 can be done with a single command:
npm run db:gm
```

4. Start the app (Default port is 3000)

```bash
npm run dev

# Default port is 3000. You can change it by setting the PORT environment variable
PORT=8080 npm run dev
```

### Environment variables

-- The environment variables parser and "shape" can be viewed in `app/config/env.ts`

The app requires the following environment variables to be set:


- `DB_USER`, `DB_PASSWORD` and `DB_URL` - all credentials provided by PlanetScale. Using a local MySQL database might be possible but it's not tested.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_API_KEY` - credentials for the Google OAuth2 API. Acquired by creating a project in the [Google API Console](https://console.developers.google.com/).
- `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` - credentials for the Twitch API. Acquired by creating a project in the [Twitch Developer Console](https://dev.twitch.tv/console).
- `SECRET_KEY` - a random string used for encrypting the access tokens.



### Adding more bingo entries

All the bingo entries are store in `data/bingo_entries.json`. Adding more entries following the format `{ [entryKey]: ":entryText" }` will add more entries to the bingo board.

```
The app generates the board using a PRNG seeded with the resourceId. 
This is done so the board is the same for everyone.

This means that the order of the entries in the json file matters. 
If you want to add more entries to the board, add them to the end of the file.
```

