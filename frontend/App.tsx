import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import env from './env'

const apiUrl = env.apiUrl

type ActivityProps = { id: number; time: string; name: string; deleteActivity: () => void }

const Activity = ({ time, name, deleteActivity }: ActivityProps) => (
  <View style={styles.item}>
    <Text style={styles.item}>
      {time} - {name}
    </Text>
    <Button title='Delete' onPress={deleteActivity} />
  </View>
)

const App = () => {
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [time, setTime] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    const response = await fetch(apiUrl)
    const json = await response.json()
    setActivities(json)
  }

  const addActivity = async () => {
    const response = await fetch(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: time,
          name: name,
        }),
      }
    )
    const json = await response.json()
    setActivities(activities.concat(json))
    setTime('')
    setName('')
  }

  const deleteActivity = async (item: { id: number; time: string; name: string }) => {
    const response = await fetch(
      `${apiUrl}/${item.id}`,
      {
        method: 'DELETE',
      }
    )
    setActivities(activities.filter(activity => activity.id !== item.id))
  }

  const renderItem = ({ item }: { item: ActivityProps }) => {
    return (
      <Activity
        id={item.id}
        time={item.time}
        name={item.name}
        deleteActivity={() => deleteActivity(item)}
      />
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <ScrollView>
            <View style={styles.item}>
              <Text>Activities</Text>
              <FlatList data={activities} renderItem={renderItem} />
            </View>
            <View style={styles.item}>
              <Text>Add a new activity</Text>
              <TextInput
                placeholder='Time'
                onChangeText={newTime => setTime(newTime)}
                value={time}
              />
              <TextInput
                placeholder='Name'
                onChangeText={newName => setName(newName)}
                value={name}
              />
              <Button title='Add' onPress={addActivity} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
    fontSize: 20,
  },
})

export default App
