import { useRef, useEffect, useState } from 'react';
import Markdown from '../../components/Markdown';
import { APILoader, Map, useMap, Rectangle, useRectangle } from '../../../';

export default class Page extends Markdown {
  editorUrl = '/src/Rectangle/README.md';
  dependencies = { APILoader, Map, useMap, Rectangle, useRectangle, useRef, useEffect, useState };
  getMdStr = () => import('../../../src/Rectangle/README.md');
}
