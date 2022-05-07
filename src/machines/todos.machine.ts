import { assign, createMachine, spawn } from "xstate"
import createTodoMachine from "./todo.machine"
import localTodos from "../data/todos.json"
import { createModel } from "xstate/lib/model"

const todosModel = createModel(
  {
    // todo: '',
    todosList: [] as ITodo[],
    // filter: 'all'
  },
  {
    events: {
      TODO_COMMIT: (todo: ITodo) => ({ todo }),
      TODO_DELETE: (id: string) => ({ id }),
    },
  }
)

const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FWwAQFkCGAxgBYCWAdmAHQwAuaGsAxBhZeQG6oDWV9muhUq1p9YCDqgJ4aJVGQDaABgC6iUAAdMJGXLUgAHogBMANiOUAzAHYrAVgCcd2xcf2AHABoQAT0QBGKwtKABYjYOCTK0VQ6NsTAF94r1EBYnIqEXRMRjAAJ1zUXMp1ABtpADNCgFtKFPw04TA6LLEJKR0FFT1NWG1ZMj1DBFNzaztHW2dXTx9jUMt7WzcXNyMLYNtg+wtE5JbUoTBGZAB5ABETgH0AYROcHABJZG6tDsHjKMo3baM1qIsjH5FPZgl5fAhbJQjI4AvZ3FZgn4jIoTLZEkkQGR0HA9HVBOlqE1RC9em8kAZEKEwf4QVCTBZFEYllE-G4-DsMXiGrwslhyk1iJASX1dOShhEgssliDVkYrGyLNSEH5IiFkXEmcyLCY-LsQFzDpQAGICohYPIFXLCsmgcX0r4WaXBWXy9lKtYmBZ+baRYKKb5+XWc-b1Q18LAEVBVKraIXknoigZi4xmSw2BxOFxWdxKoHBELOdnItyKKwmH16g3pa39d7KmbggC02covtZ9hMG1RzPR8SAA */
  todosModel.createMachine(
    {
      // tsTypes: {} as import("./todos.machine.typegen").Typegen0,
      // schema: {
      //   context: {} as {
      //     todosList: ITodo[]
      //   },
      //   services: {} as {
      //     fetchTodos: {
      //       data: ITodo[]
      //     }
      //   },
      // },
      id: "Todos Machine",
      context: {
        todosList: [],
      },
      initial: "getTodos",
      states: {
        getTodos: {
          invoke: {
            src: "fetchTodos",
            onDone: [
              {
                target: "Todo fetched",
              },
            ],
            onError: [
              {
                target: "Fetch error",
              },
            ],
          },
        },
        "Todo fetched": {},
        "Fetch error": {},
        "Todo commited": {},
      },
      on: {
        TODO_COMMIT: {
          actions: [
            todosModel.assign({
              todosList: (context, event) =>
                context.todosList.map(todo => {
                  return todo.id === event.todo.id
                    ? { ...todo, ...event.todo, ref: todo.ref }
                    : todo
                }),
            }),
            "persist",
          ],
        },
      },
    },
    {
      services: {
        fetchTodos: async ctx =>
          
          (ctx.todosList = localTodos.map(todo => ({
            ...todo,
            ref: spawn(createTodoMachine(todo)),
          }))),
      },
    }
  )

export default todosMachine
