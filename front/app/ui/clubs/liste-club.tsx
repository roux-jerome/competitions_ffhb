import Link from "next/link";
import {rechercheClubs} from "@/app/lib/clubs";

export default async function ListeClub({recherche, afficheSousFormeDeLien = true}: { recherche: string, afficheSousFormeDeLien?: boolean }) {
    const resultatRecherche = rechercheClubs(recherche)

    function formatUrlLogo(logo: string) {
        if (logo && logo != "") {
            return "https://media-logos-clubs.ffhandball.fr/256/"
                + logo.toLowerCase()
                    .replace(".jpg", ".webp")
                    .replace(".jpeg", ".webp")
                    .replace(".png", ".webp")
        }
        return "https://www.ffhandball.fr/app/themes/ffhandball/img/logo_generic_club.png"
    }


    return <div className="container mx-auto">
        <div className="flex justify-center flex-wrap">

            {resultatRecherche.clubs.map(
                club =>
                    <div key={club.libelle}
                         className="w-1/2 md:w-1/4 lg:w-1/6 px-2">
                        {afficheSousFormeDeLien
                            ?
                            <Link
                                className="mt-2 font-semibold text-xl md:text-2xl hover:underline hover:text-orange-600"
                                href={`/matchs/${encodeURIComponent(club.libelle)}`}>
                                <img src={formatUrlLogo(club.logo)} alt={"logo " + club.libelle}
                                     className="mx-auto rounded-full shadow-[10px_10px_0] shadow-orange-100 mb-10"
                                     width="256px" height="256px"/>
                                <p className="break-words">
                                    {club.libelle.replaceAll("/", " / ")}
                                </p>
                            </Link>
                            :
                            <span className="break-words mt-2 font-semibold text-center">
                                <p>{club.libelle.replaceAll("/", " / ")}</p>
                                <img src={formatUrlLogo(club.logo)} alt={"logo " + club.libelle} width="256px" height="256px"/>
                                </span>
                        }

                    </div>
            )}
            {afficheSousFormeDeLien && resultatRecherche.clubs.length > 1 ? <div className="w-1/2 md:w-1/4 lg:w-1/6 flex flex-col justify-between px-2">
                <Link className="mt-2 flex flex-col items-center text-center font-semibold text-xl md:text-2xl hover:underline hover:text-orange-600"
                      href={`/matchs/${encodeURIComponent(recherche)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"
                         className="mx-auto rounded-full shadow-[10px_10px_0] shadow-orange-100 mb-10 text-orange-600 p-12">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
                    </svg>
                    Matchs des {resultatRecherche.clubs.length} équipes
                </Link></div> : null}


        </div>
    </div>;
}