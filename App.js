import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {
  ListItem,
  Avatar,
  Divider,
  SearchBar,
  Card,
} from 'react-native-elements';
import { CircularSlider } from 'react-native-elements-universe';
import CircularProgress from 'react-native-circular-progress-indicator';
const RAPID_API_KEY = 'bd130eaf36msh4d6586c47cb596ap1de6e3jsn4357a1dbbb98';
export default function App() {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Country">
        <Drawer.Screen name="World" component={World} />
        <Drawer.Screen name="Countries" component={Countries} />
        <Drawer.Screen name="Country Stats" component={Country} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
const World = () => {
  const [getStats, setStats] = React.useState([]);
  const getDataFromAPI = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'x-rapidapi-key',
      RAPID_API_KEY // Make sure your provide your own API Key here!
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      'https://covid-19-statistics.p.rapidapi.com/reports/total',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.data);
        setStats(result.data);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };
  React.useEffect(() => {
    getDataFromAPI();
  }, [setStats]);
  console.log(' this is getstats ' + getStats);
  var percentage = (27888348 / 7794798739) * 100;
  console.log(percentage);
  return (
    <View style={styles.container}>
      <Card
        containerStyle={{
          marginTop: 15,
          backgroundColor: '#FFFFFF',
          width: '90%',
        }}>
        <Card.Title>World Stats Today ( {getStats.date} )</Card.Title>
        <Card.Divider />
        <Text style={styles.fonts} h1>
          Confirmed Cases {getStats.confirmed}
        </Text>
        <Text style={styles.fonts} h2>
          Confirmed Deaths {getStats.deaths}
        </Text>
        <Text style={styles.fonts} h3>
          Active Cases {getStats.active}
        </Text>
      </Card>
      <View style={{ flexDirection: 'row' }}>
        <CircularProgress
          radius={65}
          value={(getStats.confirmed / 7794798739) * 100}
          title={'Confirmed'}
          textColor="red"
          fontSize={15}
          valueSuffix={'%'}
          inActiveStokeColor={'2ecc71'}
          duration={5000}
          activeStrokeColor={'#1BA345'}
          activeStrokeSecondaryColor={'red'}
        />
      </View>
    </View>
  );
};
const Countries = ( { navigation }) => {
  const [getUsers, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const getDataFromAPI = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'x-rapidapi-key',
      RAPID_API_KEY // Make sure your provide your own API Key here!
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      'https://world-population.p.rapidapi.com/allcountriesname',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUsers(result.body.countries);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  React.useEffect(() => {
    getDataFromAPI();
  }, [setUsers]);

  return (
    <View style={styles.container1}>
      <SearchBar
        searchIcon
        clearIcon
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={{ color: 'black' }}
        placeholder="Search..."
        onChangeText={setSearch}
        value={search}
      />
      <FlatList
        style={styles.listView}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.key}
        data={getUsers}
        renderItem={({ item, index }) => (
      <TouchableOpacity style={styles.tile}  onPress={() => navigation.navigate('Country Stats', { getUsers })} >
            {item.toLowerCase().includes(search.toLowerCase()) ? (
              <View>
                <Text
                  style={{ color: 'black', fontSize: 18, padding: 10 }}
                  bottomDivider>
                  {item}
                </Text>
                <Divider />
              </View>
            ) : (
              <Text></Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const Country = ({route, navigation}) => {
  const [data, setData]= React.useState([]) 
  const getDataFromAPI= ()=>{
const options = {
  method: 'GET',
  url: 'https://covid-19-data.p.rapidapi.com/report/country/name',
  params: {name: 'Pakistan', date: '2020-04-01'},
  headers: {
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    'x-rapidapi-key': 'bd130eaf36msh4d6586c47cb596ap1de6e3jsn4357a1dbbb98'
  }
};

axios.request(options).then(function (response) {
  setData(response.data[0].provinces.[0])
}).catch(function (error) {
	console.error(error);
});
  }
  React.useEffect(() => {
    getDataFromAPI();
  }, [setData]);
  return (
    <View style={styles.container}>
     <Card
        containerStyle={{
          marginTop: 15,
          backgroundColor: '#FFFFFF',
          width: '90%',
        }}>
        <Card.Title>{data.province} Stats  </Card.Title>
        <Card.Divider />
        <Text style={styles.fonts} h1>
          Confirmed Cases         {data.confirmed}
        </Text>
        <Text style={styles.fonts} h2>
          Confirmed Deaths         {data.deaths}
        </Text>
        <Text style={styles.fonts} h3>
          Active Cases                {data.active}
        </Text> 
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  searchContainer: {
    borderRadius: 25,
    backgroundColor: '#ffffff00',
  },
  inputContainer: {
    backgroundColor: 'white',
  },
  fonts: {},
});
