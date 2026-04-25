import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { SortToggle } from '../SortToggle';

describe('SortToggle', () => {
  it('calls onChange when selecting a different sort', () => {
    const onChange = jest.fn();
    const screen = render(<SortToggle value="score" onChange={onChange} />);

    fireEvent.press(screen.getByText('Sort: Time'));

    expect(onChange).toHaveBeenCalledWith('time');
  });
});
