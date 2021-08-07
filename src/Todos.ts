import fs from "fs"
import path from "path"
import chalk from "chalk"
import Icons from "./Icons"

interface ITodos {
    [key: string]: string[]
}

export default class Todos {
    private todos: ITodos

    /**
     * Creates an instance of todos.
     *
     * @param file Path to json file.
     */
    public constructor(private file: string) {
        this.todos = this.read()
    }

    /**
     * Adds a new todo to json file.
     *
     * @param key Project directory.
     * @param todo Todo to add.
     */
    public add(key: string, todo: string): void {
        this.todos[key] = [...this.todos[key] || [], todo]

        this.write()
    }

    /**
     * Removes a todo from json file.
     *
     * @param key Project directory.
     * @param index Todo index in `key`.
     */
    public done(key: string, index: number): void {
        const todos: string[] = this.todos[key] || []

        if (todos[index - 1] !== "undefined") {
            let message: string = ""

            todos.splice(index - 1, 1).forEach((todo: string) => {
                message += chalk.green(String.fromCodePoint(Icons.Check), chalk.strikethrough(`${todo}\n`))
            })

            this.write()

            process.stdout.write(message)
        }
    }

    /**
     * Lists todos in json file.
     *
     * @param key Project directory.
     */
    public list(key: string | null): void {
        const message: string = key ? this.project(key) : this.all()

        process.stdout.write(message)
    }

    /**
     * Returns output string for listing project todos.
     *
     * @param key Project directory.
     * @returns Command output message.
     */
    protected project(key: string): string {
        let message: string = ""

        const todos: string[] = this.todos[key] || []

        todos.forEach((todo: string, index: number) => {
            message += `${chalk.yellow.bold(String.fromCodePoint(Icons.Memo), `${index + 1}:`)} ${todo}\n`
        })

        return message
    }

    /**
     * Returns output string for listing all todos.
     *
     * @returns Command output message.
     */
    protected all(): string {
        let message: string = ""

        for (const [project, todos] of Object.entries(this.todos)) {
            message += `${chalk.bold(String.fromCodePoint(Icons.Folder), path.basename(project))} (${project})\n`

            todos.forEach((todo: string) => {
                message += `${String.fromCodePoint(Icons.Memo)} ${todo}\n`
            })

            message += "\n"
        }

        return message
    }

    /**
     * Reads todos from json file.
     *
     * @returns Todos object.
     */
    protected read(): ITodos {
        try {
            return JSON.parse(fs.readFileSync(this.file, "utf-8"))
        } catch (error) {
            process.stderr.write(`Cannot read file ${this.file}\n`)
            process.exit(1)
        }
    }

    /**
     * Writes todos to json file.
     */
    protected write(): void {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.todos), "utf-8")
        } catch (error) {
            process.stderr.write(`Cannot write file ${this.file}\n`)
            process.exit(1)
        }
    }
}
