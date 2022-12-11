import { SONAR_URLS } from '../constants/sonar';
import { Injectable, Logger } from '@nestjs/common';
import LoginHolder from '../holder/login.holder';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Issue } from '../types/types';

@Injectable()
export default class SonarqubeService {
  private readonly logger = new Logger(SonarqubeService.name);

  constructor(private configService: ConfigService, private loginHolder: LoginHolder) {}

  async createProject(projectKey?: string): Promise<string> {
    const key = projectKey || 'random';
    await this.login();

    const response = await axios.post<{ project: { key: string } }>(
      SONAR_URLS.project.create,
      {},
      {
        headers: {
          Cookie: this.loginHolder.loginToken,
          'X-XSRF-TOKEN': this.loginHolder.getXSRFToken,
        },
        params: {
          name: key,
          project: key,
          organization: 'FER',
          visibility: 'public',
        },
      },
    );

    return response.data.project.key;
  }

  async deleteProject(projectKey?: string): Promise<void> {
    const key = projectKey || 'random';
    await this.login();

    await axios.post<{ project: { key: string } }>(
      SONAR_URLS.project.delete,
      {},
      {
        headers: {
          Cookie: this.loginHolder.loginToken,
          'X-XSRF-TOKEN': this.loginHolder.getXSRFToken,
        },
        params: {
          project: key,
        },
      },
    );
  }

  async getIssues(projectKey?: string | string[]): Promise<Issue[]> {
    await this.login();

    const result = await axios.get<any>(SONAR_URLS.issues.search, {
      baseURL: this.configService.getOrThrow<string>('SONAR_HOST_URL'),
      headers: {
        Cookie: this.loginHolder.loginToken,
        'X-XSRF-TOKEN': this.loginHolder.getXSRFToken,
      },
      params: {
        componentKeys: projectKey,
      },
    });

    return result.data['issues'];
  }

  async getActivity(projectKey?: string | string[]) {
    await this.login();

    const result = await axios.get<{
      pending: number;
      inProgress: number;
      failing: number;
      pendingTime: number;
    }>(SONAR_URLS.activity.status, {
      baseURL: this.configService.getOrThrow<string>('SONAR_HOST_URL'),
      headers: {
        Cookie: this.loginHolder.loginToken,
        'X-XSRF-TOKEN': this.loginHolder.getXSRFToken,
      },
      params: {
        component: projectKey,
      },
    });

    return result.data;
  }

  async login(): Promise<void> {
    if (await this.validateLogin()) {
      return;
    }

    try {
      const response = await axios.post(
        SONAR_URLS.login,
        {},
        {
          baseURL: this.configService.getOrThrow<string>('SONAR_HOST_URL'),
          params: {
            login: this.configService.getOrThrow<string>('SONAR_USERNAME'),
            password: this.configService.getOrThrow<string>('SONAR_PASSWORD'),
          },
        },
      );

      const xsrfToken = this.parseSetCookie(response.headers['set-cookie']?.filter((string: string) => string.startsWith('XSRF'))[0]);
      const jwtToken = this.parseSetCookie(response.headers['set-cookie']?.filter((string: string) => string.startsWith('JWT'))[0]);

      this.loginHolder.setJwtSession = jwtToken;
      this.loginHolder.setXSRFToken = xsrfToken;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  private async validateLogin(): Promise<boolean> {
    if (!this.loginHolder.isValidToken()) {
      return false;
    }

    try {
      const { data } = await axios.get<{ value: boolean }>(SONAR_URLS.validate, {
        baseURL: this.configService.getOrThrow<string>('SONAR_HOST_URL'),
        headers: {
          Cookie: this.loginHolder.loginToken,
        },
      });

      return data.value;
    } catch (e) {
      this.logger.error(e);

      return false;
    }
  }

  public parseSetCookie(setCookie?: string): string | undefined {
    return setCookie?.split(';')[0]?.split('=')[1];
  }
}
