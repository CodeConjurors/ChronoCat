import {
  ElementRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  MeasureOnSuccessCallback,
  Text,
  View,
} from 'react-native'

type MeasureCallback = MeasureOnSuccessCallback

type DraggableListItemState = 'normal' | 'highlighted' | 'moving'

interface DraggableListRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  state: DraggableListItemState
}

type DraggableListRenderItem<ItemT> = (
  info: DraggableListRenderItemInfo<ItemT>,
) => React.ReactElement | null

type DraggableListProps<ItemT> = {
  data: ItemT[]
  setData: (newData: ItemT) => void
  renderItem: DraggableListRenderItem<ItemT>
  keyExtractor: (item: ItemT, index: number) => string
  onDragEnd: (from: number, to: number) => void
  draggingEnabled: boolean
  ListEmptyComponent: React.ReactElement
  style: React.CSSProperties
}

/**
 * List whose items can be reordered by dragging.
 *
 * @component
 * @example
 * const ListEmptyMessage = () => (
 *   <Text style={{ marginHorizontal: 10 }}>No items</Text>
 * )
 *
 * const App = () => {
 *   const [data, setData] = useState(['First', 'Second', 'Third'])
 *   const [draggingEnabled, setDraggingEnabled] = useState(false)
 *
 *   const renderItem = ({ item, state }) => {
 *     const itemStyle = {
 *       backgroundColor: state === 'normal' ? '#f9c2ff' : '#fcc8c2',
 *       flexGrow: 1,
 *       padding: 16,
 *       margin: 10,
 *       color: state === 'highlighted' ? 'transparent' : null,
 *       opacity: state === 'highlighted' ? 0.5 : 1,
 *     }
 *     return <Text style={itemStyle}>{item}</Text>
 *   }
 *
 *   return (
 *     <View>
 *       <DraggableList
 *         style={{ marginTop: 50 }}
 *         data={data}
 *         setData={setData}
 *         renderItem={renderItem}
 *         onDragEnd={(from, to) => console.log(`${from}->${to}`)}
 *         draggingEnabled={draggingEnabled}
 *         ListEmptyComponent={<ListEmptyMessage />}
 *       />
 *       <View style={{ margin: 15 }}>
 *         <Button
 *           title={draggingEnabled ? 'Stop Editing' : 'Edit'}
 *           onPress={() => setDraggingEnabled(!draggingEnabled)}
 *           color={draggingEnabled ? 'lightgray' : 'steelblue'}
 *         />
 *       </View>
 *     </View>
 *   )
 * }
 */
const DraggableList = <ItemT,>(props: DraggableListProps<ItemT>) => {
  const itemYBounds = useRef(Array(props.data.length + 1).fill(0)).current
  const [handleBound, setHandleBound] = useState(0)
  const [startIndex, setStartIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [pan, setPan] = useState(0)
  const [offset, setOffset] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const componentRef = useRef(null)
  const [componentOffset, setComponentOffset] = useState(0)

  const measureComponent = () => {
    const callback: MeasureCallback = (x, y, width, height, pageX, pageY) => {
      setComponentOffset(pageY)
    }
    componentRef.current?.measure(callback)
  }

  // TODO: Find out if this useEffect is actually needed
  useEffect(() => {
    if (itemYBounds.length - 1 > props.data.length) {
      const removeCount = itemYBounds.length - props.data.length - 1
      itemYBounds.splice(-removeCount, removeCount)
    } else if (itemYBounds.length - 1 < props.data.length) {
      const appendCount = props.data.length - itemYBounds.length + 1
      itemYBounds.push(...Array<number>(appendCount).fill(0))
    }
  }, [props.data])

  const shouldRespondToTouch = (evt: GestureResponderEvent) => {
    return props.draggingEnabled && evt.nativeEvent.pageX > handleBound
  }

  const onStart = (evt: GestureResponderEvent) => {
    for (let i = 1; i < itemYBounds.length; i++) {
      if (evt.nativeEvent.pageY < itemYBounds[i] - scrollOffset) {
        setOffset(-(evt.nativeEvent.pageY - (itemYBounds[i - 1] - scrollOffset)))
        setPan(evt.nativeEvent.pageY)
        setStartIndex(i - 1)
        setSelected(i - 1)
        break
      }
    }
  }

  const onMove = (evt: GestureResponderEvent) => {
    if (selected === null) {
      return
    }

    setPan(evt.nativeEvent.pageY)

    const selectedItemHeight = itemYBounds[selected + 1] - itemYBounds[selected]
    const selectedItemMiddle = pan + offset + selectedItemHeight / 2
    for (let i = 1; i < itemYBounds.length; i++) {
      if (selectedItemMiddle < itemYBounds[i] - scrollOffset) {
        if (i - 1 !== selected) {
          const dataWithoutSelected = [
            ...props.data.slice(0, selected),
            ...props.data.slice(selected + 1),
          ]
          props.setData([
            ...dataWithoutSelected.slice(0, i - 1),
            props.data[selected],
            ...dataWithoutSelected.slice(i - 1),
          ])
          setSelected(i - 1)
        }
        break
      }
    }
  }

  const onStop = () => {
    setSelected(null)
    props.onDragEnd(startIndex, selected)
  }

  const draggableRenderItem: ListRenderItem<ItemT> = ({ item, index }) => {
    const content = props.renderItem({
      item: item,
      index: index,
      state: selected === index ? 'highlighted' : 'normal',
    })

    return (
      <DraggableItem
        content={content}
        index={index}
        itemCount={props.data.length}
        itemYBounds={itemYBounds}
        setHandleBound={setHandleBound}
        isSelected={selected === index}
        draggingEnabled={props.draggingEnabled}
      />
    )
  }

  const movingItem = selected !== null && (
    <View
      style={{
        position: 'absolute',
        top: pan + offset - componentOffset,
        zIndex: 10,
        opacity: 0.8,
        width: '100%',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {props.renderItem(
        { item: props.data[selected], index: selected, state: 'moving' },
      )}
      <DraggingHandle />
    </View>
  )

  return (
    <View
      onLayout={measureComponent}
      ref={componentRef}
      onStartShouldSetResponder={shouldRespondToTouch}
      onResponderGrant={onStart}
      onResponderMove={onMove}
      onResponderRelease={onStop}
    >
      {movingItem}
      <FlatList
        data={props.data}
        renderItem={draggableRenderItem}
        keyExtractor={props.keyExtractor}
        style={props.style}
        onScroll={evt => setScrollOffset(evt.nativeEvent.contentOffset.y)}
        scrollEnabled={!props.draggingEnabled}
        ListEmptyComponent={props.ListEmptyComponent}
      />
    </View>
  )
}

type DraggingHandleProps = {
  passOnLayout: (event: LayoutChangeEvent) => void
  isSelected: boolean
}

const DraggingHandle = forwardRef((props: DraggingHandleProps, ref) => (
  <Text
    style={{
      fontSize: 35,
      paddingHorizontal: 15,
      paddingBottom: 5,
      opacity: props.isSelected ? 0 : 1,
    }}
    onLayout={props.passOnLayout}
    ref={ref}
  >
    ≡
  </Text>
))

type DraggableItemProps = {
  content: React.ReactElement
  index: number
  itemCount: number
  itemYBounds: number[]
  setHandleBound: (newBound: number) => void
  isSelected: boolean
  draggingEnabled: boolean
}

const DraggableItem = (props: DraggableItemProps) => {
  const itemRef = useRef<ElementRef<typeof View>>(null)
  const handleRef = useRef<ElementRef<typeof View>>(null)
  const [bottomYPos, setBottomYPos] = useState(0)
  const [topYPos, setTopYPos] = useState(0)
  const [handleXPos, setHandleXPos] = useState(0)

  const measureItem = () => {
    const callback: MeasureCallback = (x, y, width, height, pageX, pageY) => {
      setBottomYPos(pageY + height)
      setTopYPos(pageY)
    }
    itemRef.current?.measure(callback)
  }

  useEffect(() => {
    if (props.itemYBounds.length - 1 > props.itemCount) {
      const removeCount = props.itemYBounds.length - props.itemCount - 1
      props.itemYBounds.splice(-removeCount, removeCount)
    } else if (props.itemYBounds.length - 1 < props.itemCount) {
      const appendCount = props.itemCount - props.itemYBounds.length + 1
      props.itemYBounds.push(...Array<number>(appendCount).fill(0))
    }

    props.itemYBounds[props.index + 1] = bottomYPos

    if (props.itemYBounds.length > 1 &&
        typeof props.itemYBounds[0] === 'number' &&
        props.itemYBounds[0] !== NaN &&
        typeof props.itemYBounds[1] === 'number' &&
        props.itemYBounds[1] !== NaN) {
      const itemHeight = props.itemYBounds[1] - props.itemYBounds[0]
      let newItemYBounds = [...props.itemYBounds]
      for (let i = 2; i < newItemYBounds.length; i++) {
        newItemYBounds[i] = newItemYBounds[i - 1] + itemHeight
      }
      props.itemYBounds.splice(0, props.itemYBounds.length)
      props.itemYBounds.push(...newItemYBounds)
    }
  }, [bottomYPos])

  if (props.index === 0) {
    useEffect(() => {
      props.itemYBounds[0] = topYPos
    }, [topYPos])
  }

  const measureHandle = () => {
    const callback: MeasureCallback = (x, y, width, height, pageX) => {
      setHandleXPos(pageX)
    }
    handleRef.current?.measure(callback)
  }

  useEffect(() => {
    if (typeof handleXPos === 'number' && handleXPos !== NaN) {
      props.setHandleBound(handleXPos)
    }
  }, [handleXPos])

  return (
    <View
      onLayout={measureItem}
      ref={itemRef}
      style={{
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {props.content}
      {
        props.draggingEnabled &&
        <DraggingHandle
          passOnLayout={measureHandle}
          ref={handleRef}
          isSelected={props.isSelected}
        />
      }
    </View>
  )
}

export default DraggableList
