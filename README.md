# Modest-Ninja
PDA for ASE

# Setup
1.  Install dependencies using `npm i`

2.  Install the ESLint extension for your Editor  
    VS-Code: ESLint by Dirk Baeumer  

3.  Create a file named `.env` and insert the following:  
    ```conf
    # App settings
    PORT=3000

    # Telegram bot settings
    BOT_TOKEN=<TELEGRAM-BOT-TOKEN>

    # Dashboard password
    DASHBOARD_PASSWORD=$2a$10$KqDExovM4hv8cAtuxWkzSOWko6RIG.uRbS2g9hPH9UqYOxNDWsV/6
    ```

4.  Run the application using one of the following scripts  
    `npm start`: Compiles and starts the PDA  
    `npm run dev`: Same as start but also re-compiles on changes

