
export class UseCaseInformation {
  originalMessage: Object;
  messageType: string;
  text: string;
  lattitude?: number;
  longitude?: number;


  constructor(originalMessage: any) {
    this.originalMessage = originalMessage;
  }
}
