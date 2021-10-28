import { Message, PartialTextBasedChannelFields } from "discord.js";
import { messageHandler } from "../../handlers";
import config from "../../config";

describe("messageHandler should", () => {
  test("skip messages not starting with `${prefix}help`.", async () => {
    const mockMessage = {
      content: "I am an innocent content.",
      channel: {
        send: jest.fn(),
      } as PartialTextBasedChannelFields,
    } as Message;

    await messageHandler(mockMessage);

    expect(mockMessage.channel.send).not.toHaveBeenCalled();
  });

  test("call mockMessage.channel.send", async () => {
    const mockMessage = {
      content: `${config.prefix}help me!`,
      channel: {
        send: jest.fn(),
      } as PartialTextBasedChannelFields,
    } as Message;

    await messageHandler(mockMessage);

    expect(mockMessage.channel.send).toHaveBeenCalled();
  });
});
