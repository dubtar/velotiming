import { number } from "yup";

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

export interface Rider {
    id: number
    number?: string;
    firstName: string
    lastName: string
    sex?: Sex
    yearOfBirth?: number
    category?: string
    categoryName?: string
    city?: string
    team?: string
}

export interface Start {
    id: number
    name: string
    plannedStart: string | null
    realStart: string | null
    end: string | null
    categories: RaceCategory[]
}

export enum Sex {
    Male = 'Male', Female = 'Female'
}

const apiUrl = '/api/races/'
const apiCatUrl = apiUrl + 'category/'
const apiRiderUrl = apiUrl + 'rider/'
const apiStartUrl = apiUrl + 'start/'

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

    static UpdateRace(race: Partial<Race>): Promise<void> {
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

    static AddCategory(raceId: number, category: RaceCategory): Promise<void> {
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

    static GetRiders(raceId: number): Promise<Rider[]> {
        return fetch(apiRiderUrl + raceId).then(this.checkStatus)
    }

    static AddRider(raceId: number, rider: Rider): Promise<Rider[]> {
        return fetch(apiRiderUrl+raceId, {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(rider)
        }).then(this.checkStatus)
    }

    static UpdateRider(rider: Rider): Promise<Rider[]> {
        return fetch(apiRiderUrl, {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(rider)
        }).then(this.checkStatus)
    }

    static DeleteRider(riderId: number): Promise<Rider[]> {
        return fetch(apiRiderUrl + riderId, {
            method: 'delete'
        }).then(this.checkStatus)
    }

    static GetStarts(raceId: number): Promise<Start[]> {
        return fetch(apiStartUrl + raceId).then(this.checkStatus)
    }

    static AddStart(raceId: number, start: Start): Promise<Start[]> {
        return fetch(apiStartUrl+raceId, {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(start)
        }).then(this.checkStatus)
    }

    static UpdateStart(start: Start): Promise<Start[]> {
        return fetch(apiStartUrl, {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(start)
        }).then(this.checkStatus)
    }

    static DeleteStart(startId: number): Promise<Start[]> {
        return fetch(apiStartUrl + startId, {
            method: 'delete'
        }).then(this.checkStatus)
    }

    private static async checkStatus(resp: Response) {
        if (resp.ok) return resp.json()
        throw `${resp.statusText} ${await resp.text()}`
    }
}