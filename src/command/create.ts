import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import path from "path";
import chalk from "chalk";
import {
  templateInfo,
  packageName,
  packageVersion
} from "../const";
import { log, clone, selectConfirm, versionChecker, createSpinner } from "../utils";
import { ITemplateInfo } from "../types";

/**
 * 创建项目
 * @param name 项目名称
 * @returns
 */
export default async function create(name: string) {
  try {
    // 检测版本更新
    await versionChecker.check(packageName, packageVersion);

    // 文件名称未传入需要输入
    if (!name) {
      name = await input({
        message: "请输入项目名称",
        validate: (input) => {
          if (!input.trim()) {
            return "项目名称不能为空";
          }
          if (!/^[a-zA-Z\-_\d]+$/.test(input)) {
            return "项目名称只能包含字母、数字、下划线和横线";
          }
          return true;
        }
      });
    }

    // 判断文件是否存在
    const filePath = path.resolve(process.cwd(), name);
    if (fs.existsSync(filePath)) {
      const run = await selectConfirm(`文件夹 ${chalk.yellow(name)} 已存在, 是否覆盖?`);
      if (run) {
        const spinner = createSpinner("正在清理已存在的文件夹...");
        spinner.start();
        await fs.remove(filePath);
        spinner.succeed("文件夹清理完成");
      } else {
        log.info("操作已取消");
        return;
      }
    }

    // 模板选择数据
    const templateList = [...templateInfo.entries()].map(
      ([name, info]: [string, ITemplateInfo]) => ({
        name: `${name} ${chalk.gray(`- ${info.description}`)}`,
        value: name,
        description: info.description,
      })
    );

    // 选择模板
    const templateName = await select({
      message: "请选择需要初始化的模板:",
      choices: templateList,
    });

    // 下载模板
    const gitRepoInfo = templateInfo.get(templateName);
    if (!gitRepoInfo) {
      throw new Error(`模板 ${templateName} 不存在`);
    }

    const spinner = createSpinner("正在下载模板...");
    spinner.start();

    try {
      await clone(gitRepoInfo.downloadUrl, name, ["-b", `${gitRepoInfo.branch}`]);
      spinner.succeed("模板下载完成");

      // 项目创建成功的提示
      log.success(`
项目 ${chalk.green(name)} 创建成功！

你可以执行以下命令开始开发：

  ${chalk.cyan(`cd ${name}`)}
  ${chalk.cyan("pnpm install")}
  ${chalk.cyan("pnpm dev")}
      `);
    } catch (err) {
      spinner.fail("模板下载失败");
      throw err;
    }
  } catch (error) {
    log.error(`创建项目失败: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
