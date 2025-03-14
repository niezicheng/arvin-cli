import typescript from "rollup-plugin-typescript2";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts", // 修改为您的入口文件
  output: {
    dir: "dist", // 输出目录
    format: "esm", // 输出格式
  },
  plugins: [
    externals({
      devDeps: false, // 可以识别我们 package.json 中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
    }),
    typescript(),
    json(),
  ],
};
