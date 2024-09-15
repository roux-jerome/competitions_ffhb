import Image from "next/image";
import iconimageHand from "./icon-handball.png";
import Link from "next/link";

export function Entete() {
    return <header className="bg-white dark:bg-gray-900">
        <nav className="border-t-4 border-orange-600">
            <div className="container flex items-center justify-between px-6 py-3 mx-auto">
                <Link href="/">
                    <Image className="w-auto h-6 sm:h-7" src={iconimageHand} width={450}
                           height={64} alt=""/>
                </Link>


            </div>
        </nav>
    </header>;
}