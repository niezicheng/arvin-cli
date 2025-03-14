import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import path from "path";
import axios from "axios";
import { gt } from "lodash-es";
import chalk from "chalk";
import {
  templateInfo,
  // packageName,
  // packageVersion
} from "../const";
import { log, clone, selectConfirm } from "../utils";
import { ITemplateInfo } from "../types";

/**
 * 检测版本更新
 * @param name 包名称
 * @param curVersion 当前版本
 */
export const checkVersion = async (name: string, curVersion: string) => {
  const npmUrl = `https://registry.npmjs.org/${name}/latest`;

  try {
    const { data } = await axios.get(npmUrl);
    const latestVersion = data?.version;
    const isNeedUpdate = gt(latestVersion, curVersion);
    if (isNeedUpdate) {
      log.info(
        `-----检测到 ${name} 最新版:${chalk.blueBright(
          latestVersion
        )} 当前版本:${chalk.blueBright(curVersion)} ~`
      );
      log.info(`可使用 ${chalk.yellow("pnpm")} install ${name}@latest 更新 ~`);
    }
  } catch (err) {
    log.error(err as string);
  }
};

/**
 * 创建项目
 * @param name 项目名称
 * @returns
 */
export default async function create(name: string) {
  // 文件名称未传入需要输入
  if (!name) {
    name = await input({ message: "请输入项目名称" });
  }

  // 判断文件是否存在, 存在则询问是否覆盖
  const filePath = path.resolve(process.cwd(), name);
  if (fs.existsSync(filePath)) {
    // 询问是否覆盖原文件
    const run = await selectConfirm(`文件 ${name} 已存在, 是否覆盖?`);
    if (run) {
      // 删除原文件
      await fs.remove(filePath);
    } else {
      return;
    }
  }

  // 模板选择数据
  const templateList = [...templateInfo.entries()].map(
    (item: [string, ITemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );

  // 检测版本更新【需发版到 npm 上】
  // await checkVersion(packageName, packageVersion);

  // 选择模板
  const templateName = await select({
    message: "请选择需要初始化的模板:",
    choices: templateList,
  });

  // 下载模板
  const gitRepoInfo = templateInfo.get(templateName);

  if (gitRepoInfo) {
    await clone(gitRepoInfo.downloadUrl, name, ["-b", `${gitRepoInfo.branch}`]);
  } else {
    log.error(`${templateName} 模板不存在`);
  }
}
