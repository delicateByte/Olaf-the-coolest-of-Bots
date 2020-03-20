interface UseCaseConnector {
  useCaseName: String;
  sendResponse(arg: any): Promise<UseCaseResponse[]>;
  recieveMessage(arg: any): void;
  endUseCase(): Boolean;
  resetUseCase(): void;
}
