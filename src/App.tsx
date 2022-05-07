import { useMachine } from "@xstate/react"
import { FC, Suspense } from "react"
import "./App.css"
import SearchIcon from "./components/SearchIcon"
import Todo from "./components/Todo"
import todosMachine from "./machines/todos.machine"

const App: FC = () => {
  const [
    {
      value,
      context: { todosList },
    },
    send,
  ] = useMachine(todosMachine)

  const error = value === "errorFetchTodos"

  return (
    <div className="App">
      <div className="container-header">
        <div id="search">
          <input type="text" className="input-search" placeholder="Search..." />
          <button>
            <SearchIcon />
          </button>
        </div>
      </div>

      <div className="container-content">
        {error ? (
          <div>❌ Error fetching todos...</div>
        ) : (
          todosList.map(todo => <Todo key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  )
}

export default App
