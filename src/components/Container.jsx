import React, { useState, useCallback, useEffect } from 'react';

import DropZone from './DropZone';
import TrashDropZone from './TrashDropZone';
import SideBarItem from './SideBarItem';
import Row from './Row';
import initialData from '../lib/initial-data';
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from '../lib/helpers';

import {
  SIDEBAR_ITEMS,
  SIDEBAR_ITEM,
  COMPONENT,
  COLUMN,
  ROW,
} from '../lib/constants';
import shortid from 'shortid';

const Container = () => {
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split('-');
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout],
  );

  useEffect(() => {}, [layout]);

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split('-');
      const pathToDropZone = splitDropZonePath.slice(0, -1).join('-');

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        if (item.component.type === COLUMN) {
          const newItem = {
            id: shortid.generate(),
            type: COLUMN,
          };
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem,
            ),
          );
          return;
        } else if (item.component.type === ROW) {
          const newItem = {
            id: shortid.generate(),
            type: ROW,
          };
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem,
            ),
          );
          return;
        } else {
          // 1. Move sidebar item into page
          const newComponent = {
            id: shortid.generate(),
            ...item.component,
          };
          const newItem = {
            id: newComponent.id,
            type: COMPONENT,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem,
            ),
          );
          return;
        }
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split('-');
      const pathToItem = splitItemPath.slice(0, -1).join('-');

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath),
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem,
          ),
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem,
        ),
      );
    },
    [layout, components],
  );

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className='body'>
      <div className='sideBar'>
        {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
          <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      </div>
      <div className='pageContainer'>
        <div className='page'>
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                    dropZone: ROW,
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
        <h2 style={{ margin: '1rem' }}>Full object data:</h2>
        <pre
          style={{
            border: '1px solid blue',
            margin: '1rem',
            maxHeight: '200px',
            overflow: 'scroll',
          }}
        >
          {JSON.stringify(layout, null, 2)}
        </pre>
      </div>
    </div>
  );
};
export default Container;
