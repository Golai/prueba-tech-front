import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { IServicesF } from '../../interface/services-f';
import { IUser } from '../../interface/user';
import { ITransactionSend } from '../../interface/transaction';
import { ITransactionReceive } from '../../interface/transactionsR';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services-f',
  templateUrl: './services-f.component.html',
  styleUrl: './services-f.component.css'
})
export class ServicesFComponent {

  services_f: IServicesF[] = [];
  user?: IUser;
  transactions: ITransactionReceive[] = [];

  constructor(private _dataService: DataService,
              private _dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.setData();
  }

  async setData(){
    await this.getUserData();
    await this.getServices();
    await this.getTransactions();
  }

  async getUserData(){
    await this._dataService.getUserData().subscribe(data => {
      console.log(data)
      this.user = data;
    });
  }

  async getServices(){
    await this._dataService.getServiceData().subscribe(data => {
      console.log(data);
      this.services_f = data;
      console.log(this.services_f)
    });
  }

  async getTransactions(){
    await this._dataService.getTransactions().subscribe(data => {
      console.log("transactions")
      console.log(data);
      this.transactions = data;
    });
  }

  async acquireService(service: IServicesF){
    const dialog = this._dialog.open(DialogAcquireService,{
      width: '400px',
      data: {
        service: service,
        user_id: this.user?._id
      }
    });

    dialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUserData();
      this.getTransactions();
      console.log(result);
    });
  
  }

  messageConfirm(message: string){
    Swal.fire({
      title: message,
      icon: 'success',
      confirmButtonText: 'Continuar'
    })
  }

  async deleteTransaction(transaction_id: string, name_service: string){
    Swal.fire({
      title: `Esta apunto de retirarse del servicio: ${name_service}`,
      text: 'Desea continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("retirando: ")
        this._dataService.releaseTransaction(transaction_id).subscribe(data => {
          console.log(data);
          this.getTransactions();
          this.getUserData();
          this.messageConfirm('Transaccion retirada');
        })
      }

    })
    // await this._dataService.deleteTransaction(transaction).subscribe(data => {
    //   console.log(data);
    //   this.getTransactions();
    // })
  }


}



/**
 * @title Dialog Acquire Service
 */
@Component({
  selector: 'services-acquire-dialog',
  templateUrl: 'services-acquire-dialog.html'
})
export class DialogAcquireService {

  service!: IServicesF;
  user_id!: string;
  amount!: number;;

  constructor(public dialogRef: MatDialogRef<DialogAcquireService>,
              @Inject(MAT_DIALOG_DATA) public data: { service: IServicesF, user_id: string },
              private _dataService: DataService
  ) { 

    console.log(data)
    this.service = data.service;
    this.user_id = data.user_id;
    this.amount = this.service.amount_min;
  }

  openDialog(): void {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  messageConfirm(message: string){
    
  }

  acquireService(){
    // this.dialogRef.close(this.amount);
    console.log("amount", this.amount);
    let transaction: ITransactionSend = {
      service_id: this.service._id,
      user_id: this.user_id,
      amount: this.amount
    }
    this._dataService.acquireService(transaction).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: 'Fondo adquirido',
        icon: 'success',
        confirmButtonText: 'Continuar'
      })
      this.dialogRef.close();
    })
  }
}

