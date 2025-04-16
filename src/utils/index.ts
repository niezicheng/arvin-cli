import axios from 'axios';
import { gt } from 'lodash-es';
import chalk from 'chalk';
import ora from 'ora';
import { log } from './log';

export * from "./log";
export * from "./clone";
export * from "./helper";

/**
 * 版本检查工具
 */
export const versionChecker = {
  async check(name: string, curVersion: string) {
    const npmUrl = `https://registry.npmjs.org/${name}/latest`;
    try {
      const { data } = await axios.get(npmUrl);
      const latestVersion = data?.version;
      const isNeedUpdate = gt(latestVersion, curVersion);
      if (isNeedUpdate) {
        log.info(
          `检测到 ${name} 最新版本: ${chalk.blueBright(latestVersion)}`
        );
        log.info(
          `当前版本: ${chalk.blueBright(curVersion)}`
        );
        log.info(
          `建议使用 ${chalk.yellow("pnpm install")} ${name}@latest 进行更新`
        );
      }
      return { latestVersion, needUpdate: isNeedUpdate };
    } catch (err) {
      log.error(`版本检查失败: ${err}`);
      return { latestVersion: curVersion, needUpdate: false };
    }
  }
};

/**
 * 创建进度提示
 */
export const createSpinner = (text: string) => {
  const spinner = ora({
    text,
    color: 'cyan',
    spinner: 'dots'
  });
  return spinner;
};
