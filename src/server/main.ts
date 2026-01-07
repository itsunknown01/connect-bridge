import bodyParser from "body-parser";
import cors from "cors";
import ViteExpress from "vite-express";

import { app, server } from "@/src/server/config/websockets.ts";
import authRoutes from "@/src/server/routes/authRoutes.ts";
import channelRoutes from "@/src/server/routes/channelRoutes.ts";
import messagesRoutes from "@/src/server/routes/messageRoutes.ts";

app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", channelRoutes);
app.use("/api/channels", messagesRoutes);

ViteExpress.bind(
  app,
  server.listen(3000, () => {
    console.log("Server is connected in 3000....");
  })
);