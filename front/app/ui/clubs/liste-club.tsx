import Link from "next/link";
import clsx from "clsx";
import {rechercheClubs} from "@/app/lib/clubs";

export default async function ListeClub({recherche, afficheSousFormeDeLien = true}: { recherche: string, afficheSousFormeDeLien?: boolean }) {
    const resultatRecherche = rechercheClubs(recherche)

    function formatUrlLogo(logo: string) {
        if (logo && logo != "") {
            return "https://media-logos-clubs.ffhandball.fr/64/"
                + logo.toLowerCase()
                    .replace(".jpg", ".webp")
                    .replace(".jpeg", ".webp")
                    .replace(".png", ".webp")
        }
        return "https://www.ffhandball.fr/app/themes/ffhandball/img/logo_generic_club.png"
    }


    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6  mx-auto">
            <div className={clsx("grid",
                afficheSousFormeDeLien ? "grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6" : resultatRecherche.clubs.length > 1 ? "grid-cols-2" : "grid-cols-1"
            )}>

                {resultatRecherche.clubs.map(
                    club =>
                        <div key={club.libelle}
                             className="pl-2 pr-1 py-2 bg-white flex flex-col justify-between">
                            {afficheSousFormeDeLien
                                ? <Link className="mt-2 flex flex-col items-center text-center font-semibold text-blue-500" href=
                                    {`/matchs/${encodeURIComponent(club.libelle)}`}>
                                    <img src={formatUrlLogo(club.logo)} alt={"logo " + club.libelle}/>
                                    {club.libelle}
                                </Link>

                                : <span className="mt-2 flex flex-col items-center text-center font-semibold">
                                {club.libelle}
                                    <img src={formatUrlLogo(club.logo)} alt={"logo " + club.libelle}/>
                            </span>
                            }

                        </div>
                )}


            </div>
        </div>
    </section>;
}