export class Competition {
    tags = [] as string[]
    description: string;
    lien: string;
    equipes: string;
    ordre: number;

    constructor(resultat: lunr.Index.Result) {
        //departemental/gironde-16-masculins-promotion-23302/poule-136931
        let details = resultat.ref.split("/");
        let formatageTexte = details[1].split("-");
        formatageTexte.pop()
        this.description = formatageTexte.join(" ")
            .replace("2023 24", "")
        this.construitLesTags(details[0].replaceAll("-", " "), this.description)
        this.lien = resultat.ref
        this.equipes = Object.keys(resultat.matchData.metadata).join(" ").replaceAll("_"," ")
        this.ordre = parseInt(details[2].replace("-poule",""))
    }

    construitLesTags = (type: string, details: string) => {
        this.tags.push(type);

        ["masculin", "feminin", "u18", "u15", "u13", "u11"].forEach((tagAChercher: string) => {
            if (details.includes(tagAChercher)) {
                this.tags.push(tagAChercher)
            }
        })

        if (details.includes(" 16 ")) {
            this.tags.push("+16")
        }


    }

}