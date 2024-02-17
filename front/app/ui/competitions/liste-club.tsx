import {Resultat} from "@/app/lib/recherche";

export function ListeClub({resultatRecherche}: { resultatRecherche: Resultat }) {
    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {resultatRecherche.clubs.map(
                    club =>
                        <div key={club?.libelle}
                             className="pl-2 pr-1 py-2 bg-white flex flex-col justify-between">
                            <div className="flex flex-col items-center text-center">
                                <img src={"https://media-logos-clubs.ffhandball.fr/64/" + club?.logo.replace(".jpg", ".webp")} alt={"logo " + club?.libelle}/>
                                <div className="mt-2 font-semibold text-blue-500">
                                    {club?.libelle}
                                </div>
                            </div>


                        </div>
                )}


            </div>
        </div>
    </section>;
}