import { Injectable } from '@angular/core';
import { User } from '../data/user';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Shop } from '../data/shop';
import { Voucher } from '../data/voucher';
import { Inventory } from '../data/inventory';
import { Group } from '../data/group';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { GeneralVoucher } from '../data/general-voucher';

@Injectable()
export class AuthService {

  private users: User[] = [];
  private userBehaviourSubject: BehaviorSubject<User>;
  public userObservable$: Observable<User>;
  public isHandSet$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    // this.users.push({ username: 'test', password: "123456", id: "1" });
    // this.users.push({ username: 'alpha', password: "123456", id: "2" });

    this.isHandSet$ = breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map((result) => result.matches),
      shareReplay()// Find Usage
    );

    this.userBehaviourSubject = new BehaviorSubject(null); // this.getLoggedInUserFromStorage()

    this.userObservable$ = this.userBehaviourSubject.asObservable();
  }

  public get user() {
    return this.userBehaviourSubject.value;
  }

  public get userID() {
    return this.userBehaviourSubject.value.id;
  }

  public get shopsList() {
    return this.userBehaviourSubject.value.shopsList || [];
  }

  public set shopsList(shopsList: Shop[]) {
    this.userBehaviourSubject.value.shopsList = shopsList;
    this.updateUserData();
  }

  public get vouchersList() {
    return this.userBehaviourSubject.value.vouchersList || [];
  }

  public set vouchersList(vouchersList: Voucher[]) {
    this.userBehaviourSubject.value.vouchersList = vouchersList;
    this.updateUserData();
  }

  public get inventoriesList() {
    return this.userBehaviourSubject.value.inventoriesList || [];
  }

  public set inventoriesList(inventoriesList: Inventory[]) {
    this.userBehaviourSubject.value.inventoriesList = inventoriesList;
    this.updateUserData();
  }

  public get groupsList() {
    return this.userBehaviourSubject.value.groupsList || [];
  }

  public set groupsList(groupsList: Group[]) {
    this.userBehaviourSubject.value.groupsList = groupsList;
    this.updateUserData();
  }

  public get genVochuersList() {
    return this.userBehaviourSubject.value.genVochuersList || [];
  }

  public set genVochuersList(genVochuersList: GeneralVoucher[]) {
    this.userBehaviourSubject.value.genVochuersList = genVochuersList;
    this.updateUserData();
  }

  public login(username: string, password: string): Observable<User> {

    const usersList = this.getUsersListFromUserStorage();
    const user = usersList.find(user => user.username == username && user.password == password);

    if ( user ) {
      this.userBehaviourSubject.next(user);
      return of(user);
    } else {
      return throwError('Invalid user details');
    }

    // let user = this.users.find(user => user.username == username && user.password == password);

    // if (user) {

    //   this.userBehaviourSubject.next(user);
    //   this.setLoggedInUserToStorage();
    //   return of(user);

    // }
    // else {
    //   return throwError("Invalid");
    // }

  }

  public register(username: string, password: string) {

    const usersList = this.getUsersListFromUserStorage();

    if (usersList.findIndex(x => x.username == username) >= 0) {
      return throwError('User already exists');
    } else {
      this.addUserToStorage(username, password);
      return of(username);
    }
  }

  public logout() {
    this.userBehaviourSubject.next(null);
    // this.setLoggedInUserToStorage();
    return true;
  }

  private getLoggedInUserFromStorage() {
    return JSON.parse(localStorage.getItem('LoggedInUser')) || null;
  }

  private setLoggedInUserToStorage() {
    localStorage.setItem('LoggedInUser', JSON.stringify(this.userBehaviourSubject.value));
  }

  private getUsersListFromUserStorage() {
    const appData = JSON.parse(localStorage.getItem('appData')) || {usersList: []};

    return appData.usersList;
  }

  private updateUserData() {
    const appData = JSON.parse(localStorage.getItem('appData')) || {usersList: []};

    const userIndex = appData.usersList.findIndex(x => x.id == this.userID);

    appData.usersList[userIndex] = this.user;

    localStorage.setItem('appData', JSON.stringify(appData));
  }

  private addUserToStorage(username, password) {
    const appData = JSON.parse(localStorage.getItem('appData')) || {usersList: []};

    appData.usersList.push({username, password, id: appData.usersList.length + 1});

    localStorage.setItem('appData', JSON.stringify(appData));
  }
}
