import { run } from "./src/app.ts";

run().catch((err) => {
  console.error("Error inesperado:", err);
  process.exit(1);
});
