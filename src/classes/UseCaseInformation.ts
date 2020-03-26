
class UseCaseInformation {
  originalMessage: Object;

  messageType: string;

  text: string | void;

  lattitude?: number;

  longitude?: number;


  constructor(originalMessage: any) {
    this.originalMessage = originalMessage;
  }
}
export default UseCaseInformation;
