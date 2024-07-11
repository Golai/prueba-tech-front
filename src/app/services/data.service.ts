import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../enviroments/enviorements';
import { IServicesF } from '../interface/services-f';
import { IUser } from '../interface/user';
import { ITransactionSend } from '../interface/transaction';
import { ITransactionReceive } from '../interface/transactionsR';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  uri = environment.apiUrl;

  constructor(private http: HttpClient) { 

  }

  getUserData(){
    return this.http.get<IUser>(this.uri + '/userUnique');
  }

  getServiceData(){
    return this.http.get<IServicesF[]>(this.uri + '/services');
  }

  acquireService(transaction: ITransactionSend){
    return this.http.post<any>(this.uri + '/registerServiceUser', transaction);
  }

  getTransactions(){
    return this.http.get<ITransactionReceive[]>(this.uri + '/transactions');
  }

  releaseTransaction(transaction_id: string){
    let data = {
      transaction_id
    }
  
    return this.http.post<any>(this.uri + '/releaseTransaction', data);
  }

}
