import {Entete} from "@/app/ui/entete";
import RechercheCompetitions from "@/app/ui/competitions/recherche-competitions";


export default async function Home({
                                 searchParams,
                             }: {
    searchParams?: {
        recherche?: string;
    };
}) {

    const recherche = searchParams?.recherche || '';
    return (
        <>
            <Entete/>
            <RechercheCompetitions recherche={recherche}/>
        </>
    );
}


