import fs from "fs"

interface ITodos {
    [key: string]: string[]
}

export default class Todos {
    private todos: ITodos

    constructor(private file: string) {
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
                message += `${String.fromCodePoint(0x2714)} ${todo}\n`
            })

            this.write()

            process.stdout.write(message)
        }
    }

    public list(key: string): void {
        const todos: string[] = this.todos[key] || []

        let message: string = ""

        todos.forEach((todo: string, index: number) => {
            message += `${String.fromCodePoint(0x1F4C5)} ${index + 1}: ${todo}\n`
        })

        process.stdout.write(message)
    }

    protected read() {
        try {
            return JSON.parse(fs.readFileSync(this.file, "utf-8"))
        } catch (error) {
            process.stderr.write(`Cannot read file ${this.file}\n`)
            process.exit(1)
        }
    }

    protected write() {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.todos), "utf-8")
        } catch (error) {
            process.stderr.write(`Cannot write file ${this.file}\n`)
            process.exit(1)
        }
    }
}
