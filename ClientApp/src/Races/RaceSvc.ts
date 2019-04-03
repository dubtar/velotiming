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
    code: string;
    minYearOfBirth?: number;
    maxYearOfBirth?: number;
    sex?: Sex;
}

export enum Sex {
    Male = 'M', Female = 'F'
}

const apiUrl = '/api/races/'

export default class RaceService {

    public static async GetRace(raceId: number): Promise<Race> {
        return await fetch(apiUrl + raceId).then(this.checkStatus);
    }

    public static async DeleteRace(id: number): Promise<{}> {
        return fetch(apiUrl + id, {
            method: 'delete'
        }).then(this.checkStatus);
    }

    public static async GetRaceCategories(raceId: number): Promise<Category[]> {
        return await fetch(apiUrl + raceId + '/category').then(r => r.json());
    }

    static AddCategory(raceId: number, category: Category): Promise<{}> {
        return fetch(apiUrl + raceId + '/category', {
            method: 'post',
            body: JSON.stringify(category)
        }).then(this.checkStatus)
    }

    private static checkStatus(resp: Response) {
        if (resp.ok) return resp.json()
        throw `${resp.statusText} ${resp.body}`
    }

}