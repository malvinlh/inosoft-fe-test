import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import CreateInspection from '../../components/pages/CreateInspection.jsx';
import inspectionsReducer, { postInspection } from '../../store/inspectionSlice';
import metaReducer from '../../store/metaSlice';
import { dropdownsFixture, templatesFixture, itemsFixture } from '../fixtures';

jest.mock('../../store/inspectionSlice', () => {
  const actual = jest.requireActual('../../store/inspectionSlice');
  return {
    __esModule: true,
    ...actual,
    postInspection: jest.fn((payload) => () => {
      const value = { id: 'INSP-NEW', ...payload };

      const promise = Promise.resolve({
        type: 'inspections/create/fulfilled',
        payload: value,
      });

      promise.unwrap = () => Promise.resolve(value);

      return promise;
    }),
  };
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => jest.fn() };
});

function setup() {
  const store = configureStore({
    reducer: { inspections: inspectionsReducer, meta: metaReducer },
    preloadedState: {
      inspections: { list: [], selected: null, status: 'idle', error: null },
      meta: {
        dropdowns: dropdownsFixture,
        templates: templatesFixture,
        items: itemsFixture,
        status: 'succeeded',
        error: null,
      },
    },
  });

  const ui = (
    <Provider store={store}>
      <BrowserRouter>
        <CreateInspection />
      </BrowserRouter>
    </Provider>
  );

  return { store, ui };
}

test('Submit disabled until serviceType, scope, qty valid; then enabled and dispatches post', async () => {
  const user = userEvent.setup();
  const { ui } = setup();

  render(ui);

  const submitBtn = screen.getByRole('button', { name: /submit/i });
  expect(submitBtn).toBeDisabled();

  const setupHeading = screen.getByText(/setup/i);
  const setupCardBody = setupHeading.closest('.card-body') ?? setupHeading.parentElement;
  const selects = within(setupCardBody).getAllByRole('combobox');

  await user.selectOptions(selects[0], 'new-arrival');
  await user.selectOptions(selects[1], 'inspection-basic');

  expect(submitBtn).not.toBeDisabled();

  await user.click(submitBtn);
  expect(postInspection).toHaveBeenCalled();
});