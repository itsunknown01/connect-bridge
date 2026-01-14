import bodyParser from "body-parser";
import cors from "cors";
import ViteExpress from "vite-express";
import cookieParser from "cookie-parser";

import { app, server } from "@/src/server/config/websockets.ts";
import {
  authRoutes,
  channelRoutes,
  messageRoutes,
  knowledgeRoutes,
  outcomeRoutes,
} from "./routes/index.ts";

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", channelRoutes);
app.use("/api/channels", messageRoutes);
app.use("/api/channels", knowledgeRoutes);
app.use("/api/channels", outcomeRoutes);

ViteExpress.bind(
  app,
  server.listen(3000, () => {
    console.log("Server is connected in 3000....");
  })
);
