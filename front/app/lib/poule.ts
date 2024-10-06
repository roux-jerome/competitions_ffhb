export interface Poule {
    index: number,
    url: string,
    libelleCompetition: string,
    sousTitreCompetition: string,
    nom: string,
    phase: string,
    recherche: string,
    dateDebutJourneeSelectionee: string,
    dateFinJourneeSelectionee: string,
    equipes: Equipe[] | null | undefined,
    rencontres: Rencontre[] | null | undefined,
    journeeCourante: number,
    nombreDeJournees: number
}

export interface Rencontre {
    date: string,
    equipe1Libelle: string,
    equipe2Libelle: string,
    structure1Logo: string,
    structure2Logo: string,
    equipe1Score?: string,
    equipe2Score?: string,
}

export interface Equipe {
    id: string,
    libelle: string,
    logo: string
}

