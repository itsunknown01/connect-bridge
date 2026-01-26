import bodyParser from "body-parser";
import cors from "cors";

import cookieParser from "cookie-parser";

import { app, server } from "@/src/server/config/websockets.ts";
import {
  authRoutes,
  channelRoutes,
  messageRoutes,
  knowledgeRoutes,
  outcomeRoutes,
} from "./routes/index.ts";

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // set `RateLimit` and `RateLimit-Policy` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());

const corsOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use("/api", authRoutes);
app.use("/api", channelRoutes);
app.use("/api/channels", messageRoutes);
app.use("/api/channels", knowledgeRoutes);
app.use("/api/channels", outcomeRoutes);

server.listen(3000, () => {
  console.log("Server is connected in 3000....");
});
