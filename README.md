# 2024.2 Sagittarius - Sistema de Vendas

# Projeto Pele Dourada

## Sobre o Projeto

Este projeto tem como objetivo desenvolver um **sistema interno de gestão** para a empresa *Frango Assado Pele Dourada*. O software busca integrar e automatizar as operações diárias da loja, como controle de vendas, encomendas, estoque, cadastro de clientes e fluxo de caixa. A solução foi projetada para atender às necessidades específicas do setor alimentício, proporcionando maior eficiência, organização e redução de erros operacionais.

---

## Funcionalidades Principais

1. **Gestão de Vendas e Encomendas**
   - Registro de vendas no balcão com atualização automática do estoque.
   - Cadastro de encomendas com informações detalhadas (cliente, horário, quantidade).
   - Alertas para encomendas atrasadas e opção de entrega ou retirada.

2. **Controle de Estoque**
   - Registro diário da quantidade de produtos disponíveis.
   - Atualização automática do estoque com base em vendas e encomendas.
   - Cadastro e edição de novos produtos.

3. **Cadastro de Clientes**
   - Registro das informações dos clientes (nome, telefone e endereço).
   - Edição ou exclusão dos dados cadastrados.

4. **Controle de Caixa**
   - Registro de entradas e saídas financeiras com descrição, valor e data.
   - Geração de saldo diário consolidado.
   - Relatórios detalhados sobre vendas por métodos de pagamento (cartão débito/crédito).

5. **Dashboard Geral**
   - Visão geral do desempenho mensal (vendas, encomendas, estoque).
   - Gráficos e indicadores visuais para análise rápida.

6. **Autenticação**
   - Tela de login com nome de usuário e senha para garantir a segurança dos dados.

---

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript (com Bootstrap).
- **Backend**: Python com Django e Django Rest Framework.
- **Banco de Dados**: MongoDB.
- **Ferramentas**:
  - **GitHub**: Controle de versão.
  - **Figma**: Prototipação da interface do usuário.
  - **Discord**: Comunicação entre os membros da equipe.
  - **Miro**: Organização visual das tarefas (Kanban).
  - **Docker**: Ambiente local para desenvolvimento.

---

## Metodologia

O desenvolvimento do projeto segue uma abordagem ágil combinando elementos do **SCRUM** e do **XP (Extreme Programming)**:

- **SCRUM**:
  - Sprints semanais para entregas incrementais.
  - Planejamento, checkpoints e retrospectivas regulares.
- **XP**:
  - Programação em pares (Pair Programming).
  - Integração contínua para evitar falhas no sistema.
  - Refatoração constante para manter o código limpo e eficiente.

---

## Equipe

| Matrícula     | Nome                                 | Função                     |
|:-------------:|:------------------------------------:|:--------------------------:|
| 231026509     | Matheus de Alcântara                | Back-end / Banco de Dados  |
| 231026590     | Vilmar José Fagundes dos Passos Jr. | Back-end / Banco de Dados  |
| 222015159     | Lucas Guimarães Borges              | Back-end / Front-end       |
| 222006150     | Micael Kauan Freitas Chagas         | Front-end                  |
| 231026358     | Gabriel Flores Coelho               | Banco de Dados             |
| 221007635     | André Gustavo Rabelo do Nascimento  | Front-end                  |
| 231026400     | João Victor Pires Sapiência Santos  | Back-end                   |
| 231026302     | Caio Lucas Messias Sabino           | Back-end                   |
| 221008196     | João Victor Sousa Soares e Silva    | Front-end                  |
| 222022082     | Fábio Santos Araújo                 | Banco de Dados             |

---

## Como Acessar

1. Clone o repositório:
   ```bash
   git clone https://github.com/FGA0138-MDS-Ajax/2024.2-Sagittarius.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd pele_dourada
   ```

3. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows use `venv\Scripts\activate`
   ```

4. Instale as dependências do backend:
   ```bash
   pip install -r requirements.txt
   ```

5. Execute as migrações do banco de dados:
   ```bash
   python manage.py migrate
   ```

6. Inicie o servidor de desenvolvimento do backend:
   ```bash
   python manage.py runserver
   ```

7. Instale o Node.js e o npm (se ainda não estiverem instalados):
   - [Node.js](https://nodejs.org/)

8. Navegue até o diretório do frontend:
   ```bash
   cd pele_dourada/frontend
   ```

9. Instale as dependências do React:
   ```bash
   npm install
   ```

10. Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm start
    ```

11. Acesse o projeto no navegador:
    ```
    http://127.0.0.1:8000/ (backend)
    http://localhost:3000/ (frontend)
