import express from "express";
import query from "./db/index.js"

const app = express();
const PORT = 8080;
app.use(express.json());



// route '/' to check server status
/* This code sets up a route for the root URL ("/") of the server using the HTTP GET method. When a
client makes a GET request to the root URL, the server will respond with a JSON object containing a
"status" property set to "okay" and a status code of 200 (indicating a successful response). */
app.get("/", (req, res) => {
  res.status(200).json({ status: "okay" });
});

/* This code sets up a route for the URL "/api/users" of the server using the HTTP GET method. When a
client makes a GET request to this URL, the server will query the database to retrieve the
usernames, passwords, and creation dates of all users in the "users" table. The server will then
respond with a JSON object containing a "message" property indicating the number of users found and
a "data" property containing an array of objects representing the user data. The response will have
a status code of 200 (indicating a successful response). The function is marked as asynchronous
using the "async" keyword to allow for the use of the "await" keyword when querying the database. */
app.get("/api/users", async (req, res) => {
  const dbRes = await query(
    "SELECT USERNAME, PASSWORD, CREATED_AT FROM users  "
  );
  const serverRes = {
    message: `${dbRes.rowCount} users are found`,
    data: dbRes.rows,
  };
  res.status(200).json(serverRes);
});

/* This code sets up a route for the URL "/api/users/:username" of the server using the HTTP GET
method. When a client makes a GET request to this URL with a specific username parameter, the server
will query the database to retrieve the information of the user with that username from the "users"
table. The server will then respond with a JSON object containing a "message" property indicating
that a user is found and a "data" property containing an object representing the user data. The
response will have a status code of 200 (indicating a successful response). */
app.get("/api/users/:username", async (req, res) => {
  const username = req.params.username;
  const dbRes = await query("SELECT * FROM users WHERE username= $1", [
    username,
  ]);
  if (dbRes.rows.length===0){const notFoundRes = {message: "no users were found"}; res.status(404).json(notFoundRes); }
  const serverRes = { message: "A user is found", data: dbRes.rows[0] };

  res.status(200).json(serverRes);
});

app.post("/api/register", async (req, res) => {
  try {
    const body = req.body;
    const dbRes = await db
      .query(
        "INSERT INTO users (email, username , password) VALUES ($1 , $2, $3)",
        [body.email, body.username, body.password]
      )
      .then(
        async () =>
          await query("SELECT * FROM users WHERE username = $1", [
            body.username,
          ])
      );

    const serverRes = {
      message: "A new user created successfully",
      data: dbRes.rows[0],
    };

    res.status(200).json(serverRes);
  } catch (error) {const {name,table,constraint,detail} = error;
    const serverRes = { message: detail, error:{ name, table, constraint}};
    
    res.status(500).json(serverRes);
  }
});

app.listen(PORT, () => {
  console.log("Server run port on port 8080");
});
