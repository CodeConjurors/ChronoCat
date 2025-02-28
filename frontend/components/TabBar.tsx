import { useEffect } from 'react'
import { Button, FlatList, ListRenderItem, View } from 'react-native'

type TabBarProps<ItemT> = {
  data: ItemT[]
  titleExtractor: (item: ItemT) => string
  keyExtractor: (item: ItemT) => string
  selectedItem: ItemT
  setSelectedItem: (item: ItemT) => void
  highlightColor: string
}

const TabBar = <ItemT,>(props: TabBarProps<ItemT>) => {
  useEffect(() => {
    if (!props.data.includes(props.selectedItem) && props.data.length > 0) {
      props.setSelectedItem(props.data[0])
    }
  }, [props.data])

  const renderItem: ListRenderItem<ItemT> = ({ item }) => (
    <Button
      onPress={() => props.setSelectedItem(item)}
      title={props.titleExtractor(item)}
      color={props.selectedItem === item ? props.highlightColor : null}
    />
  )

  return (
    <View>
      <FlatList
        data={props.data}
        renderItem={renderItem}
        keyExtractor={props.keyExtractor}
        horizontal={true}
      />
    </View>
  )
}

export default TabBar
