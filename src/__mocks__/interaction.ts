import { CommandInteraction } from "discord.js";
import { mocked } from "ts-jest/utils";

export const mockInteractionOptions = mocked({
  getBoolean: jest.fn() as CommandInteraction["options"]["getBoolean"],
  getInteger: jest.fn() as CommandInteraction["options"]["getInteger"],
  getString: jest.fn() as CommandInteraction["options"]["getString"],
  getSubcommand: jest.fn() as CommandInteraction["options"]["getSubcommand"],
} as CommandInteraction["options"]);

export const mockInteraction = mocked({
  commandName: "nonExistCommand",
  deferReply: jest.fn() as CommandInteraction["deferReply"],
  editReply: jest.fn() as CommandInteraction["editReply"],
  isCommand: jest.fn() as CommandInteraction["isCommand"],
  options: mockInteractionOptions as Partial<CommandInteraction["options"]>,
} as CommandInteraction);
