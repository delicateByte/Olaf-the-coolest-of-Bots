interface UseCaseConnector {
  useCaseName: String;
  sendResponse(arg: any): UseCaseResponse;
  recieveMessage(arg: any): void;

}
