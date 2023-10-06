# Forest Health Website Dashboard (Research Team)
Prototype for the Forest Health Website Dashboard (Research Team) that demonstrates simple coding functionality

## To Run the Application
*Please ensure that you have the database ready. It is included in the `database` folder.
<br>
<br>
### Starting the Backend
1) Change the current directory to the backend directory
   ```
   cd server
   ```
2) Install all required dependencies
   ```
   npm install
   ```
3) You might need to update the `user` and `password` values inside `server/db.js`
   ```javascript
   const pool = new Pool({
    user: "YOUR POSTGRESQL USERNAME",
    password: "YOUR POSTGRESQL PASSWORD",
    host: "localhost",
    port: 5432,
    database: "forestHealthDB",
   });
   ```
5) Run the backend
   ```
   npm run
   ```

### Starting the Frontend
1) Change the current directory to the frontend directory
   ```
   cd client
   ```
2) Install all required dependencies
   ```
   npm install
   ```
3) Run the backend
   ```
   npm run
   ```
