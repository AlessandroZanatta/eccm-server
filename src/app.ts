import { readFileSync } from "fs";
import { Hono } from "hono";
import { join } from "path";
import { buildShim, readStore, writeStore, type Store } from "./store";

const HTML_FILE = join(__dirname, "..", "ECCM.html");

const app = new Hono();

app.get("/", (c) => {
  const store = readStore();
  const html = readFileSync(HTML_FILE, "utf8");
  const injected = html.replace("<head>", "<head>" + buildShim(store));
  return c.html(injected);
});

app.post("/api/store", async (c) => {
  const body = await c.req.json<Store>();
  if (!body || !body.current || !body.profiles) {
    return c.json({ error: "invalid store shape" }, 400);
  }
  writeStore(body);
  return c.json({ ok: true });
});

app.get("/api/store", (c) => c.json(readStore()));

app.get("/health", (c) => c.json({ ok: true }));

export default app;
