export interface Poule {
    index: number,
    url: string,
    libelleCompetition: string,
    sousTitreCompetition: string,
    nom: string
    phase: string
    recherche: string,
    dateJourneeSelectionee: string,
    equipes: Equipe[] | null | undefined
}

export interface Equipe {
    libelle: string,
    logo: string
}

