import { ActorRefFrom, sendParent } from "xstate"
import { createModel } from "xstate/lib/model"

interface Todo extends Omit<ITodo, "ref"> {}

export interface ITodo {
  id: number;
  title: string;
  done: boolean;
  ref: ActorRefFrom<ReturnType<typeof createTodoMachine>>;
}

const todoModel = createModel(
  {
    id: 0,
    title: "",
    done: false,
  },
  {
    events: {
      EDIT: () => ({}),
      COMMIT: () => ({}),
    },
  }
)

const createTodoMachine = ({ id, title, done }: Todo) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHQBOYuEZUAxAMoCiyA+gAoBKA8l2aJQAB1SxiAF2KpSwkAA9EARgCcABgqqAbAHYALPtUBWAMzKAHNovGANCACeiVcor7dxgEymrxo6etTAF8Q+1J0OHk0DBwCEnJqWnpSKHkxCWlZeSUEAPsnBAt9LV1lU30-b09dav1QkGisPCIySgAbVDpINPEpGTkkRURTEYpqi10R-W11DV98xCKSsor9KpqDesbYlvIejP7slU8FhGVXVUvVCxv1ayKNXRCQoA */
  todoModel.createMachine(
    {
      // tsTypes: {} as import("./todo.machine.typegen").Typegen0,
      id: "Todo Machine",
      context: { id, title, done },
      initial: "reading",
      states: {
        reading: {
          on: {
            EDIT: {
              target: "editing",
              actions: "focusInput",
            },
          },
        },
        editing: {
          // entry: todoModel.assign({ prevTitle: (context) => context.title }),
          on: {
            COMMIT: [
              {
                target: "reading",
                actions: sendParent(context => ({
                  type: "TODO_COMMIT",
                  todo: context,
                })),
                cond: context => context.title.trim().length > 0,
              },
              { target: "deleted" },
            ],
          },
        },
        deleted: {
          entry: sendParent(context => ({
            type: "TODO_COMMIT",
            id: context.id,
          })),
        },
      },
    }
    // {
    //   actions: {
    //     commit: sendParent(context => ({
    //       type: "TODO_COMMIT",
    //       todo: context,
    //     })),
    //     focusInput: () => {},
    //   },
    // }
  )

export default createTodoMachine
