import { CommandInteraction } from "discord.js";
import { mocked } from "ts-jest/utils";
import { getInteractionHandler } from "../..//handlers";
import PixivAPI from "../../pixiv";

jest.mock("../../pixiv", () => jest.fn());

const pixiv = new PixivAPI("");

describe("getInteractionHandler(pixiv)", () => {
  test("should return a handler.", () => {
    expect(getInteractionHandler(pixiv)).toBeInstanceOf(Function);
  });

  describe("(interaction)", () => {
    const mockInteraction = mocked({
      commandName: "nonExistCommand",
      isCommand: jest.fn(() => true) as Partial<
        CommandInteraction["isCommand"]
      >,
      reply: jest.fn() as CommandInteraction["reply"],
      options: {
        getInteger: jest.fn(),
      } as Partial<CommandInteraction["options"]>,
    } as CommandInteraction);

    beforeEach(() => {
      mockInteraction.isCommand.mockClear();
      mockInteraction.reply.mockClear();
    });

    test("should return undefined when interaction is not a command interaction.", async () => {
      mockInteraction.isCommand.mockReturnValueOnce(false);
      await getInteractionHandler(pixiv)(mockInteraction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.reply).toBeCalledTimes(0);
    });

    test("should return undefined when interaction.commandName not in defined commands.", async () => {
      await getInteractionHandler(pixiv)(mockInteraction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.reply).toBeCalledTimes(0);
    });

    test("should call interaction.reply.", async () => {
      pixiv.fetchFollowedIllusts = jest.fn(() =>
        Promise.resolve({ illusts: [], next_url: "" })
      );
      mockInteraction.commandName = "followed";

      await getInteractionHandler(pixiv)(mockInteraction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.reply).toBeCalledTimes(1);
    });
  });
});
