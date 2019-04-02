export interface Race {
    id: number;
    name: string;
    date: string;
    description: string;
    categories: Category[];
}

export interface Category {
    id: number;
    name: string;
    shortName: string;
    minYearOrBirth: number;
    maxYearOrBirth: number;
    sex?: Sex;
}

export enum Sex {
    Male = 'M', Female = 'F'
}