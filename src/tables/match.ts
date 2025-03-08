import * as app from "../app.js"

export interface Match {
  id: number
  arbreId: string
  tournoiId: string
  participant1Id: number
  participant2Id: number
  winnerId?: number
}

export default new app.Table<Match>({
  name: "match",
  description: "The match table",
  setup: (table) => {
    table.increments("id").primary()
    table
      .string("arbreId")
      .references("id")
      .inTable("arbre")
      .notNullable()
      .onDelete("CASCADE")
    table
      .string("tournoiId")
      .references("id")
      .inTable("tournoi")
      .notNullable()
      .onDelete("CASCADE")
    table
      .integer("participant1Id")
      .references("id")
      .inTable("participant")
      .notNullable()
      .onDelete("CASCADE")
    table
      .integer("participant2Id")
      .references("id")
      .inTable("participant")
      .notNullable()
      .onDelete("CASCADE")
    table.integer("winnerId").references("id").inTable("participant")
  },
})
