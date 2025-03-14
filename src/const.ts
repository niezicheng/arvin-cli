import { SimpleGitOptions } from "simple-git";
import { ITemplateInfo } from "./types";

export const templateInfo: Map<string, ITemplateInfo> = new Map([
  [
    "vue3-vite-ts-pnpm-template",
    {
      name: "Vue Admin",
      downloadUrl: "https://github.com/niezicheng/vue3-vite-ts-pnpm", // 为提高github 访问速度，使用 kk 来加速
      description: "Vue3 技术栈前端开发模板",
      branch: "main",
    },
  ],
  [
    "react18-vite-ts-pnpm-template",
    {
      name: "React Admin",
      downloadUrl: "https://github.com/niezicheng/react18-vite-ts-pnpm", // 目前还没有开发React 技术栈模版，暂时用Vue 替代
      description: "React 技术栈前端开发模板",
      branch: "main",
    },
  ],
  [
    "micro-frontends-qiankun-template",
    {
      name: "micro-frontends-qiankun",
      downloadUrl: "https://github.com/niezicheng/micro-frontends-qiankun", // 目前还没有开发React 技术栈模版，暂时用Vue 替代
      description: "Micro 微前端开发模板（qiankun）",
      branch: "main",
    },
  ],
]);

export const simpleGitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: "git", // git命令
  maxConcurrentProcesses: 6, // 最大并发进程数
};
