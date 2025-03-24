import simpleGit, { SimpleGit } from "simple-git";
import chalk from "chalk";
import path from "path";
import { spawn } from "child_process";
import ora from "ora";
import fs from "fs-extra";
import { packageName, simpleGitOptions } from "../const";
import { log } from "./log";
import { selectConfirm, createLoggerSpinner, welcomePrinter } from "./helper";

const logger = createLoggerSpinner();

// 安装项目依赖
const installDependencies = (name: string): Promise<void> => {
  const projectDir = path.join(process.cwd(), name);

  return new Promise((resolve, reject) => {
    const npmInstall = spawn("npm", ["install", "--verbose", "--force"], {
      cwd: projectDir,
      stdio: "inherit", // 将子进程的输出直接映射到父进程（当前进程）的输出
      shell: true, // 使用 shell，确保命令在 Windows 和其他平台上都能运行
    });

    npmInstall.on("close", (code: Number) => {
      if (code === 0) {
        console.log(chalk.green("依赖安装成功"));
        resolve();
      } else {
        reject(`依赖安装失败，退出代码: ${code}`);
      }
    });

    npmInstall.on("error", (err: any) => {
      reject(`依赖安装时发生错误: ${err.message}`);
    });
  });
};

/**
 * 运行项目
 * @param name 项目名称
 * @returns
 */
export const runProject = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const projectDir = path.join(process.cwd(), name);
    const spinnerTip = ora("项目启动中...").start();

    // 检查项目目录是否存在
    if (!fs.existsSync(projectDir)) {
      spinnerTip.fail("项目目录不存在");
      reject(new Error("项目目录不存在"));
      return;
    }

    // 使用 spawn 执行 pnpm run serve
    const serveProcess = spawn("pnpm", ["dev"], {
      cwd: projectDir,
      stdio: "pipe", // 子进程的输出流式处理
      shell: true, // 确保在跨平台运行时正常
    });
    let isResolved = false; // 标记是否已经完成
    serveProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(chalk.green(output)); // 实时打印日志

      // 检测到启动完成的标志
      if (!isResolved && output.includes("App running at")) {
        isResolved = true; // 确保只调用一次
        spinnerTip.succeed("项目启动成功！");
        resolve(); // 完成 Promise
      }
    });

    serveProcess.stderr.on("data", (data) => {
      console.error(chalk.red(data.toString()));
    });

    serveProcess.on("close", (code: Number) => {
      if (code !== 0) {
        spinnerTip.fail("项目启动失败");
        reject(new Error(`项目启动失败，退出代码: ${code}`));
      }
    });

    serveProcess.on("error", (err: any) => {
      spinnerTip.fail("项目启动失败");
      reject(new Error(`项目启动失败: ${err.message}`));
    });
  });
};

export const clone = async (
  url: string,
  name: string,
  options: string[]
): Promise<any> => {
  // 项目文件夹不存在则创建
  const git: SimpleGit = simpleGit(simpleGitOptions);
  try {
    // 下载代码并展示预估时间进度条
    await logger(git.clone(url, name, options), "代码下载中: ", {
      estimate: 8000, // 预估时间
    });

    // 下面就是一些相关的提示
    console.log();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.blueBright(`=== 欢迎使用 ${packageName} 脚手架 ===`));
    console.log(chalk.blueBright(`==================================`));
    console.log();

    log.success(`项目创建成功 ${chalk.blueBright(name)}`);
    log.success(`执行以下命令启动项目：`);
    log.info(`cd ${chalk.blueBright(name)}`);
    log.info(`${chalk.yellow("pnpm")} install`);
    log.info(`${chalk.yellow("pnpm")} run dev`);

    welcomePrinter();
    const isInstallDeps = await selectConfirm(
      `是否安装需要安装依赖并启动项目？依赖安装可能耗时较长`
    );
    if (isInstallDeps) {
      // 安装依赖
      await installDependencies(name);
      // 运行项目
      await runProject(name);
    }
  } catch (err: any) {
    log.error("下载失败");
    log.error(String(err));
  }
};
