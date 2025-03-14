import typescript from "rollup-plugin-typescript2";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts", // 入口文件
  output: [
    {
      dir: "dist",
      format: "esm",
    },
  ],
  plugins: [
    externals({
      devDeps: false, // 可以识别我们 package.json 中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
    }),
    typescript(), // 解析 TypeScript
    json(), // 解析 JSON
    // terser(), // 压缩代码
    nodeResolve(), // 解析 node_modules 中的第三方模块
  ],
  external: ["chalk"],
};
