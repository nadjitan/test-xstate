import { useActor } from "@xstate/react"
import { FC } from "react"
import DeleteIcon from "./DeleteIcon"

const Todo: FC<{ todo: ITodo }> = ({ todo }) => {
  const [state, send] = useActor(todo.ref)

  return (
    <div className="card-todo">
      <input
        type="checkbox"
        defaultChecked={state.context.done}
        name=""
        className="todo-check"
      />

      <h3 className="todo-title">{state.context.title}</h3>

      <button>
        <DeleteIcon />
      </button>
    </div>
  )
}

export default Todo
