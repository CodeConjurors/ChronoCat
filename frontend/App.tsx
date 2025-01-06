import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'

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
    fetch('http://ec2-3-91-8-31.compute-1.amazonaws.com:8080/api/activities')
      .then(response => response.json())
      .then(json => setActivities(json))
      .catch(error => console.error(error))
  }, [])

  const addActivity = () => {
    fetch('http://ec2-3-91-8-31.compute-1.amazonaws.com:8080/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: time,
        name: name,
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(responseData => {
        setActivities(activities.concat(responseData))
        setTime('')
        setName('')
      })
  }

  const deleteActivity = (item: { id: number; time: string; name: string }) => {
    fetch(`http://ec2-3-91-8-31.compute-1.amazonaws.com:8080/api/activities/${item.id}`, {
      method: 'DELETE',
    }).then(() => {
      setActivities(activities.filter(activity => activity.id !== item.id))
    })
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
                  id={item.id}
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
