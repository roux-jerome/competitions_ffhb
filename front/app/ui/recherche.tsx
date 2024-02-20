'use client'
import {useDebouncedCallback} from "use-debounce";
import {usePathname, useSearchParams,useRouter} from "next/navigation";
import {ChangeEvent, KeyboardEvent, useRef} from "react";

export function Recherche() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const inputChampsRecherche = useRef<HTMLInputElement | null>(null);
    const changeLaValeurDeLaRechercheDebounce = useDebouncedCallback(
        (recherche: string) => {
            const params = new URLSearchParams(searchParams);
            if (recherche) {
                params.set('recherche', recherche);
            } else {
                params.delete('recherche');
            }
            replace(`${pathname}?${params.toString()}`);
        },
        1000
    );
    function gereLAppuieSurLaToucheEntree(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter') {
            inputChampsRecherche?.current?.blur();
        }
    }

    function changeLaValeurDeLaRecherche(e: ChangeEvent<HTMLInputElement>) {
        changeLaValeurDeLaRechercheDebounce(e.target.value)
    }



    return <>
        <input id="club" ref={inputChampsRecherche} type="search"
               defaultValue={searchParams.get('recherche')?.toString()}
               onChange={changeLaValeurDeLaRecherche}
               onKeyDown={gereLAppuieSurLaToucheEntree}
               className="block p-3 text-lg w-full bg-transparent text-gray-700 border rounded-full focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
               placeholder=" "/>
        <label htmlFor="club"
               className="absolute top-0 p-4 origin-0 duration-300 -z-1 bg-white text-gray-500">Saisis ton club</label>
    </>;
}