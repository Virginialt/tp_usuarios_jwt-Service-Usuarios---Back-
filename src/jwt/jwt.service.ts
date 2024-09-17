import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as moment from 'moment';
import { Payload } from 'src/interfaces/payload';

@Injectable()
export class JwtService {
    config = {
      auth: {secret: 'authSecret', expiresIn: '10m'},
      refresh: {secret: 'refreshSecret', expiresIn: '1d'}
    };
    

    generateToken(payload: {email: string}, type: 'refresh' | 'auth' = 'auth'): string {
        console.log(payload, this.config[type].expiresIn)
        return sign(payload, this.config[type].secret, {expiresIn: this.config[type].expiresIn});
    }
  
    refreshToken(refreshToken: string) {
      try {
        const payload = verify(refreshToken, this.config.refresh.secret) as Payload;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeToExpire = (payload.exp - currentTime) / 60;
        if (timeToExpire < 20) {
          return {
            accessToken: this.generateToken({email: payload.email}),
            refreshToken: this.generateToken({email: payload.email}, 'refresh'),
            expirationTime: moment().add(10, 'minutes').toDate(),
          };
        }
        return {
          accessToken: this.generateToken({email: payload.email}),
          expirationTime: moment().add(10, 'minutes').toDate(),
        };
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
  
    getPayload(token: string, type: 'refresh' | 'auth' = 'auth') {
      return verify(token, this.config[type].secret);
    }
}