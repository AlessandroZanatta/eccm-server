import { serve } from "@hono/node-server";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port: PORT }, () => {
	console.log(`ECCM server at http://0.0.0.0:${PORT}`);
});
