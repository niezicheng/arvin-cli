import { Command } from "commander";
import create from "./command/create";
import update from "./command/update";
import { packageName, packageVersion } from "./const";

const program = new Command(packageName);
program.version(packageVersion, "-v , --version");

program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action(async (name: string) => {
    await create(name);
  });

program
  .command("update")
  .description(`更新 ${packageName} 到最新版本`)
  .action(() => {
    update();
  });

program.parse(process.argv);
