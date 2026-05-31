import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { EventEmitter } from 'events';
import { MathJaxContext } from 'better-react-mathjax';
import { TextSelectionProvider } from './elle/components/text-to-speech/TextSelectionContext';
import { routes } from './routes';
import { theme } from './elle/const/StyleConstants';
import { RootProvider } from './elle/context/RootContext';
import { AnalyticsProvider } from './elle/context/AnalyticsContext';

export const errorEmitter = new EventEmitter();
export const loadingEmitter = new EventEmitter();
export const successEmitter = new EventEmitter();

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MathJaxContext version={2}>
      <TextSelectionProvider>
        <ThemeProvider theme={theme}>
          <RootProvider>
            <AnalyticsProvider router={router}>
              <RouterProvider router={router} />
            </AnalyticsProvider>
          </RootProvider>
        </ThemeProvider>
      </TextSelectionProvider>
    </MathJaxContext>
  );
}
