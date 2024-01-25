import { Command } from "commander";

const program = new Command();

program.option("-p, --persistence <persistence>", "Persistence");
program.parse();

export const opts = program.opts();