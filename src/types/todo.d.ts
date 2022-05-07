interface ITodo {
  id: number
  title: string
  done: boolean
  ref: ActorRef<ITodo>
}
