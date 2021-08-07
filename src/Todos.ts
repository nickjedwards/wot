import fs from "fs"
import path from "path"
import chalk from "chalk"

enum Icon {
    Check = 0x2714,
    Folder = 0x1F4C2,
    Memo = 0x1F4DD,
}

interface ITodos {
    [key: string]: string[]
}

export default class Todos {
    private todos: ITodos

    public constructor(private file: string) {
        this.todos = this.read()
    }

    public add(key: string, todo: string): void {
        this.todos[key] = [...this.todos[key] || [], todo]

        this.write()
    }

    public done(key: string, index: number): void {
        const todos: string[] = this.todos[key] || []

        if (todos[index - 1] !== "undefined") {
            let message: string = ""

            todos.splice(index - 1, 1).forEach((todo: string) => {
                message += chalk.green(String.fromCodePoint(Icon.Check), chalk.strikethrough(`${todo}\n`))
            })

            this.write()

            process.stdout.write(message)
        }
    }

    public list(path: string | null): void {
        const message: string = path ? this.project(path) : this.all()

        process.stdout.write(message)
    }

    protected project(project: string): string {
        let message: string = ""

        const todos: string[] = this.todos[project] || []

        todos.forEach((todo: string, index: number) => {
            message += `${chalk.yellow.bold(String.fromCodePoint(Icon.Memo), `${index + 1}:`)} ${todo}\n`
        })

        return message
    }

    protected all(): string {
        let message: string = ""

        for (const [project, todos] of Object.entries(this.todos)) {
            message += `${chalk.bold(String.fromCodePoint(Icon.Folder), path.basename(project))} (${project})\n`
            
            todos.forEach((todo: string) => {
                message += `${String.fromCodePoint(Icon.Memo)} ${todo}\n`
            })

            message += "\n"
        }

        return message
    }

    protected read(): ITodos {
        try {
            return JSON.parse(fs.readFileSync(this.file, "utf-8"))
        } catch (error) {
            process.stderr.write(`Cannot read file ${this.file}\n`)
            process.exit(1)
        }
    }

    protected write(): void {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.todos), "utf-8")
        } catch (error) {
            process.stderr.write(`Cannot write file ${this.file}\n`)
            process.exit(1)
        }
    }
}
