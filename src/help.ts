import config from "./config";

const { optionPrefix: op } = config;

export default {
  help: {
    description: "Shows the list of commands or help on specified command.",
    format: `help [command-name]`,
  },
  s: {
    description: "Search illustrations by word",
    flags: {
      l: "return the latest results, default",
      p: "return the most popular results",
      "%number%": "return the first %number% results, default: 1, max: 10",
    },
    format: `s [${op}l | ${op}p] [${op}number] <word>`,
  },
};
