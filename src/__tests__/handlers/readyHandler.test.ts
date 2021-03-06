import { GuildManager } from "discord.js";

const get = jest.fn(() => ({ commands: { create } }));
const create = jest.fn();
const mockGuild = {
  cache: {
    get: get as Partial<GuildManager["cache"]["get"]>,
  } as Partial<GuildManager["cache"]>,
} as GuildManager;

beforeEach(() => {
  get.mockClear();
  create.mockClear();
});

describe("getReadyHandler(guilds)", () => {
  let getReadyHandler = require("../../handlers").getReadyHandler;

  test("should return a handler.", () => {
    expect(getReadyHandler({} as GuildManager)).toBeInstanceOf(Function);
  });

  test("() should not call guilds.cache.get at non-development stage", () => {
    getReadyHandler(mockGuild)();

    expect(mockGuild.cache.get).not.toHaveBeenCalled();
  });

  test("() should call guilds.cache.get and call guilds.cache.get(id).commands.create at development stage", () => {
    jest.resetModules();
    process.env.NODE_ENV = "development";
    getReadyHandler = require("../../handlers").getReadyHandler;

    getReadyHandler(mockGuild)();

    expect(mockGuild.cache.get).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();

    process.env.NODE_ENV = "test";
  });
});
