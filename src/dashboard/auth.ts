import * as bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./localstorage');

export default class Auth {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    let sessionId = req.sessionID;
    let savedSessionId = localStorage.getItem('signedInSessionId');
    
    if (sessionId === savedSessionId) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  static authenticate(sessionId, password) {
    // Compare password with stored hash password
    if (bcrypt.compareSync(password, process.env.DASHBOARD_PASSWORD)) {
      // Success, save session ID as login key
      localStorage.setItem('signedInSessionId', sessionId);
      return true;
    } else {
      localStorage.removeItem('signedInSessionId');
      return false;
    }
  }

  static logout() {
    localStorage.removeItem('signedInSessionId');
  }
}
