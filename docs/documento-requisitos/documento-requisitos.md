# Documento de Requisitos de Software (DRS)

## 1. Introdução

### 1.1 Propósito  
Este documento descreve os requisitos do **Sistema de Gestão Frango Assado Pele Dourada**. O sistema tem como objetivo otimizar a administração de vendas, estoque e fluxo de caixa para loja de frangos assados.

### 1.2 Sobre o Projeto  
Este projeto tem como objetivo desenvolver um sistema interno de gestão para a empresa **Frango Assado Pele Dourada**. O software busca integrar e automatizar as operações diárias da loja, como controle de vendas, encomendas, estoque, cadastro de clientes e fluxo de caixa. A solução foi projetada para atender às necessidades específicas do setor alimentício, proporcionando maior eficiência, organização e redução de erros operacionais.

### 1.3 Escopo  
O **Sistema de Gestão Frango Assado Pele Dourada** é um sistema web desenvolvido para **um único usuário, o administrador** da loja de frango assado. As funcionalidades principais incluem:
- **Gestão de Vendas e Encomendas**;
- **Controle de Estoque**;
- **Cadastro de Clientes**;
- **Registro de Valores Obtidos**;
- **Dashboard para Monitoramento**.

O sistema **não realiza transações bancárias**, apenas registra os produtos vendidos e os valores obtidos. O acesso ao site é restrito **apenas ao administrador**.

O sistema segue um modelo baseado em metodologias ágeis (SCRUM/XP) para desenvolvimento e entregas incrementais.

### 1.4 Funcionalidades Principais

#### Gestão de Vendas e Encomendas
- Registro de vendas no balcão com atualização automática do estoque.
- Cadastro de encomendas com informações detalhadas (cliente, horário, quantidade).
- Alertas para encomendas atrasadas e opção de entrega ou retirada.

#### Controle de Estoque
- Registro diário da quantidade de produtos disponíveis.
- Atualização automática do estoque com base em vendas e encomendas.
- Cadastro e edição de novos produtos.

#### Cadastro de Clientes
- Registro das informações dos clientes (nome, telefone e endereço).
- Edição ou exclusão dos dados cadastrados.

#### Controle de Caixa
- Registro de entradas e saídas financeiras com descrição, valor e data.
- Geração de saldo diário consolidado.
- Relatórios detalhados sobre vendas por métodos de pagamento (cartão débito/crédito).

#### Dashboard Geral
- Visão geral do desempenho mensal (vendas, encomendas, estoque).
- Gráficos e indicadores visuais para análise rápida.

#### Autenticação
- Tela de login com nome de usuário e senha para garantir a segurança dos dados.

### 1.5 Tecnologias Utilizadas
- **Frontend**: HTML, CSS, JavaScript (com Bootstrap).
- **Backend**: Python com Django e Django Rest Framework.
- **Banco de Dados**: MongoDB.
- **Ferramentas**:
  - **GitHub**: Controle de versão.
  - **Figma**: Prototipação da interface do usuário.
  - **Discord**: Comunicação entre os membros da equipe.
  - **Miro**: Organização visual das tarefas (Kanban).
  - **Docker**: Ambiente local para desenvolvimento.

## 2. Requisitos do Sistema

### 2.1 Requisitos Funcionais
| ID  | Requisito | Descrição |
|---|---|---|
| RF01 | Login e Autenticação | O sistema deve permitir login seguro para o administrador. |
| RF02 | Cadastro de Clientes | O administrador pode cadastrar e gerenciar clientes. |
| RF03 | Registro de Vendas | O administrador pode registrar e monitorar vendas diárias. |
| RF04 | Controle de Estoque | O estoque deve ser atualizado automaticamente após cada venda. |
| RF05 | Registro de Valores Obtidos | O sistema deve registrar os valores obtidos com as vendas. |
| RF06 | Dashboard | Exibir relatórios com vendas e status de encomendas. |

### 2.2 Requisitos Não Funcionais
| ID  | Requisito | Descrição |
|---|---|---|
| RNF01 | Performance | O sistema deve suportar acesso de um único usuário simultaneamente. |
| RNF02 | Segurança | Autenticação deve seguir padrões de criptografia. |
| RNF03 | Interface Responsiva | A interface deve ser intuitiva e acessível. |

## 3. Processo de Desenvolvimento

### 3.1 Metodologia de Desenvolvimento
O desenvolvimento seguirá **SCRUM/XP**, com:
- **Sprints de 1 semana**;
- **Revisão de código e Pair Programming**;
- **Integração contínua via GitHub**.

#### Metodologia
**SCRUM:**
- Sprints semanais para entregas incrementais.
- Planejamento, checkpoints e retrospectivas regulares.

**XP:**
- Programação em pares (Pair Programming).
- Integração contínua para evitar falhas no sistema.
- Refatoração constante para manter o código limpo e eficiente.

### 3.2 Tecnologia Utilizada
- **Backend**: Python (Django, Django Rest Framework)
- **Frontend**: HTML, CSS, JavaScript (Bootstrap)
- **Banco de Dados**: MongoDB
- **Ferramentas**: GitHub, Figma, Discord, Miro, Docker

## 4. Gerenciamento do Projeto

### 4.1 Backlog do Produto
| Sprint | Funcionalidade | Prioridade |
|---|---|---|
| 1 | Configuração do ambiente | Alta |
| 2 | Desenvolvimento do Backend | Alta |
| 3 | Implementação do Cadastro de Clientes | Média |
| 4 | Desenvolvimento do Controle de Estoque | Alta |
| 5 | Criação do Dashboard | Média |

### 4.2 Gerenciamento de Riscos
| Risco | Grau | Mitigação |
|---|---|---|
| Falta de participação do cliente | Médio | Agendar checkpoints semanais |
| Bugs Críticos | Alto | Testes contínuos e revisões de código |

## 5. Conclusão
O **Sistema de Gestão Frango Assado Pele Dourada** é um sistema robusto para gestão de loja de frango assado. Ele proporcionará **automatização, segurança e análise de desempenho**, aumentando a eficiência do negócio.

### 6. Referências
- IEEE SWEBOK 2024
- SCRUM Guide
- XP Guide
