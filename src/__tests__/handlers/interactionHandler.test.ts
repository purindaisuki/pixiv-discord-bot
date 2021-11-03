import { Interaction } from "discord.js";
import { getInteractionHandler } from "../..//handlers";
import PixivAPI from "../../pixiv";
import { mockInteraction } from "../../__mocks__";

jest.mock("../../pixiv", () => jest.fn());

const pixiv = new PixivAPI("");

describe("getInteractionHandler(pixiv)", () => {
  test("should return a handler.", () => {
    expect(getInteractionHandler(pixiv)).toBeInstanceOf(Function);
  });

  describe("(interaction)", () => {
    beforeEach(() => {
      mockInteraction.isCommand.mockClear();
      mockInteraction.editReply.mockClear();
    });

    test("should editReply error message when errors happened when executing a command.", async () => {
      mockInteraction.isCommand.mockReturnValueOnce(true);

      await getInteractionHandler(pixiv)({
        ...mockInteraction,
        commandName: "followed",
      } as Interaction);

      expect(mockInteraction.editReply).toBeCalledWith({
        content: "Error",
      });
    });

    test("should return undefined when interaction is not a command interaction.", async () => {
      mockInteraction.isCommand.mockReturnValueOnce(false);

      await getInteractionHandler(pixiv)(mockInteraction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.editReply).toBeCalledTimes(0);
    });

    test("should return undefined when interaction.commandName not in defined commands.", async () => {
      mockInteraction.isCommand.mockReturnValueOnce(true);

      await getInteractionHandler(pixiv)(mockInteraction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.editReply).toBeCalledTimes(0);
    });

    test("should call interaction.editReply.", async () => {
      pixiv.fetchFollowedIllusts = jest.fn(() =>
        Promise.resolve({ illusts: [], next_url: "" })
      );
      mockInteraction.isCommand.mockReturnValueOnce(true);

      await getInteractionHandler(pixiv)({
        ...mockInteraction,
        commandName: "followed",
      } as Interaction);

      expect(mockInteraction.isCommand).toBeCalledTimes(1);
      expect(mockInteraction.editReply).toBeCalledTimes(1);
    });
  });
});
