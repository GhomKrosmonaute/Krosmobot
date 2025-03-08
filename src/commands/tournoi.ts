import * as app from "../app.js"

import tournoi from "../tables/tournoi.js"

export default new app.Command({
  name: "tournoi",
  description: "Gestion des tournois",
  channelType: "all",
  async run(message) {},
  subs: [
    new app.Command({
      name: "nouveau",
      description: "Créer un tournoi",
      channelType: "all",
      positional: [
        {
          name: "id",
          description: "L'id unique du tournoi",
          required: true,
        },
      ],
      async run(message) {
        if (!message.args.id)
          return message.send("Veuillez entrer l'id du tournoi.")

        const id: string = message.args.id

        if (id.length > 20)
          return message.send(
            "L'id du tournoi ne peut pas dépasser 20 caractères."
          )

        if (/\s+/.test(id))
          return message.send("L'id du tournoi ne peut pas contenir d'espace.")

        if (!/^[a-z0-9-]+$/i.test(id))
          return message.send(
            "L'id du tournoi ne peut contenir que des lettres, des chiffres et des tirets."
          )

        if (await tournoi.query.where({ id }))
          return message.send("Ce tournoi existe déjà.")

        await tournoi.query.insert({ id })

        return message.send(
          `Le tournoi a bien été créé.\nPour inscrire quelqu'un, utilisez la commande \`k,tournoi inscrire ${id} [<memberId>]\`.\nPour lancer le tournoi, utilisez la commande \`k,tournoi go\``
        )
      },
    }),
  ],
})
