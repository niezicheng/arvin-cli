import { select } from "@inquirer/prompts";
import { reverse } from "lodash-es";
import ora, { Spinner } from "ora";
import chalk from "chalk";
import createLogger from "progress-estimator";
import figlet from "figlet";
import { packageName } from "../const";

const YES_OR_NO_CHOICES = [
  { name: "Yes", value: true },
  { name: "No", value: false },
];

/**
 * 选择确认询问
 * @param message 询问信息
 * @param options 选项
 * @returns
 */
export const selectConfirm = async (
  message: string,
  isReverse = false,
  options = {}
) => {
  return await select({
    choices: isReverse ? reverse(YES_OR_NO_CHOICES) : YES_OR_NO_CHOICES,
    ...options,
    message,
  });
};

/**
 * 创建一个 spinner
 * @param text 提示文本
 * @param spinnerOptions spinner 配置
 * @returns ora 实例
 */
export const oraSpinner = (text?: string, spinnerOptions?: Spinner) => {
  return ora({
    text,
    spinner: {
      interval: 300,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
        chalk.blue(item)
      ), // 设置加载动画
      ...(spinnerOptions || {}),
    },
  });
};

/**
 * 创建一个 logger
 * @param createLoggerOptions logger 配置
 * @returns logger 实例
 */
export const createLoggerSpinner = (createLoggerOptions?: any) => {
  return createLogger({
    // 初始化进度条
    spinner: {
      interval: 300, // 变换时间 ms
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
        chalk.blue(item)
      ), // 设置加载动画
    },
    ...(createLoggerOptions || {}),
  });
};

/**
 * 欢迎打印
 */
export const welcomePrinter = () => {
  const data = figlet.textSync(`欢迎使用 ${packageName} 脚手架`, {
    font: "Standard",
  });
  console.log(chalk.rgb(40, 156, 193).visible(data));
};
