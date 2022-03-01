import { useState, useMemo, useEffect, useContext } from 'react';
import { useSetStatus, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { MapProps } from '.';
import { Context } from './context';

export interface OverlayProps extends MapChildProps {}

/**
 * 此类型是 `<Map>` 组件传递给子组件(如 `<Marker>`)的两个 props
 */
export interface MapChildProps {
  /**
   * 地图API的核心类，SDK加载完成才有
   */
  AMap?: typeof AMap;
  /**
   * 实例化后的地图对象
   */
  map?: AMap.Map;
}

export interface UseMap extends MapProps, MapChildProps {
  /**
   * 指定的容器
   */
  container?: HTMLDivElement | null;
}

export const useMap = (props: UseMap = {}) => {
  const { ...other } = props;
  const [map, setMap] = useState<AMap.Map>();
  const [zoom, setZoom] = useState(props.zoom || 15);
  const [container, setContainer] = useState<HTMLDivElement | null | undefined>(props.container);
  const { dispatch } = useContext(Context);
  useEffect(() => {
    let instance: AMap.Map;
    if (container && !map && AMap) {
      const wapper = document.createElement('div');
      wapper.className = 'react-amap-wapper';
      wapper.style.height = '100%';
      wapper.style.width = '100%';
      instance = new AMap.Map(wapper, { zoom, ...other });
      container.appendChild(wapper);
      setMap(instance);
    }
    return () => {
      if (instance) {
        instance.destroy();
        instance.clearMap();
        instance.clearInfoWindow();
        instance.clearLimitBounds();
        setMap(undefined);
      }
    };
  }, [container]);

  useEffect(() => {
    if (map && container) {
      dispatch({ map, container, AMap });
    }
    return () => {
      dispatch({ map: undefined, container: undefined, AMap: undefined });
    };
  }, [map, container]);

  useMemo(() => {
    if (map && typeof props.zoom === 'number' && zoom !== props.zoom && props.zoom >= 2 && props.zoom <= 20) {
      setZoom(props.zoom);
      map.setZoom(props.zoom);
    }
  }, [zoom, props.zoom]);

  useSetStatus<AMap.Map, UseMap>(map!, props, [
    'dragEnable',
    'zoomEnable',
    'jogEnable',
    'pitchEnable',
    'rotateEnable',
    'animateEnable',
    'keyboardEnable',
  ]);
  // setStatus, setZoomAndCenter, setFitView
  useSettingProperties<AMap.Map, UseMap>(map!, props, [
    'Zoom',
    'LabelzIndex',
    'Layers',
    'Center',
    'City',
    'Bounds',
    'LimitBounds',
    'Lang',
    'Rotation',
    'DefaultCursor',
    'MapStyle',
    'Features',
    'DefaultLayer',
    'Pitch',
  ]);
  useEventProperties<AMap.Map, UseMap>(map!, props, [
    'onMouseMove',
    'onZoomChange',
    'onMapMove',
    'onMouseWheel',
    'onZoomStart',
    'onMouseOver',
    'onMouseOut',
    'onDblClick',
    'onClick',
    'onZoomEnd',
    'onMoveEnd',
    'onMouseUp',
    'onMouseDown',
    'onRightClick',
    'onMoveStart',
    'onDragStart',
    'onDragging',
    'onDragEnd',
    'onHotspotOut',
    'onHotspotOver',
    'onTouchStart',
    'onComplete',
    'onHotspotClick',
    'onTouchMove',
    'onTouchEnd',
    'onResize',
  ]);
  return {
    map,
    setMap,
    container,
    setContainer,
  };
};
