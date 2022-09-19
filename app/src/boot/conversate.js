import { ConversateInitializer } from "../client";

const cs = new ConversateInitializer()
cs.cxOneConnect("ws://127.0.0.1:6001", 2)