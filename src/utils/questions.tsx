export interface Question {
  titleText: string;
  titleHighlight?: string;
  yes: string;
  no: string;
  showBebou: boolean;
}

export const QUESTIONS: Question[] = [
  {
    titleText: "Veux-tu être ma\n",
    titleHighlight: "Valentine",
    yes: "Oui",
    no: "Non",
    showBebou: true,
  },
  {
    titleText: "T'es sûre, sûre, sûre ?",
    yes: "Évidemment ! 💕",
    no: "Hmm... laisse-moi réfléchir",
    showBebou: false,
  },
  {
    titleText: "Pour combien de temps ?",
    yes: "Pour toujours ♾️",
    no: "Juste aujourd'hui",
    showBebou: false,
  },
  {
    titleText: "Tu promets de me faire des papouilles tous les jours ?",
    yes: "Je promets ! 🤗",
    no: "Peut-être...",
    showBebou: false,
  },
];
