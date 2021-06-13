export default interface Interactor {
  execute(...input: (object | string)[]): Promise<object>
}
