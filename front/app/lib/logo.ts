import {url_site_ffhb} from "@/lib/configuration";

export function formatUrlLogo(logo: string, format: string = "256"): string {
    if (logo && logo != "") {
        return `https://media-logos-clubs.ffhandball.fr/${format}/`
            + logo.toLowerCase()
                .replace(".gif", ".webp")
                .replace(".jpg", ".webp")
                .replace(".jpeg", ".webp")
                .replace(".png", ".webp")
    }
    return `${url_site_ffhb}/app/themes/ffhandball/img/logo_generic_club.png`
}