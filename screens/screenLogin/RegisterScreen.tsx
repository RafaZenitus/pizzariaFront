import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../services/authService";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [cpfError, setCpfError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);
  const [confirmSenhaError, setConfirmSenhaError] = useState(false);
  const [nomeError, setNomeError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const navigation = useNavigation();

  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  };

  const validarSenha = (senha: string): boolean => {
    return senha.length >= 8;
  };

  const handleRegister = async () => {
    let hasError = false;

    setNomeError(!nome);
    setEmailError(!email);
    setCpfError(!validarCPF(cpf));
    setSenhaError(!validarSenha(password));
    setConfirmSenhaError(password !== confirmPassword);

    if (
      !nome ||
      !email ||
      !validarCPF(cpf) ||
      !validarSenha(password) ||
      password !== confirmPassword
    ) {
      hasError = true;
    }

    if (hasError) {
      Toast.show({
        type: "error",
        text1: "Erro no cadastro",
        text2: "Verifique os campos destacados.",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await register({ nome, cpf, email, telefone, password });
      Toast.show({
        type: "success",
        text1: "Cadastro realizado!",
        text2: "Você já pode fazer login.",
        position: "bottom",
        visibilityTime: 3000,
      });
      navigation.navigate("Login" as never);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: "Verifique os dados e tente novamente.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          placeholder="Nome"
          style={[styles.input, nomeError && styles.inputError]}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setNomeError(false);
          }}
        />
        <TextInput
          placeholder="CPF"
          style={[styles.input, cpfError && styles.inputError]}
          value={cpf}
          onChangeText={(text) => {
            setCpf(text);
            setCpfError(false);
          }}
        />
        <TextInput
          placeholder="Email"
          style={[styles.input, emailError && styles.inputError]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(false);
          }}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Telefone (opcional)"
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Senha"
            style={[styles.inputWithIcon, senhaError && styles.inputError]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setSenhaError(false);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}
          >
            <Text style={{ fontSize: 18 }}>{showPassword ? "🙉" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirmar Senha"
            style={[
              styles.inputWithIcon,
              confirmSenhaError && styles.inputError,
            ]}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmSenhaError(false);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.iconButton}
          >
            <Text style={{ fontSize: 18 }}>
              {showConfirmPassword ? "🙉" : "🙈"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
          <Text style={styles.toggleText}>Já tem uma conta? Fazer login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  inputWithIcon: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    paddingRight: 40,
  },
  inputError: {
    borderColor: "#e74c3c",
    borderWidth: 1,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: 3,
    padding: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ee962c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleText: {
    color: "#3498db",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RegisterScreen;
