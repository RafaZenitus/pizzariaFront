import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemCadastroNovoScreen = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [info, setInfo] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagem(resultado.assets[0].uri);
    }
  };

const salvarItem = async () => {
  if (!nome || !preco) {
    Alert.alert('Campos obrigatórios', 'Preencha o nome e o preço.');
    return;
  }

  const novoItem = {
    id: Date.now(), // chave única
    nome,
    preco,
    info,
    imagem,
  };

  try {
    const itensSalvos = await AsyncStorage.getItem('itens');
    const itens = itensSalvos ? JSON.parse(itensSalvos) : [];
    itens.push(novoItem);
    await AsyncStorage.setItem('itens', JSON.stringify(itens));
    console.log('Item salvo:', novoItem);
    navigation.goBack();
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar o item.');
  }
};
    

  return (
    <View style={styles.container}>
      <View style={styles.formRow}>
        <TouchableOpacity style={styles.imageBox} onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>Adicionar Foto</Text>
          )}
        </TouchableOpacity>

        <View style={styles.fields}>
          <TextInput
            placeholder="Nome do item"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            placeholder="Preço"
            style={styles.input}
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />
          <TextInput
            placeholder="Informações (opcional)"
            style={styles.input}
            value={info}
            onChangeText={setInfo}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={salvarItem}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemCadastroNovoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  imageBox: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageText: {
    color: '#666',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  fields: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
