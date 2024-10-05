export interface Prestamo {
  id: number;
  nombre: string;
  monto: number;
  fecha: string;
  wallet: string;
  items: string;
  discordUser: string;
  interesDiario: number;
  pagos: number[];
}

export interface PagoAbono {
  prestamoId: number;
  cantidad: number;
}