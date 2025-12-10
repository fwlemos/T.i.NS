# Run Application Guideline

When the user requests to "run the application" or tags this file, follow these steps:

1.  **Check Current Directory**: Ensure you are in the project root (`c:\Users\Admin\Documents\AI Projects\T.I.M.S`).
2.  **Start Dev Server**: Execute the following command in the terminal:
    ```bash
    npm run dev
    ```
3.  **Notify User**: Inform the user that the server is starting and provide the local URL (typically `http://localhost:5173`).
4.  **Behavior**: Do not wait indefinitely for the command to finish, as it is a long-running process. Start it and let it run.
