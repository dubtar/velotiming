const apiUrl = "/api/number/";

export default class NumberService {
  public static GetAllNumbers(): Promise<INumber[]> {
    return fetch(apiUrl).then(this.checkStatus);
  }

  public static SaveNumber(num: INumber): Promise<INumber[]> {
    return fetch(apiUrl, {
      body: JSON.stringify(num),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "post"
    }).then(this.checkStatus);
  }

  public static DeleteNumber(num: string): Promise<INumber[]> {
    return fetch(apiUrl + num, {
      method: "delete"
    }).then(this.checkStatus);
  }

  private static async checkStatus(resp: Response) {
    if (resp.ok) return resp.json();
    throw Error(`${resp.statusText} ${await resp.text()}`);
  }
}

export interface INumber {
  id: string;
  rfids: string[];
}
