import UseCaseResponse from './UseCaseResponse';

class ImageResponse implements UseCaseResponse {
  constructor(readonly imagePath: string) {}
}
export default ImageResponse;
