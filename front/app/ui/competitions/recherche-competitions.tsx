'use client'

import {Competitions} from "@/app/lib/competitions";
import Image from "next/image";
import imageHand from "./hand.png";
import {ChangeEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState} from "react";
import LunrWrapper from "@/app/lib/lunrWrapper";
import lunr from "lunr";
import {useDebouncedCallback} from "use-debounce";
import _poules from "@/app/lib/poules.json";
import {Poule} from "@/app/lib/poule";
import CartesCompetitions from "@/app/ui/competitions/cartes-competitions";

const poules = _poules as Poule[]
export default function RechercheCompetitions() {
    const [competitionsTrouvees, setCompetitionsTrouvees] = useState(new Competitions());
    const [index, setIndex] = useState(new LunrWrapper(lunr(() => {
    })));
    const [champsRecherche, setChampsRecherche] = useState("");
    const recherche = useDebouncedCallback(
        (recherche: string) => {
            if (recherche && recherche !== "") {
                let rechercheFuzzy = recherche
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replaceAll(" ", "*_*")
                let competitions = new Competitions();
                index.index.search(`*${rechercheFuzzy}*`)
                    .forEach((resultat) => {
                        competitions.ajoute(Object.keys(resultat.matchData.metadata).join(" "), poules[Number(resultat.ref)])
                    });
                setCompetitionsTrouvees(competitions);
            } else {
                setCompetitionsTrouvees(new Competitions())
            }
        },
        1000
    );
    const inputChampsRecherche = useRef<HTMLInputElement | null>(null);
    const resultatRecherche = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setIndex(new LunrWrapper(
            lunr(function () {
                this.ref('index')
                this.field('recherche')
                poules.forEach((doc) => {
                    this.add(doc)
                })
            })
        ))


    }, []);


    function changeLaValeurDeLaRecherche(e: ChangeEvent<HTMLInputElement>) {
        setChampsRecherche(e.target.value)
        recherche(e.target.value);
    }

    function gereLAppuieSurLaToucheEntree(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter') {
            inputChampsRecherche?.current?.blur();
            resultatRecherche?.current?.scrollIntoView({behavior: 'smooth'});
        }
    }


    return <>
        <div className="container px-6 py-1 mx-auto">
            <div className="items-center lg:flex">
                <div className="w-full lg:w-1/2">
                    <div className="lg:max-w-lg">
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Recherche ton club sur <span
                            className="text-blue-500">FFHandball</span></h1>

                        <p className="mt-3 text-gray-600 dark:text-gray-400">Toi aussi tu n&apos;en peux plus de rechercher sur le site de la Fédération française de
                            handball. <span
                                className="font-medium text-blue-500">Alors cet outil est fait pour toi</span></p>
                        <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                            <div className="relative w-full z-0">
                                <input id="club" ref={inputChampsRecherche} type="search"
                                       value={champsRecherche}
                                       onChange={changeLaValeurDeLaRecherche}
                                       onKeyDown={gereLAppuieSurLaToucheEntree}
                                       className="block p-3 text-lg w-full bg-transparent text-gray-700 border rounded-full focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                                       placeholder=" "/>
                                <label htmlFor="club"
                                       className="absolute top-0 p-4 origin-0 duration-300 -z-1 bg-white text-gray-500">Saisie ton club</label>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                    <div className={"hidden" + (competitionsTrouvees.liste.length > 0 ? " md:block" : "block")}>
                        <Image className="w-full h-full max-w-md" src={imageHand} alt="email illustration vector art"/>
                    </div>
                </div>
            </div>
        </div>

        <section ref={resultatRecherche} className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-1 mx-auto">
                {/*        <div className="flex py-4 mt-4 overflow-x-auto overflow-y-hidden md:justify-center dark:border-gray-700">*/}
                {/*            <button*/}
                {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">*/}
                {/*                Animation*/}
                {/*            </button>*/}

                {/*            <button*/}
                {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                {/*                Web design*/}
                {/*            </button>*/}

                {/*            <button*/}
                {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                {/*                App design*/}
                {/*            </button>*/}

                {/*            <button*/}
                {/*                className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">*/}
                {/*                Branding*/}
                {/*            </button>*/}
                {/*        </div>*/}
                <CartesCompetitions competitions={competitionsTrouvees}/>
            </div>
        </section>
    </>;
}