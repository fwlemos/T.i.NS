---
description: Run Application Server(s)
---

# Run Application Guideline

When the user requests to "run the application" or tags this file, follow these steps:

1.  **Check Current Directory**: Ensure you are in the project root (`C:\Users\Admin\Documents\AI Projects\T.i.NS`).
2. **Verify other servers**: Make sure you're not creating several instances of the dev server: If there's another instance running, kill it before proceeding
3.  **Start Dev Server**: Execute the following command in the terminal:
    ```bash
    npm run dev
    ```
4.  **Notify User**: Inform the user that the server is starting and provide the local URL (typically `http://localhost:5173`).
5.  **Behavior**: Do not wait indefinitely for the command to finish, as it is a long-running process. Start it and let it run.
