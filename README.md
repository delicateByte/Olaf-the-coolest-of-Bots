# Olaf
PDA Project for ASE

## Setup
1.  Install dependencies using `npm i`

2.  Install the ESLint extension for your Editor  
    VS-Code: ESLint by Dirk Baeumer  

3.  Create a file named `.env` and insert the following:  
    ```conf
    # Telegram bot settings
    BOT_TOKEN=<TELEGRAM-BOT-TOKEN>

    # Dashboard password
    DASHBOARD_PASSWORD=$2a$10$KqDExovM4hv8cAtuxWkzSOWko6RIG.uRbS2g9hPH9UqYOxNDWsV/6

    # Google tokens
    GOOGLE_MAPS_STATIC_TOKEN=<GOOGLE-MAPS-STATIC-ACCESS-TOKEN>
    GOOGLE_TOKEN=<GOOGLE-OTHER-ACCESS-TOKEN>
    
    # Watson tokens
    SPEECH_TO_TEXT_APIKEY=<STT-APIKEY>
    SPEECH_TO_TEXT_URL=<STT-URL>
    TEXT_TO_SPEECH_APIKEY=<TTS-APIKEY>
    TEXT_TO_SPEECH_URL=<TTS-URL>
    
    # Other tokens
    UNSPLASH_TOKEN=<UNSPLASH-ACCESS-TOKEN>
    OPEN_WEATHER_API=<OPENWATHER-APIKEY>
    NEWSAPI_KEY=<NEWSAPIORG-APIKEY>
    CORONA=<CORONA-APIKEY>
    CORONA_URL=<CORONAVIRUS-API-URL>
    TWITTER_OAUTH=<TWITTER-APIKEY>
    ```
    
    
4.  Use one of the following scripts  
    `npm start`: Compiles and starts the PDA  
    `npm run dev`: Same as start but also re-compiles on changes
    `npm test`: Run unit tests
    `npm run lint`: Run ESLint


## Folder Structure

We use a common folder structure for all use cases and API connectors. Files are named in `lowerCamelCase`.

```
src/
├──main.ts
├──usecases/
│  ├──dailystatus/
│  │  ├──dailystatusUsecase.ts
│  │  ├──dailystatusUsecase.test.ts
│  │  └──otherFile.ts
│  └──imageoftheday/
│     ├──imageofthedayUsecase.ts
│     ├──imageofthedayUsecase.test.ts
│     └──otherFile.ts
├──connectors/
│  ├──reddit/
│  │  ├──redditConnector.ts
│  │  ├──redditConnector.test.ts
│  │  └──otherFile.ts
│  ├──googleMaps/
│  │  ├──googleMapsConnector.ts
│  │  ├──googleMapsConnector.test.ts
│  │  └──otherFile.ts
└──interfaces/
   └──useCase.ts
```
