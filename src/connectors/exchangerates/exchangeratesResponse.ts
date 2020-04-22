export default class ExchangeratesResponse {
  constructor(
    readonly rates: Object,
    readonly base: string,
    readonly date: string,
  ) { }
}
