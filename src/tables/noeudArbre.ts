import * as app from "../app.js"

export interface NoeudArbre {
  id: number
  arbreId: string
  matchId?: number
  noeudPrecedentId?: number
}

export default new app.Table<NoeudArbre>({
  name: "noeudArbre",
  description: "The noeudArbre table",
  setup: (table) => {
    table.increments("id").primary()
    table
      .string("arbreId")
      .references("id")
      .inTable("arbre")
      .notNullable()
      .onDelete("CASCADE")
    table.integer("matchId").references("id").inTable("match")
    table.integer("noeudPrecedentId").references("id").inTable("noeudArbre")
  },
})
