export default class UnsplashImage {
  constructor(
    readonly description: string,
    readonly postUrl: string,
    readonly imageUrl: string,
    readonly userName: string,
    readonly tags: Array<string>,
    readonly location: string,
    readonly coordinates: [number, number],
  ) { }
}
