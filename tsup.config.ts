import { defineConfig } from "tsup";

// const env = process.env.NODE_ENV;

export default defineConfig({
  entry: ["src/package/index.tsx"],
  clean: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  target: ["es2022"],
  minify: true,
  bundle: true,
  outDir: "dist",
  external: ["react", "react-dom"],
  splitting: true,
  dts: true,
  tsconfig: "src/package/tsconfig.json",
});
