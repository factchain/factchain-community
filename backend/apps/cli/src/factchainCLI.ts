#!/usr/bin/env node
import chalk from "chalk";
import commandLineArgs, { OptionDefinition } from "command-line-args";
import commandLineUsage, { Content } from "command-line-usage";

import commands from "./commands";

interface FactchainCommand {
  command?: string;
  subCommands?: FactchainCommand[];
  description?: string;
  help?: Content[];
  run?: (arg0: any) => void;
  options?: OptionDefinition[];
  positionals?: boolean;
  allowNoPositional?: boolean;
}

async function runCLI(overrideArgv?: string[]): Promise<void> {
  const accumulatedOptions = {};
  const accumulatedOptionsChoices: any[] = [];
  let help = false;

  return parseOptionsAndRun(commands, overrideArgv);

  async function parseOptionsAndRun(_cmd: FactchainCommand, argv?: string[]) {
    // istanbul ignore next
    const cmd = { ..._cmd, options: _cmd.options || [] };
    // istanbul ignore next
    accumulatedOptionsChoices.unshift(...(cmd.options || []));
    /* istanbul ignore next */
    const definitions = cmd.subCommands
      ? [{ name: "command", defaultOption: true }, ...(cmd.options || [])]
      : cmd.positionals
      ? [
          { name: "positionals", defaultOption: true, multiple: true },
          ...(cmd.options || []),
        ]
      : cmd.options;

    const options = commandLineArgs(definitions, {
      argv,
      partial: true,
    });

    Object.assign(accumulatedOptions, options);

    // @ts-ignore
    delete accumulatedOptions._unknown;
    const _argv = options._unknown || [];
    if (!help) {
      definitions.forEach((optionDefinition) => {
        if (
          // @ts-ignore: we sneakily injected it here
          optionDefinition.required &&
          !(optionDefinition.name in accumulatedOptions)
        ) {
          // eslint-disable-next-line no-console
          console.log(
            chalk`{red.bold ERROR} {red missing required option --${optionDefinition.name}}`,
          );
          process.exit(1);
        }
      });
    }

    help =
      help ||
      options.help ||
      (cmd.subCommands && !options.command) ||
      /* istanbul ignore next */
      (cmd.positionals && !options.positionals && !cmd.allowNoPositional);

    if (cmd.subCommands) {
      const subCommand = cmd.subCommands.find(
        (cmd) => cmd.command === options.command,
      );
      if (!subCommand) {
        showHelp();
        return;
      }
      await parseOptionsAndRun(subCommand, _argv);
      return;
    }
    // @ts-ignore

    //__patchGateOptionsWithEnvVariables(accumulatedOptions);

    if ("debug" in accumulatedOptions) {
      process.env.DEBUG = "1";
    }

    // don't know how to trigger this if
    // istanbul ignore next
    if (help) {
      showHelp();
      return;
    }

    if (cmd.run) {
      try {
        await cmd.run(accumulatedOptions);
        // istanbul ignore if
        if (!overrideArgv) {
          process.exit(0);
        }
      } catch (err) /* istanbul ignore next */ {
        if (overrideArgv) {
          throw err;
        }
        // @ts-expect-error
        // eslint-disable-next-line no-console
        console.log(chalk`{red.bold ERROR} {red ${err.toString()}}`);
        if (process.env.DEBUG) {
          // @ts-expect-error
          // eslint-disable-next-line no-console
          console.log(err.stack);
        }
        process.exit(1);
      }
    }

    function showHelp() {
      const opts1 = accumulatedOptionsChoices.filter(
        (opt) => !isGlobalOpt(opt),
      );
      const opts2 = accumulatedOptionsChoices.filter(isGlobalOpt);
      const hasOptions = opts1.length > 0;

      const helpText = commandLineUsage([
        {
          content: cmd.description,
        },
        ...(cmd.help || []),
        ...(cmd.subCommands
          ? [
              {
                header: "Commands",
                content: cmd.subCommands.map((cmd) => ({
                  name: cmd.command,
                  summary: cmd.description,
                })),
              },
            ]
          : /* istanbul ignore next */ []),
        ...(hasOptions
          ? [
              {
                header: "Options",
                optionList: opts1.map((opt) => {
                  return {
                    ...opt,
                    ...(opt.required
                      ? /* istanbul ignore next */ {
                          description: `{red.bold *} ${opt.description}`,
                        }
                      : {}),
                  };
                }),
              },
            ]
          : /* istanbul ignore next */ []),
        {
          header: "Global options",
          optionList: opts2,
        },
      ]);
      // eslint-disable-next-line no-console
      console.log(helpText.trim());
      // eslint-disable-next-line no-console
      console.log("");
    }
  }
}

const isGlobalOpt = (opt: OptionDefinition) => {
  const GLOBAL_OPTIONS = ["help", "debug", "version"];
  return GLOBAL_OPTIONS.includes(opt.name);
};

export default runCLI;
