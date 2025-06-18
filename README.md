
# App Pizzaria

Com essas instruções, você terá todos os recursos necessários para configurar, executar e testar o aplicativo de forma adequada, garantindo que todas as funcionalidades operem conforme o esperado. Assim, será possível visualizar o funcionamento completo do sistema, desde a integração com a API até a persistência de dados no carrinho, proporcionando uma experiência prática e completa com o app.



## Persistência dos Dados com AsyncStorage

Para garantir que os itens adicionados ao carrinho sejam mantidos entre sessões do aplicativo, utilizamos o AsyncStorage, que é um sistema de armazenamento local, assíncrono e persistente para React Native.

### Funcionamento do AsyncStorage no carrinho:

- **Armazenamento:** Cada modificação no carrinho — adicionar, remover ou alterar quantidade — atualiza o estado local e persiste os dados atualizados no AsyncStorage.
- **Recuperação:** Ao carregar o carrinho (exemplo: na abertura da tela), os dados são recuperados do AsyncStorage para manter a continuidade da experiência do usuário.
- **Validação:** Durante a recuperação, verifica-se se os dados possuem as propriedades esperadas, como a quantidade dos itens, para garantir a integridade dos dados e evitar erros no app.

## Benefícios da Implementação

- **Persistência entre sessões:** O carrinho mantém seu conteúdo mesmo após fechar e abrir o aplicativo.
- **Melhora na experiência do usuário:** O usuário não perde os itens adicionados, facilitando o uso e aumentando a confiança no app.
- **Solução simples e eficaz:** AsyncStorage é leve, fácil de integrar e oferece desempenho adequado para armazenar dados do carrinho localmente.

# Configuração do Projeto

## 1. Configuração do IP no React Native

Para que o app React Native consiga se comunicar com o backend, é necessário configurar o endereço base da API apontando para o IP da máquina onde o servidor está rodando.

No arquivo onde você instancia o Axios (exemplo: `api.ts` ou similar), altere o `baseURL` para o IP correto da sua máquina local na rede:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://SEU_IP_LOCAL:8080', // Substitua SEU_IP_LOCAL pelo IP da sua máquina
});

export default api;

## Configuração do Banco de Dados MySQL

A aplicação utiliza o banco de dados MySQL para armazenar informações da pizzaria, como produtos e pedidos.

### Passos para criar e configurar o banco no MySQL Workbench

1. **Abrir MySQL Workbench**  
   Conecte-se ao servidor MySQL local (geralmente `localhost` na porta padrão `3306`).  

2. ** Criar o banco de dados pelo phpmyAdmin **
   Para criar o banco de dados pelo phpmyAdmin, basta criar um banco de dados chamado pizzaria.

3. **Criar o banco de dados**  
   Na aba de query (SQL Editor), execute o comando abaixo para criar o banco:  
   ```sql
   CREATE DATABASE pizzaria;
   USE pizzaria;
   ```


### Funcionamento Geral do App

   1. ** Ativar servidor backend **
      Para o funcionamento correto do app é necessário ligar o seu backend, criado em springboot pois nele estão todas as APIs necessárias para o funcionamento do app:
   2. ** Onde baixar o projeto backend **
      O projeto backend pode ser acessado por meio deste repositório do github(https://github.com/GuilhermeVale1/pizzaria) na branch master:


### Dependências do projeto


| Pacote                                    | Versão   | Descrição                                          |
| ----------------------------------------- | -------- | -------------------------------------------------- |
| @expo/metro-runtime                       | \~5.0.4  | Runtime do Metro bundler para projetos Expo        |
| @react-native-async-storage/async-storage | ^2.1.2   | Armazenamento assíncrono para React Native         |
| @react-navigation/bottom-tabs             | ^7.3.12  | Navegação com abas inferiores no React Navigation  |
| @react-navigation/native                  | ^7.1.8   | Biblioteca principal de navegação                  |
| @react-navigation/native-stack            | ^7.3.11  | Navegação empilhada para React Navigation          |
| axios                                     | ^1.9.0   | Cliente HTTP baseado em Promises                   |
| expo                                      | \~53.0.7 | Framework e plataforma para apps universais        |
| expo-linking                              | ^7.1.4   | Gerenciamento de links e deep linking no Expo      |
| expo-status-bar                           | \~2.2.3  | Componente para controlar a status bar             |
| expo-image-picker                         | \~16.1.4 | Biblioteca para seleção de imagens                 |
| react                                     | 19.0.0   | Biblioteca principal para construção de UIs        |
| react-dom                                 | 19.0.0   | Renderização de React para ambiente web            |
| react-native                              | 0.79.2   | Framework para apps móveis nativos                 |
| react-native-gesture-handler              | ^2.25.0  | Manipulação de gestos no React Native              |
| react-native-reanimated                   | ^3.17.5  | Animações declarativas para React Native           |
| react-native-safe-area-context            | ^5.4.0   | Gerenciamento de áreas seguras em dispositivos     |
| react-native-screens                      | ^4.10.0  | Otimização de navegação com gerenciamento de telas |
| react-native-toast-message                | ^2.3.0   | Exibição de mensagens toast                        |
| react-native-vector-icons                 | ^10.2.0  | Ícones vetoriais para React Native                 |
| react-native-web                          | ^0.20.0  | Compatibilidade entre React Native e Web           |


Para a instalação dessas dependências no react native é necessário utilizar o comando (npm ci), que irá instalar apenas as dependências do package.json do aplicativo.


### Inicialização do app

 1. Para iniciar o app é necessário digitar o comando npx expo start no terminal.

### Arquitetura do software

![image](https://github.com/user-attachments/assets/6786c5e9-63c7-4820-bf19-9e79566d08b9)



