"use client"
import {motion} from "framer-motion";
import {HeroHighlight, Highlight} from "@/app/ui/hero-highlight";
import Image from "next/image";
import imageHand from "@/app/ui/hand.png";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {clsx} from "clsx";

export function Hero() {
    const searchParams = useSearchParams();
    const [isRechercheEnCours, setIsRechercheEnCours] = useState<boolean>(searchParams.get('recherche') != null && searchParams.get('recherche') != "");

    const lanceLaRecherce = () => {
        setIsRechercheEnCours(true);
    };
    const sortDeLaRecherce = useDebouncedCallback(() => {
        setIsRechercheEnCours(searchParams.get('recherche') != null && searchParams.get('recherche') != "");
    }, 500);

    const {replace} = useRouter();
    const pathname = usePathname();
    const inputChampsRecherche = useRef<HTMLInputElement | null>(null);

    const changeLaValeurDeLaRecherche = (recherche: string = '') => {
        setIsRechercheEnCours(true)
        const params = new URLSearchParams(searchParams);
        if (recherche) {
            params.set('recherche', recherche);
        } else {
            params.delete('recherche');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    const changeLaValeurDeLaRechercheDebounce = useDebouncedCallback(changeLaValeurDeLaRecherche, 1000);

    function gereLAppuieSurLaToucheEntree(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter') {
            changeLaValeurDeLaRecherche(inputChampsRecherche?.current?.value)
            inputChampsRecherche?.current?.blur();
        }
    }

    function rechercheChange(e: ChangeEvent<HTMLInputElement>) {
        changeLaValeurDeLaRechercheDebounce(e.target.value)
    }

    return <div className="container px-6 py-1 mx-auto">
        <div className={`items-center ${isRechercheEnCours ? '' : 'lg:flex'}`}>
            <div className={`w-full ${isRechercheEnCours ? '' : 'lg:w-1/2'} `}>
                {!isRechercheEnCours &&
                    <HeroHighlight>
                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: [20, -5, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
                        >
                            Avec RechercheFFHB, trouve les informations sur tes clubs de handball préférés. <br/>
                            <Highlight className="text-black dark:text-white">
                                Simple, rapide et efficace
                            </Highlight>

                        </motion.h1>
                        <p className="mt-10 md:mt-20 mx-10 md:text-2xl font-bold text-gray-500 dark:text-gray-400">
                            Toi aussi tu n&apos;en peux plus de rechercher sur le site de la Fédération
                            Française de Handball alors {' '}
                            <span className="text-orange-600">cet outil est fait pour toi !</span></p>
                    </HeroHighlight>
                }
                <motion.div layout className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                    <div className="relative w-full z-0">
                        <input id="club" ref={inputChampsRecherche} type="search"
                               defaultValue={searchParams.get('recherche')?.toString()}
                               onFocus={lanceLaRecherce}
                               onBlur={sortDeLaRecherce}
                               onChange={rechercheChange}
                               onKeyDown={gereLAppuieSurLaToucheEntree}
                               className={clsx(
                                   'block p-3 text-xl w-full bg-orange-50 text-gray-700 border rounded-xl border-gray-400',
                                   isRechercheEnCours ? "mt-10 border-orange-600 focus:border-orange-600 focus:outline-none focus:ring focus:ring-opacity-0 focus:ring-orange-300" : "")}

                               placeholder=" "/>
                        <label htmlFor="club"
                               className="absolute top-0 p-4 origin-0 duration-300 bg-transparent text-gray-500">Recherche ton club</label>
                    </div>
                </motion.div>
            </div>


            {!isRechercheEnCours &&
                <div className="flex items-center justify-center w-full lg:w-1/2">
                    <Image className="object-cover" src={imageHand} alt="email illustration vector art"/>
                </div>
            }

        </div>
        {((searchParams.get('recherche') == null || searchParams.get('recherche') == "") && isRechercheEnCours) &&
            <div className="flex items-center justify-center ">
                <Image className="w-full md:w-1/2 opacity-5" src={imageHand} alt="email illustration vector art"/>
            </div>
        }
    </div>


}