

export interface Poule {
    index: number,
    url: string,
    libelleCompetition: string,
    sousTitreCompetition: string,
    nom: string
    phase: string
    recherche: string,
    dateDebutJourneeSelectionee: string,
    dateFinJourneeSelectionee: string,
    equipes: Equipe[] | null | undefined
    rencontres : Rencontre[] | null | undefined
}

export interface Rencontre {
    "date":string,
    "equipe1Libelle":string,
    "equipe2Libelle":string
}

export interface Equipe {
    libelle: string,
    logo: string
}

