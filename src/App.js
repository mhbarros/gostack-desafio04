import React, {useState, useEffect} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Api from './services/api';

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {

    Api.get('/repositories').then(response => {
      setRepositories(response.data);
    });

  }, [])

  const handleLikeRepository = async (id) => {
    const response = await Api.post(`/repositories/${id}/like`);
    let repList = repositories.map(rep => {
      if(rep.id === id){
        rep.likes = response.data.likes;
      }
      return rep;
    });

    setRepositories([...repList]);

    console.log(repList);
  }

  const handleCreateRepository = async () => {
    const projectNumber = Math.round(Math.random() * 1000);
    const response = await Api.post('/repositories', {
      title: `Projeto nº${projectNumber}`,
      url: "https://github.com.br/mhbarros",
      techs: ["Javascript", "React Native", "ReactJS"]
    });

    setRepositories([...repositories, response.data])
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository}) => (

            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {
                  repository.techs.map(tech => (
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>
                  ))
                }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>

          )}  />
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => handleCreateRepository()}>
            <Text style={styles.buttonTextSecondary}>Cadastrar repositório</Text>
          </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 16
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
    borderRadius: 8
  },
  buttonSecondary: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#04d361",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8
  }
});
