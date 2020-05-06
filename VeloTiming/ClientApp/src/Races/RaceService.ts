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
    public static GetRaces(): any {
        return fetch('/api/races').then(this.checkStatus)
    }

    public static GetRace(raceId: number): Promise<Race> {
        return fetch(apiUrl + raceId).then(this.checkStatus)
    }

    public static AddRace(race: Partial<Race>): Promise<void> {
        return fetch(apiUrl, {
            body: JSON.stringify(race),
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        }).then(this.checkStatus)
    }

    public static UpdateRace(race: Partial<Race>): Promise<void> {
        return fetch(apiUrl + race.id, {
            method: 'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(race)
        }).then(this.checkStatus)
    }

    public static DeleteRace(id: number): Promise<void> {
        return fetch(apiUrl + id, {
            method: 'delete'
        }).then(this.checkStatus);
    }

    public static GetRaceCategories(raceId: number): Promise<RaceCategory[]> {
        return fetch(apiCatUrl + raceId).then(this.checkStatus);
    }

    public static AddCategory(raceId: number, category: RaceCategory): Promise<void> {
        return fetch(apiCatUrl + raceId, {
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        }).then(this.checkStatus)
    }

    public static UpdateCategory(category: RaceCategory): Promise<void> {
        return fetch(apiCatUrl, {
            method: 'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        }).then(this.checkStatus)
    }

    public static DeleteCategory(categoryId: number): Promise<RaceCategory[]> {
        return fetch(apiCatUrl + categoryId, {
            method: 'delete',
        }).then(this.checkStatus)
    }

    public static GetRiders(raceId: number): Promise<Rider[]> {
        return fetch(apiRiderUrl + raceId).then(this.checkStatus)
    }

    public static AddRider(raceId: number, rider: Rider): Promise<Rider[]> {
        return fetch(apiRiderUrl + raceId, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rider)
        }).then(this.checkStatus)
    }

    public static UpdateRider(rider: Rider): Promise<Rider[]> {
        return fetch(apiRiderUrl, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rider)
        }).then(this.checkStatus)
    }

    public static DeleteRider(riderId: number): Promise<Rider[]> {
        return fetch(apiRiderUrl + riderId, {
            method: 'delete'
        }).then(this.checkStatus)
    }

    public static GetStarts(raceId: number): Promise<Start[]> {
        return fetch(apiStartUrl + raceId).then(this.checkStatus)
    }

    public static AddStart(raceId: number, start: Start): Promise<Start[]> {
        return fetch(apiStartUrl + raceId, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(start)
        }).then(this.checkStatus)
    }

    public static UpdateStart(start: Start): Promise<Start[]> {
        return fetch(apiStartUrl, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(start)
        }).then(this.checkStatus)
    }

    public static DeleteStart(startId: number): Promise<Start[]> {
        return fetch(apiStartUrl + startId, {
            method: 'delete'
        }).then(this.checkStatus)
    }

    private static async checkStatus(resp: Response) {
        if (resp.ok) return resp.json()
        throw new Error(`${resp.statusText} ${await resp.text()}`)
    }
}