import UseCaseResponse from './UseCaseResponse';

class VoiceResponse implements UseCaseResponse {
  constructor(readonly text: string) {}
}
export default VoiceResponse;
