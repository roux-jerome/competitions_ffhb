import {Poule} from "@/app/lib/poule";

export function AnciennesPoules({anciennesPoules}: { anciennesPoules: Poule[] }) {
    if (anciennesPoules.length != 0) {
        return <>
            <hr className="my-6 border-gray-200 dark:border-gray-700 mr-6"/>
            <small className="font-bold">anciennes poules</small>
            {anciennesPoules.map(
                poule =>

                    <a key={poule.url} className="text-sm text-gray-500 dark:text-gray-300 md:text-sm"
                       href={"https://www.ffhandball.fr/competitions/saison-saison-2024-2025-20/" + poule.url} target="_blank" role="link">
                        {poule.phase.toLowerCase()} - {poule.nom.toLowerCase()}
                    </a>
            )}
        </>
    }
    return null
}