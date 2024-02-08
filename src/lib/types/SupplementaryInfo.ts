import type { Slides } from "./Slides";

export type SupplementaryInfo = {
    slides: Slides | undefined;
    extras: File[] | undefined;
    // TODO: add any extra supplementary info
    // notes: File | undefined;
}