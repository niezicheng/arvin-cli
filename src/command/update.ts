import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import os from "os";
import { packageName } from "../const";
import { createSpinner, log } from "../utils";

const execAsync = promisify(exec);

/**
 * 获取平台相关的更新命令
 */
function getUpdateCommand() {
  const platform = os.platform();
  const isWindows = platform === "win32";
  const isUnix = platform === "linux" || platform === "darwin";

  if (isWindows) {
    return {
      normal: `npm install ${packageName}@latest -g`,
      elevated: "以管理员身份运行命令提示符，然后执行更新命令",
    };
  }

  if (isUnix) {
    return {
      normal: `npm install ${packageName}@latest -g`,
      elevated: `sudo npm install ${packageName}@latest -g`,
    };
  }

  return {
    normal: `npm install ${packageName}@latest -g`,
    elevated: "请使用管理员权限执行更新命令",
  };
}

/**
 * 更新CLI工具到最新版本
 */
export default async function update() {
  const spinner = createSpinner(`正在更新 ${packageName}`);
  const { normal, elevated } = getUpdateCommand();

  try {
    spinner.start();
    await execAsync(normal);
    spinner.succeed(`${packageName} 更新成功`);
    
    log.success(`
现在你可以继续使用最新版本的 ${chalk.green(packageName)} 了！
    `);
  } catch (error: unknown) {
    spinner.fail("更新失败");
    
    const err = error as Error;
    
    // 处理权限错误
    if (err.message.includes("EACCES")) {
      log.error("没有足够的权限执行更新操作");
      log.info(`
请尝试使用以下命令重新更新:

${chalk.cyan(elevated)}
      `);
      return;
    }

    // 处理网络错误
    if (err.message.includes("ETIMEDOUT") || err.message.includes("ECONNREFUSED")) {
      log.error("网络连接失败，请检查你的网络连接后重试");
      return;
    }

    // 其他错误
    log.error(`更新失败: ${err.message}`);
  }
}
