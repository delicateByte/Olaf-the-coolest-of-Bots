import TranslatorUsecase from './translatorUsecase';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';


function getMockUsecase() {
  return new TranslatorUsecase();
}


test('Initial message to use case', () => {
  const mockUsecase = getMockUsecase();
  
})