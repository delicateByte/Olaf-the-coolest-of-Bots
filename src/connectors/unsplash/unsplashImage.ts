export default class UnsplashImage {
  constructor(
    readonly postUrl: string,
    readonly imageUrl: string,
    readonly userName: string,
    readonly tags: Array<string>,
    readonly location: [number, number],
  ) { }
}
