declare module "swearfilter" {
   export type filterOptions = {
        swearWords?: string[];
        uncensoredWords?: string[];
        smartDetect?: boolean;
        useBaseFilter?: boolean;
    }
    export class Filter {
        constructor(data: filterOptions);
        public containsSwearWord(data: string): boolean;
        
    }
}