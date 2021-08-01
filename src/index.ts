#!/usr/bin/env node

import fs from "fs"
import os from "os"
import path from "path"
import { Command, OptionValues } from "commander"
import Todos from "./Todos"

const file: string = path.resolve(os.homedir(), ".config", "wot", "todo.json")

if (!fs.existsSync(file)) {
    if (!fs.existsSync(path.dirname(file))) {
        fs.mkdirSync(path.dirname(file), { recursive: true })
    }

    fs.writeFileSync(file, JSON.stringify({}), "utf-8")
}

const program = new Command()

program.version(process.env.npm_package_version || "0.0.0", "-v, --version", "Output the current version")

program.command("add <todo>")
    .option('-p, --project', "Project todo")
    .description("Got anything else on today?")
    .action((todo: string, options: OptionValues): void => {
        const project: string = options.project ? process.cwd() : os.homedir()

        new Todos(file).add(project, todo)
    })

program.command("done <index>")
    .option('-p, --project', "Project todo")
    .description("Done anything today?")
    .action((index: number, options: OptionValues): void => {
        const project: string = options.project ? process.cwd() : os.homedir();

        new Todos(file).done(project, index)
    })

program.command("list")
    .option('-p, --project', "Project todo")
    .option('-a, --all', "What's on today?")
    .description("What's on today?")
    .action((options: OptionValues): void => {
        let project: string | null = options.project ? process.cwd() : os.homedir()

        if (options.all) {
            project = null
        }

        new Todos(file).list(project)
    })

program.parse(process.argv)
