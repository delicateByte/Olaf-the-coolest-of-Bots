import UseCaseResponse from './UseCaseResponse';

class AudioResponse implements UseCaseResponse {
  constructor(readonly audioPath: string) {}
}
export default AudioResponse;
