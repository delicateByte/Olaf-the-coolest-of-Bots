
import UseCaseResponse from './UseCaseResponse';
import MessageResponseType from './messageResponseTypeEnum';

class TextResponse extends UseCaseResponse {
  messageResponseType: MessageResponseType;

  useCaseToEnd: string;
}
export default TextResponse;
