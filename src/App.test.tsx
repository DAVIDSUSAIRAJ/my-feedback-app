import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from './App';

test("getFeedback",()=>{
  render(<App />);
    const textElement = screen.getByText(/Feedback App/i);  // Look for "Feedback App" on the screen
    expect(textElement).toBeInTheDocument();  // Assert that it's in the document

})


