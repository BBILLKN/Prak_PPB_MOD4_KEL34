//pages/ProfileScreen.js
import { View, FlatList, StyleSheet } from "react-native";
import { data } from "../data/data";
import Card from "../components/Card";
import Header from "../components/Header";

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header headerText={"Kelompok 34"} flexPosition={"center"} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => <Card dataNama={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
});

export default ProfileScreen;
