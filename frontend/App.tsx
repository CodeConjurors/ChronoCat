import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native'
import DraggableList from './components/DraggableList'
import TabBar from './components/TabBar'
import env from './env'

const apiUrl = env.apiUrl

type ActivityProps = { id: number; time: string; name: string; deleteActivity: () => void }

const Activity = ({ time, name, deleteActivity }: ActivityProps) => (
  <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
    <View>
      <Text style={{ marginBottom: 5 }}>
        {time} - {name}
      </Text>
      <Button title='Delete' onPress={deleteActivity} />
    </View>
  </View>
)

const App = () => {
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [days, setDays] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [draggingEnabled, setDraggingEnabled] = useState(false)

  useEffect(() => {
    if (days.includes(selectedDay)) {
      fetchActivities()
    }
  }, [selectedDay])

  const fetchActivities = async () => {
    const response = await fetch(`${apiUrl}/api/days/${selectedDay.id}/activities`)
    const json = await response.json()
    setActivities(json)
  }

  useEffect(() => {
    fetchDays()
  }, [])

  const fetchDays = async () => {
    const response = await fetch(`${apiUrl}/api/days`)
    const json = await response.json()
    setDays(json)
  }

  const addActivity = async () => {
    const response = await fetch(
      `${apiUrl}/api/activities`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: time,
          name: name,
          day: selectedDay,
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
      `${apiUrl}/api/activities/${item.id}`,
      {
        method: 'DELETE',
      }
    )
    setActivities(activities.filter(activity => activity.id !== item.id))
  }

  const renderItem = ({ item, state }) => (
    <Activity
      id={item.id}
      time={item.time}
      name={item.name}
      deleteActivity={() => deleteActivity(item)}
    />
  )

  const onDragEnd = async (from, to) => {
    await fetch(
      `${apiUrl}/api/activities/${activities[to].id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: activities[to].time,
          name: activities[to].name,
          index: to,
        }),
      }
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <DraggableList
            style={{ height: '60%' }}
            data={activities}
            setData={setActivities}
            renderItem={renderItem}
            onDragEnd={onDragEnd}
            draggingEnabled={draggingEnabled}
            ListEmptyComponent={<Text>No items</Text>}
          />
          <View style={{ marginHorizontal: 10 }}>
            <Button
              title={draggingEnabled ? 'Stop Editing' : 'Edit'}
              onPress={() => setDraggingEnabled(!draggingEnabled)}
              color={draggingEnabled ? 'lightgray' : 'steelblue'}
            />
            <TextInput
              style={{ marginVertical: 5 }}
              placeholder='Time'
              onChangeText={newTime => setTime(newTime)}
              value={time}
            />
            <TextInput
              style={{ marginVertical: 5 }}
              placeholder='Name'
              onChangeText={newName => setName(newName)}
              value={name}
            />
            <Button title='Add' onPress={addActivity} />
          </View>
        </View>
        <TabBar
          data={days}
          titleExtractor={item => item.date}
          keyExtractor={item => item.id}
          selectedItem={selectedDay}
          setSelectedItem={item => setSelectedDay(item)}
          highlightColor='deepskyblue'
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App
