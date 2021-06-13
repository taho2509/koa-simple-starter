export type Status = 'Success' | 'Error'
export interface Presenter {
  present(data: object): Presenter
  status(status: Status): Presenter
}
