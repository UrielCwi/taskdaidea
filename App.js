import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import styles from './styles';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [quickestTask, setQuickestTask] = useState(null);
  const [iterator, setIterator] = useState(1);

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: iterator,
        information: inputValue,
        completed: false,
        dateAdded: new Date(),
        dateCompleted: null,
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setIterator(iterator + 1);
      updateQuickestTask();
    }
  };

  const completeTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: true, dateCompleted: new Date() }
        : task
    );
    setTasks(updatedTasks);
    updateQuickestTask();
  };

  const updateQuickestTask = () => {
    let fastestTask = null;
    let shortestTime = Infinity;

    tasks.forEach(task => {
      if (task.completed && task.dateCompleted) {
        const timeTaken = task.dateCompleted - task.dateAdded;
        if (timeTaken < shortestTime) {
          shortestTime = timeTaken;
          fastestTask = task;
        }
      }
    });

    setQuickestTask(fastestTask);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={item.completed ? styles.completed : styles.taskText}>
          {item.information}
        </Text>
        <Text>Fecha Añadido: {item.dateAdded.toLocaleString()}</Text>
        {item.completed && (
          <Text>Fecha Tachado: {item.dateCompleted.toLocaleString()}</Text>
        )}
      </View>
      {!item.completed && (
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => completeTask(item.id)}
        >
          <Text style={styles.buttonText}>✔</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Ingresar información"
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Agregar item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showButton} onPress={updateQuickestTask}>
        <Text style={styles.buttonText}>Mostrar Tarea Más Rápida</Text>
      </TouchableOpacity>
      <Text>Lista:</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id.toString()}
      />
      {quickestTask && (
        <View style={styles.taskItem}>
          <Text>
            La tarea completada más rápidamente fue {quickestTask.information} con {quickestTask.dateCompleted - quickestTask.dateAdded} milisegundos
          </Text>
        </View>
      )}
    </View>
  );
};

export default App;
