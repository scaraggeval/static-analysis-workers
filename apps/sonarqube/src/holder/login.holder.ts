import { Injectable } from '@nestjs/common';

@Injectable()
export default class LoginHolder {
  private xsrfToken: string | undefined;
  private jwtSession: string | undefined;

  public get getXSRFToken() {
    return this.xsrfToken || '';
  }

  public set setXSRFToken(xsrfToken: string | undefined) {
    this.xsrfToken = xsrfToken;
  }

  public get getJwtSession() {
    return this.jwtSession;
  }

  public set setJwtSession(jwtSession: string | undefined) {
    this.jwtSession = jwtSession;
  }

  public get loginToken() {
    return `XSRF-TOKEN=${this.xsrfToken}; JWT-SESSION=${this.jwtSession}`;
  }

  isValidToken() {
    return this.jwtSession && this.xsrfToken;
  }
}
