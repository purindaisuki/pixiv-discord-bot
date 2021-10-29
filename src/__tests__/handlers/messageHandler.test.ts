import { Message, PartialTextBasedChannelFields } from "discord.js";
import { messageHandler } from "../../handlers";
import config from "../../config";

const send = jest.fn();
const mockMessage = {
  content: "I am an innocent content.",
  channel: { send } as PartialTextBasedChannelFields,
} as Message;

beforeEach(() => {
  send.mockClear();
});

describe("messageHandler should", () => {
  test("skip messages not starting with `${prefix}help`.", async () => {
    await messageHandler(mockMessage);

    expect(mockMessage.channel.send).not.toHaveBeenCalled();
  });

  test("call mockMessage.channel.send", async () => {
    mockMessage.content = `${config.prefix}help me!`;

    await messageHandler(mockMessage);

    expect(mockMessage.channel.send).toHaveBeenCalled();

    mockMessage.content = "I am an innocent content.";
  });
});
