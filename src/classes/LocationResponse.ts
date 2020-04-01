import UseCaseResponse from './UseCaseResponse';

class LocationResponse implements UseCaseResponse {
  constructor(readonly latitude: number, readonly longitude: number) {}
}
export default LocationResponse;
