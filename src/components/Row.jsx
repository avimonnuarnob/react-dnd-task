import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { COLUMN, ROW } from '../lib/constants';
import DropZone from './DropZone';
import Column from './Column';
import Modal from './Modal';

const style = {};
const Row = ({ data, components, handleDrop, path }) => {
  const [showModal, setShowModal] = useState(false);

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ROW,
    item: {
      type: ROW,
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

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  return (
    <>
      <div
        ref={ref}
        style={{ ...style, opacity }}
        className='base draggable row'
        onClick={() => setShowModal(true)}
      >
        {data.id}
        <div className='columns'>
          {data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                    dropZone: COLUMN,
                  }}
                  onDrop={handleDrop}
                  className='horizontalDrag'
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length,
            }}
            onDrop={handleDrop}
            className='horizontalDrag'
            isLast
          />
        </div>
      </div>
      <Modal
        open={showModal}
        data={data.id}
        close={() => setShowModal(false)}
      />
    </>
  );
};
export default Row;
