import { TwilioJukeboxPage } from './app.po';

describe('Twilio Jukebox App', () => {
  let page: TwilioJukeboxPage;

  beforeEach(() => {
    page = new TwilioJukeboxPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
