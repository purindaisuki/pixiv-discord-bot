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
    const getInteger = jest.fn();
    const mockInteraction = mocked({
      commandName: "nonExistCommand",
      isCommand: jest.fn(() => true) as Partial<
        CommandInteraction["isCommand"]
      >,
      reply: jest.fn() as CommandInteraction["reply"],
      options: { getInteger } as Partial<CommandInteraction["options"]>,
    } as CommandInteraction);

    beforeEach(() => {
      mockInteraction.isCommand.mockClear();
      mockInteraction.reply.mockClear();
      getInteger.mockClear();
    });

    test("should reply error message when errors happened when executing a command.", async () => {
      mockInteraction.commandName = "followed";
      getInteger.mockImplementationOnce(() => {
        throw new Error();
      });

      await getInteractionHandler(pixiv)({ ...mockInteraction });

      expect(mockInteraction.reply).toBeCalledWith({
        content: "Error",
        ephemeral: true,
      });

      mockInteraction.commandName = "nonExistCommand";
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

      mockInteraction.commandName = "nonExistCommand";
    });
  });
});
