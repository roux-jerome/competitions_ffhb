import {Resultat} from "@/app/lib/recherche";
import Link from "next/link";

export function ListeClub({resultatRecherche}: { resultatRecherche: Resultat }) {
    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">

                {resultatRecherche.clubs.map(
                    club =>
                        <div key={club?.libelle}
                             className="pl-2 pr-1 py-2 bg-white flex flex-col justify-between">
                                <Link className="mt-2 flex flex-col items-center text-center font-semibold text-blue-500" href={`/clubs/${club?.libelle}`}>
                                <img src={"https://media-logos-clubs.ffhandball.fr/64/" + club?.logo.replace(".jpg", ".webp")} alt={"logo " + club?.libelle}/>
                                    {club?.libelle}
                                </Link>
                        </div>
                )}


            </div>
        </div>
    </section>;
}