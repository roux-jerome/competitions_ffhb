import {recherche} from "@/app/lib/recherche";
import {EnteteClub} from "@/app/clubs/[club]/entete-club";
import Link from "next/link";

export function ResultatClub({club}: { club: string }) {
    const resultatRecherche = recherche(club)
    return <>
        <Link href="/" className="text-sm text-blue-500 pl-3">
            &lt;- Recherche
        </Link>
        <EnteteClub resultatRecherche={resultatRecherche}/>
    </>;
}