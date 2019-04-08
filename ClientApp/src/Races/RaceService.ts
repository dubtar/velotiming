export interface Race {
    id: number;
    name: string;
    date: string;
    type: RaceType;
    description: string;
}

export enum RaceType {
    Laps = 'Laps', TimeTrial = 'TimeTrial' // timetrial, criterium
}

export interface RaceCategory {
    id: number;
    name: string;
    code: string;
    minYearOfBirth?: number;
    maxYearOfBirth?: number;
    sex?: Sex;
}

export enum Sex {
    Male = 'Male', Female = 'Female'
}

const apiUrl = '/api/races/'
const apiCatUrl = apiUrl + 'category/'

export default class RaceService {

    static GetRaces(): any {
        return fetch('/api/races').then(this.checkStatus)
    }

    static GetRace(raceId: number): Promise<Race> {
        return fetch(apiUrl + raceId).then(this.checkStatus)
    }

    static AddRace(race: Partial<Race>): Promise<void> {
        return fetch(apiUrl, {
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(race)
        }).then(this.checkStatus)
    }

    static UpdateRace(race: Partial<Race>): Promise<void>  {
        return fetch(apiUrl + race.id, {
            method: 'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(race)
        }).then(this.checkStatus)
    }

    static DeleteRace(id: number): Promise<{}> {
        return fetch(apiUrl + id, {
            method: 'delete'
        }).then(this.checkStatus);
    }

    static GetRaceCategories(raceId: number): Promise<RaceCategory[]> {
        return fetch(apiCatUrl + raceId).then(this.checkStatus);
    }

    static AddCategory(raceId: number, category: RaceCategory): Promise<{}> {
        return fetch(apiCatUrl + raceId, {
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        }).then(this.checkStatus)
    }

    static UpdateCategory(category: RaceCategory): Promise<void> {
        return fetch(apiCatUrl, {
            method: 'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        }).then(this.checkStatus)
    }

    static DeleteCategory(categoryId: number): Promise<RaceCategory[]> {
        return fetch(apiCatUrl + categoryId, {
            method: 'delete',
        }).then(this.checkStatus)
    }


    private static async checkStatus(resp: Response) {
        if (resp.ok) return resp.json()
        throw `${resp.statusText} ${await resp.text()}`
    }

}