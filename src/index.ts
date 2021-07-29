#!/usr/bin/env node

import fs from "fs"
import os from "os"
import path from "path"
import { Command } from "commander"
import Todos from "./Todos"

let file: string = `${process.cwd()}/todo.json`

if (!fs.existsSync(file)) {
    file = `${os.homedir()}/.config/wip/todo.json`

    if (!fs.existsSync(path.dirname(file))) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify([]), "utf8")
    }
}

const todos: Todos = new Todos(JSON.parse(fs.readFileSync(file, "utf8")) || [])

const program = new Command()

program.command("add <todo>")
    .description("Got anything else on today?")
    .action((todo: string) => {
        fs.writeFileSync(file, JSON.stringify(todos.add(todo)), "utf8")
    })

program.command("done <index>")
    .description("Done anything today?")
    .action((index: number) => {
        fs.writeFileSync(file, JSON.stringify(todos.done(index)), "utf8")
    })

program.command("list")
    .description("What's on today?")
    .action(() => todos.list())

program.parse(process.argv)

process.exit(0)
