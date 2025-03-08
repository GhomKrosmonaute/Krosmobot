import * as app from "../app.js"

export interface Arbre {
  id: string
  tournoiId: string
}

export default new app.Table<Arbre>({
  name: "arbre",
  description: "Arbre de tournoi",
  setup: (table) => {
    table.string("id").primary().unique()
    table
      .string("tournoiId")
      .references("id")
      .inTable("tournoi")
      .notNullable()
      .onDelete("CASCADE")
  },
})
