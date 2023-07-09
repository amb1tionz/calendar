import { Reservation } from "./reservation.model"

export interface IcalData {
  success: boolean,
  data: Array<Reservation>[],
  error?: string
}
