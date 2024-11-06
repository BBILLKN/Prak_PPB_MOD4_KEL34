//pages/HomeScreen.js
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import Header from "../components/Header";
import { data as groupData } from "../data/data";

function HomeScreen() {
  const [data, setData] = useState([]);
  const [profileIndex, setProfileIndex] = useState(0); // Menyimpan posisi profil
  const [apiUserId, setApiUserId] = useState(1); // ID pengguna dari API (mulai dari 1)
  const [isApiProfile, setIsApiProfile] = useState(false); // Menentukan apakah sedang menampilkan profil API
  const [apiUserLimitReached, setApiUserLimitReached] = useState(false); // Menandakan jika profil API sudah habis

  // Fetch data dari API hanya jika menampilkan profil API
  useEffect(() => {
    if (isApiProfile) {
      async function fetchData() {
        try {
          const response = await axios.get(
            "https://reqres.in/api/users/" + apiUserId.toString()
          );
          setData(response.data.data);

          // Jika ID pengguna dari API mencapai batas (anggap batasnya 12)
          if (apiUserId >= 12) {
            setApiUserLimitReached(true);
          }
        } catch (error) {
          Alert.alert("Gagal!", error.message);
        }
      }
      fetchData();
    }
  }, [isApiProfile, apiUserId]);

  // Mendapatkan data anggota kelompok saat ini berdasarkan profileIndex
  const currentMember = groupData[profileIndex];

  // Fungsi untuk menavigasi ke profil berikutnya
  const nextProfileHandler = () => {
    if (profileIndex < groupData.length - 1) {
      // Jika masih ada anggota kelompok, pindah ke anggota berikutnya
      setProfileIndex(profileIndex + 1);
    } else {
      // Jika anggota kelompok sudah habis, mulai menampilkan profil API
      setIsApiProfile(true);
      setApiUserId(apiUserId + 1);
    }
  };

  // Fungsi untuk menavigasi ke profil sebelumnya
  const prevProfileHandler = () => {
    if (isApiProfile && apiUserId > 1) {
      // Jika di profil API, navigasi mundur pada API
      setApiUserId(apiUserId - 1);
      setApiUserLimitReached(false); // Reset limit jika mundur
    } else if (isApiProfile && apiUserId === 1) {
      // Jika di profil pertama API, kembali ke anggota kelompok terakhir
      setIsApiProfile(false);
      setProfileIndex(groupData.length - 1);
    } else if (profileIndex > 0) {
      // Jika masih ada anggota kelompok sebelumnya, navigasi mundur
      setProfileIndex(profileIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerIcon={"bell-o"}
        headerText={"Ngopi Bang!!!"}
        flexPosition={"flex-start"}
      />

      <View style={styles.contentContainer}>
        {/* Profil yang sedang ditampilkan */}
        {isApiProfile ? (
          // Profil API
          <View style={styles.profileContainer}>
            <Text style={styles.sectionTitle}>Profil API</Text>
            <Image source={{ uri: data.avatar }} style={styles.avatar} />
            <Text style={styles.nameText}>
              {data.first_name + " " + data.last_name}
            </Text>
            <Text style={styles.emailText}>{data.email}</Text>
          </View>
        ) : (
          // Profil anggota kelompok
          <View style={styles.profileContainer}>
            <Text style={styles.sectionTitle}>Profil Anggota Kelompok</Text>
            <Image source={{ uri: currentMember.imageUrl }} style={styles.avatar} />
            <Text style={styles.nameText}>{currentMember.nama}</Text>
            <Text style={styles.nimText}>NIM: {currentMember.nim}</Text>
          </View>
        )}

        {/* Navigasi profil */}
        <View style={styles.buttonContainer}>
          {/* Hanya tampilkan tombol Prev jika bukan profil pertama */}
          {!(profileIndex === 0 && !isApiProfile) && (
            <TouchableOpacity onPress={prevProfileHandler} style={styles.button}>
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
          )}
          
          {/* Sembunyikan tombol Next jika sudah mencapai profil terakhir */}
          {!apiUserLimitReached && (
            <TouchableOpacity onPress={nextProfileHandler} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
  },
  emailText: {
    fontSize: 16,
    color: "gray",
  },
  nimText: {
    fontSize: 16,
    color: "gray",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "black",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 16,
  },
});

export default HomeScreen;
