import * as bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { LocalStorage } from 'node-localstorage';
import * as moment from 'moment';

const localStorage = new LocalStorage('./localstorage/session');

export default class Auth {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.sessionID;
    const timestamp = moment(localStorage.getItem(sessionId));

    if (moment().diff(timestamp, 'minutes') < 20) {
      // Login is valid, refresh timestamp and continue
      Auth.saveTimestamp(sessionId);
      next();
    } else {
      // Not valid anymore, logging out
      Auth.logout(sessionId);
      res.redirect('/login');
    }
  }

  static authenticate(sessionId, password) {
    // Compare password with stored hash password
    if (bcrypt.compareSync(password, process.env.DASHBOARD_PASSWORD)) {
      // Success, save session ID as logged in
      Auth.saveTimestamp(sessionId);

      return true;
    }
    // Not successful, logout
    Auth.logout(sessionId);

    return false;
  }

  static logout(sessionId) {
    localStorage.removeItem(sessionId);
  }

  private static saveTimestamp(sessionId) {
    const timestamp = moment().toISOString();
    localStorage.setItem(sessionId, timestamp);
  }
}
