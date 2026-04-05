import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Root } from '@/app/Root';
import { HomePage } from '@/features/showcase';
import { GymDashboard } from '@/features/gym';
import EditorApp from '@/features/editor/EditorApp';
import { ROUTES } from '@/core/config';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.GYM, element: <GymDashboard /> },
      // /editor and /editor/demo both redirect to the demo session (wall id=1)
      { path: ROUTES.EDITOR, element: <Navigate to="/editor/1" replace /> },
      { path: `${ROUTES.EDITOR}/demo`, element: <Navigate to="/editor/1" replace /> },
    ],
  },
  // Editor lives outside Root — it is a full-screen canvas with its own nav
  { path: '/editor/:wallId', element: <EditorApp /> },
  { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
]);
