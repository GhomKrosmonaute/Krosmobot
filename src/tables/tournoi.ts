import * as app from "../app.js"

export interface Tournoi {
  id: string
  started: boolean
  winnerId?: string
}

export default new app.Table<Tournoi>({
  name: "tournoi",
  description: "The tournoi table",
  priority: 10,
  setup: (table) => {
    table.string("id").primary().unique()
    table.boolean("started").defaultTo(false)
    table.string("winnerId")
  },
})
