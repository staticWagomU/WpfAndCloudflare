import { renderer } from "./renderer";
import type { FC } from "hono/jsx";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { release } from "./schema/release";
import { desc, eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
  MY_BUCKET: R2Bucket;
};

type Version = {
  version: string;
  releaseDate: string;
  releaseNote: string | null;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

const Versions: FC<{ versions: Version[] }> = ({ versions }) => (
  <div>
    <h1>WpfAndCloudflare Release Page</h1>
    <table style="border-collapse:collapse;" border={1}>
      <tr style="">
        <th>Version</th>
        <th>Release Date</th>
        <th>Download Link</th>
      </tr>
      {versions.map((version) => (
        <tr key={version.version}>
          <td> {version.version} </td>
          <td>{(new Date(version.releaseDate)).toDateString()}</td>
          <td>
            <a href={`/api/versions/${version.version}`}>ダウンロード</a>
          </td>
        </tr>
      ))}
    </table>
  </div>
);
app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(release).orderBy(desc(release.releaseDate),desc(release.version)).all();
  return c.html(<Versions versions={result} />);
});

app.get("/api/versions/:version", async (c) => {
  try {
    const version = c.req.param("version");
    const db = drizzle(c.env.DB);
    const result = await db
      .select()
      .from(release)
      .where(eq(release.version, version))
      .limit(1)
      .all();
    if (result === undefined || result.length !== 1) {
      return c.notFound();
    }

    const bucket = c.env.MY_BUCKET;
    const buecketObject = await bucket.get(`${version}/WpfAndCloudflare.exe`);
    if (buecketObject === null) {
      return c.notFound();
    }

    c.header("Content-Type", "application/octet-stream");
    c.header("etag", `"${buecketObject.etag}"`);
    c.header("Content-Disposition", "attachment; filename=WpfAndCloudflare.exe");
    c.status(200);

    return c.body(buecketObject.body);
  } catch (e) {
    return c.notFound();
  }
});

export default app;

