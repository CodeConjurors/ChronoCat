import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'

let DATA = [
  {
    time: '13:00',
    name: 'Lunch',
  },
  {
    time: '14:00',
    name: 'Walk',
  },
  {
    time: '18:00',
    name: 'Dinner',
  },
]

type ActivityProps = { time: string; name: string; deleteActivity: () => void }

const Activity = ({ time, name, deleteActivity }: ActivityProps) => (
  <View style={styles.item}>
    <Text style={styles.item}>
      {time} - {name}
    </Text>
    <Button title='Delete' onPress={deleteActivity} />
  </View>
)

const App = () => {
  const [activities, setActivities] = useState(DATA)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')

  const addActivity = () => {
    setActivities([...activities, { time, name }])
    setTime('')
    setName('')
  }

  const deleteActivity = (item: { time: string; name: string }) => {
    setActivities(
      activities.filter(activity => !(activity.time === item.time && activity.name === item.name))
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <View style={styles.item}>
            <Text>Activities</Text>
            <FlatList
              data={activities}
              renderItem={({ item }) => (
                <Activity
                  time={item.time}
                  name={item.name}
                  deleteActivity={() => deleteActivity(item)}
                />
              )}
            />
          </View>
          <View style={styles.item}>
            <Text>Add a new activity</Text>
            <TextInput placeholder='Time' onChangeText={newTime => setTime(newTime)} value={time} />
            <TextInput placeholder='Name' onChangeText={newName => setName(newName)} value={name} />
            <Button title='Add' onPress={addActivity} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
    fontSize: 20,
  },
})

export default App
