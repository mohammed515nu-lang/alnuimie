/**
 * Code Connect: maps the published Figma component or frame for auth to this screen.
 * Replace FIGMA_NODE_URL with “Copy link to selection” from Figma (must include node-id=…),
 * then run: npx figma connect publish
 */
import figma from '@figma/code-connect/react';

import { LoginScreen } from './LoginScreen';

const FIGMA_NODE_URL =
  'https://www.figma.com/design/REPLACE_FILE_KEY/REPLACE_NAME?node-id=0-1';

figma.connect(LoginScreen, FIGMA_NODE_URL, {
  example: () => <LoginScreen />,
});
