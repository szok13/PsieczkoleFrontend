import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

async loadConfig(): Promise<void> {
  try {
    this.config = await firstValueFrom(this.http.get('./config.json'));
  } catch (error) {
    console.error('Failed to load config!', error);
    this.config = {
      authApiUrl: "http://localhost:8080",
      petManagementApiUrl: "http://localhost:8084"
    };
  }
}

  get authApiUrl() {
    return this.config.authApiUrl;
  }

  get petManagementApiUrl() {
    return this.config.petManagementApiUrl;
  }
}