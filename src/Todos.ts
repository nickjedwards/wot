export default class Todos {
    constructor(private todos: string[] = []) {}

    public add(todo: string): string[] {
        this.todos.push(todo)

        return this.todos
    }

    public done(index: number): string[] {
        if (typeof this.todos[index - 1] !== "undefined") {
            let message: string = ""

            this.todos.splice(index - 1, 1).forEach((todo: string) => {
                message += `${String.fromCodePoint(0x2714)} ${todo}\n`
            })

            process.stdout.write(message)
        }

        return this.todos
    }

    public list(): void {
        let message: string = ""

        this.todos.forEach((todo: string, index: number) => {
            message += `${String.fromCodePoint(0x1F4C5)} ${index + 1}: ${todo}\n`
        })

        process.stdout.write(message)
    }
}
