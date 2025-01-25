import { useEffect, useRef, useState } from 'react'

import { FlatList, View } from 'react-native'

/**
 * List whose items can be reordered by dragging. At the moment dragging mode
 * cannot be turned off for the list and the animations are not very smooth.
 * (The list item is just highlighted, when you start dragging it. It does not
 * appear to move, until you drag it onto another item.)
 *
 * @component
 * @example
 * const App = () => {
 *   const [data, setData] = useState(['First', 'Second', 'Third'])
 *
 *   const renderItem = ({ item, index, isActive }) => (
 *     <Text style={{ backgroundColor: isActive ? 'plum' : 'pink' }}>{item}</Text>
 *   )
 *
 *   return (
 *     <DraggableList
 *       data={data}
 *       setData={setData}
 *       renderItem={renderItem}
 *       onDragEnd={(from, to) => console.log(`${from}->${to}`)}
 *     />
 *   )
 * }
 */
const DraggableList = ({ data, setData, renderItem, keyExtractor, onDragEnd }) => {
  const [itemYBounds, setItemYBounds] = useState(Array(data.length).fill(0))
  const [startIndex, setStartIndex] = useState(null)
  const [selected, setSelected] = useState(null)

  const onStart = evt => {
    for (let i = 0; i < itemYBounds.length; i++) {
      if (evt.nativeEvent.pageY < itemYBounds[i]) {
        setStartIndex(i)
        setSelected(i)
        break
      }
    }
  }

  const onMove = evt => {
    if (selected === null) {
      return
    }

    for (let i = 0; i < itemYBounds.length; i++) {
      if (evt.nativeEvent.pageY < itemYBounds[i]) {
        if (i !== selected) {
          const dataWoSelected = [
            ...data.slice(0, selected),
            ...data.slice(selected + 1),
          ]
          setData([
            ...dataWoSelected.slice(0, i),
            data[selected],
            ...dataWoSelected.slice(i),
          ])
          setSelected(i)
        }
        break
      }
    }
  }

  const onStop = evt => {
    setSelected(null)
    onDragEnd(startIndex, selected)
  }

  const draggableRenderItem = ({ item, index }) => (
    <DraggableItem
      content={renderItem({ item, index, isActive: selected === index })}
      index={index}
      itemYBounds={itemYBounds}
      setItemYBounds={setItemYBounds}
    />
  )

  return (
    <View
      onStartShouldSetResponder={evt => true}
      onResponderGrant={onStart}
      onResponderMove={onMove}
      onResponderRelease={onStop}
    >
      <FlatList
        data={data}
        renderItem={draggableRenderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

const DraggableItem = ({ content, index, itemYBounds, setItemYBounds }) => {
  const itemRef = useRef(null)
  const [bottomYPos, setBottomYPos] = useState(0)

  const doMeasure = () => {
    itemRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBottomYPos(pageY + height)
    })
  }

  useEffect(() => {
    setItemYBounds([
      ...itemYBounds.slice(0, index),
      bottomYPos,
      ...itemYBounds.slice(index + 1)
    ])
  }, [bottomYPos])

  return <View onLayout={doMeasure} ref={itemRef}>{content}</View>
}

export default DraggableList
