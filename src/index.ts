import { Command } from "commander";
import { version } from "../package.json";
import create from "./command/create";

const program = new Command("arvin-cli");
program.version(version, "-v , --version");

program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action(async (name: string) => {
    await create(name);
  });

program.parse(process.argv);
