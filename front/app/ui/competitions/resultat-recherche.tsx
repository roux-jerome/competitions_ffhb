import CartesCompetitions from "@/app/ui/competitions/cartes-competitions";
import {ListeClub} from "@/app/ui/competitions/liste-club";
import {recherche} from "@/app/lib/recherche";

export default async function ResultatRecherche({query}: { query: string }) {
    const resultatRecherche = recherche(query)
    return <>
        {/*<h2 className="font-semibold">Clubs <small className="text-white ml-4 px-2 py-1 rounded-full bg-blue-500">BETA</small></h2>*/}
        {/*<ListeClub resultatRecherche={resultatRecherche}/>*/}
        {/*<h2 className="font-semibold">Compétitions</h2>*/}
        <CartesCompetitions resultatRecherche={resultatRecherche}/>
    </>

}