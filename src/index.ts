#!/usr/bin/env node

import fs from "fs"
import os from "os"
import path from "path"
import { Command, OptionValues } from "commander"
import Todos from "./Todos"

const file: string = path.resolve(os.homedir(), ".config", "wot", "todo.json")

if (!fs.existsSync(file)) {
    const configDir: string = path.dirname(file)

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
    }

    fs.writeFileSync(file, JSON.stringify({}), "utf-8")
}

const program = new Command()

program.version(process.env.npm_package_version || ":(", "-v, --version", "Output the current version")

program.command("add <todo>")
    .option('-p, --project', "Add a new todo for this project")
    .description("Create a new todo")
    .action((todo: string, options: OptionValues): void => {
        const project: string = options.project ? process.cwd() : os.homedir()

        new Todos(file).add(project, todo)
    })

program.command("done <index>")
    .option('-p, --project', "Complete a todo for this project")
    .description("Complete a todo")
    .action((index: number, options: OptionValues): void => {
        const project: string = options.project ? process.cwd() : os.homedir();

        new Todos(file).done(project, index)
    })

program.command("list")
    .option('-p, --project', "List your todos for this project")
    .option('-a, --all', "List all your todos")
    .description("List your todos")
    .action((options: OptionValues): void => {
        let project: string | null = options.project ? process.cwd() : os.homedir()

        if (options.all) {
            project = null
        }

        new Todos(file).list(project)
    })

program.parse(process.argv)
