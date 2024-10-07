import {NextRequest} from "next/server";
import {JourneeFFHB, recupereLaCleCFK, recupereLesRecontres} from "@/app/lib/api-ffhb";
import {JourneeDePoule, rechercheCoteServeurLesJourneesDePoules} from "@/app/lib/matchs-weekend";


export const revalidate = 28800;
export const dynamic = 'force-static'


export async function GET(_: NextRequest, {params}: { params: { club: string } }) {
    let journeesDePoule = rechercheCoteServeurLesJourneesDePoules(params.club);


    let cleCFK = await recupereLaCleCFK();
    const details = await Promise.allSettled(
        journeesDePoule.map(journeeDePoule => {
            let urlPouleSplit = journeeDePoule.urlPoule.split("/");
            const typeCompetition = urlPouleSplit[0]
            const idCompetition = urlPouleSplit[1]
            return recupereLesRecontres(typeCompetition, idCompetition, journeeDePoule.extEquipeId, cleCFK)
                .then(resultat => {
                    const journeesFFHB: JourneeFFHB[] = JSON.parse(resultat.poule.journees)
                    return resultat.rencontres
                        .filter(rencontre => rencontre?.equipe1Libelle?.toLocaleLowerCase() === journeeDePoule.nomEquipe || rencontre?.equipe2Libelle?.toLocaleLowerCase() === journeeDePoule.nomEquipe)
                        .map(rencontre => {
                            let journee = journeesFFHB.find(journeesRecontre => journeesRecontre.journee_numero === Number(rencontre.journeeNumero))!!;
                            return {
                                urlPoule: journeeDePoule.urlPoule,
                                libellePoule: journeeDePoule.libellePoule,
                                numeroJournee: journee.journee_numero,
                                dateDebutJournee: journee.date_debut,
                                nomEquipe: journeeDePoule.nomEquipe,
                                extEquipeId: journeeDePoule.extEquipeId,
                                dateRencontre: rencontre.date,
                                equipe1Libelle: rencontre.equipe1Libelle,
                                equipe2Libelle: rencontre.equipe2Libelle,
                                structure1Logo: rencontre.structure1Logo,
                                structure2Logo: rencontre.structure2Logo,
                                equipe1Score: rencontre.equipe1Score,
                                equipe2Score: rencontre.equipe2Score,

                            } as JourneeDePoule
                        })
                })
        }))
    logErreurs(details);

    let data = details.filter(detail => detail.status === "fulfilled").flatMap(detail => detail.value);
    if(data.length>0){
        return Response.json(data)
    }else{
        return Response.error()
    }

}


function logErreurs(details: Array<PromiseSettledResult<Awaited<Promise<JourneeDePoule[]>>>>) {
    details.filter(detail => detail.status === "rejected").forEach(console.error);
}
