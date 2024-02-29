import express from "express";
import cors from "cors";
import todosRoute from "./routes/api/todosRouteApi";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/steps", todosRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`➜  Local:   \x1b[36mhttp://localhost:${PORT}/\x1b[0m`);
});
