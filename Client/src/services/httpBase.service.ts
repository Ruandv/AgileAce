class HttpBaseService {
  baseUrl: string;
  private static instance: HttpBaseService;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl: string) {
    if (!HttpBaseService.instance) {
      HttpBaseService.instance = new HttpBaseService(baseUrl);
    }
    return HttpBaseService.instance;
  }

  async get(endpoint: string) {
    const response = await fetch(this.baseUrl + endpoint);
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status}`);
    }
    return await response.json();
  }

  async post(endpoint: string, body: any) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.status}`);
    }
    return await response.json();
  }
}

export default HttpBaseService;