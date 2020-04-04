import UseCaseResponse from './UseCaseResponse';

class TextResponse implements UseCaseResponse {
  constructor(readonly text: string) {}
}
export default TextResponse;
