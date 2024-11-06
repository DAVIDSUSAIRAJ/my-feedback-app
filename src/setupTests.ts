beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('ReactDOMTestUtils.act is deprecated')) {
        return;
      }
      console.error(message);
    });
  });
  
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  