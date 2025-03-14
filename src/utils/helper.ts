import { select } from "@inquirer/prompts";
import { reverse } from "lodash-es";

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
