import { SVCCv2Page } from './app.po';

describe('svccv2 App', () => {
  let page: SVCCv2Page;

  beforeEach(() => {
    page = new SVCCv2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
