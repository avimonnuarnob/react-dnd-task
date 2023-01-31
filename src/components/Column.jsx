import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { COLUMN, COMPONENT } from '../lib/constants';
import DropZone from './DropZone';
import Component from './Component';
import Modal from './Modal';

const style = {};
const Column = ({ data, components, handleDrop, path }) => {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COLUMN,
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <Component
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
      />
    );
  };

  return (
    <>
      <div
        ref={ref}
        style={{ ...style, opacity }}
        className='base draggable column'
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        {data.id}
        {data.children.map((component, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={component.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                  dropZone: COMPONENT,
                }}
                onDrop={handleDrop}
              />
              {renderComponent(component, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length,
          }}
          onDrop={handleDrop}
          isLast
        />
      </div>
      <Modal
        open={showModal}
        data={data.id}
        close={() => setShowModal(false)}
      />
    </>
  );
};
export default Column;
