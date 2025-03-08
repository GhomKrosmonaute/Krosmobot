import * as app from "../app.js"

export interface Participant {
  id: number
  tournoiId: string
  membreId: string
  playerId: string
  /**
   * Le score ELO du joueur lorsqu'il s'est inscrit au tournoi (récupéré automatiquement)
   */
  elo?: number
}

export default new app.Table<Participant>({
  name: "participant",
  description: "The participant table",
  priority: 9,
  setup: (table) => {
    table.increments("id").primary()
    table
      .integer("tournoiId")
      .references("id")
      .inTable("tournoi")
      .notNullable()
      .onDelete("CASCADE")
    table.string("membreId").notNullable()
    table.string("playerId").notNullable()
    table.integer("elo")
  },
})
