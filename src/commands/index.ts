import { Collection } from "discord.js";
import { search } from "./search";
import { ranking } from "./ranking";
import { latest } from "./new";
import { recommend } from "./recommend";
import { followed } from "./followed";

const makeTuple = <A extends any, B extends any>([a, b]: [A, B]): [A, B] => [
  a,
  b,
];

export const commandsCollection = new Collection(
  Object.values([search, ranking, latest, recommend, followed]).map((command) =>
    makeTuple([command.data.name, command])
  )
);
