import process from "child_process";
import chalk from "chalk";
import os from "os";
import { packageName } from "../const";
import { oraSpinner } from "../utils";

const spinner = oraSpinner(`${packageName} 正在更新`);

export default function update() {
  spinner.start();

  process.exec(
    `npm install ${packageName}@latest -g`,
    (error, _stdout, stderr) => {
      spinner.stop();

      // 判断操作系统类型
      const platform = os.platform();

      // 如果安装没有权限
      if (error && stderr.includes("EACCES")) {
        console.log(
          chalk.red("没有权限进行全局安装。请尝试使用以下命令重试：")
        );
        if (platform === "linux" || platform === "darwin") {
          // 针对 Linux/macOS 系统
          console.log(
            chalk.yellow(
              "sudo npm install vp-cli-tools@latest -g  // 对于 Linux/macOS 用户"
            )
          );
        } else if (platform === "win32") {
          // 针对 Windows 系统
          console.log(chalk.yellow("管理员权限执行命令 // 对于 Windows 用户"));
        }
        return;
      }

      if (!error) {
        console.log(chalk.green("更新成功"));
      } else {
        console.log(chalk.red(error));
      }
    }
  );
}
