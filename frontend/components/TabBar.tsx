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
