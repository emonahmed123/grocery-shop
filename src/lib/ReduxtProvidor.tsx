"use client"


import { store, persistor } from '@/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'

const ReduxtProvidor = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor} >
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxtProvidor;