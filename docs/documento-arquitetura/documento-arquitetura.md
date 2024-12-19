# Documento de Arquitetura  
## Projeto Pele Dourada  
### Equipe Sagittarius  
**Versão 1.0**

---

## Histórico de Revisão

| Data       | Versão | Descrição                                     | Autor(es)                   |
|------------|--------|-----------------------------------------------|-----------------------------|
| 16/12/2024 | 1.0    | Redação inicial do documento de arquitetura.  | Equipe Sagittarius          |
| 16/12/2024 | 1.0    | Tópicos 1.1 e 1.2.                           | Vilmar Fagundes             |
| 16/12/2024 | 1.0    | Tópicos 2.3 e Diagrama de casos de uso.       | Matheus de Alcântara        |
| 16/12/2024 | 1.0    | Tópicos 2.4 e 2.8.                           | Fábio Santos Araújo         |
| 16/12/2024 | 1.0    | Tópicos 2.1, 2.2 e diagrama de classes.       | Caio Lucas e Gabriel Flores |
| 16/12/2024 | 1.0    | Tópico 2.5.                                  | Gabriel Flores              |
| 17/12/2024 | 1.0    | Tópico 2.6.                                  | Lucas Borges e André Gustavo|
| 17/12/2024 | 1.0    | Tópico 2.7.                                  | Matheus de Alcântara e João Victor Pires |
| 17/12/2024 | 1.0    | Tópico 2.9.                                  | João Victor Pires           |

---

## Autores

| Matrícula    | Nome                  | Papel Assumido                | Contribuição (%) |
|--------------|-----------------------|--------------------------------|------------------|
| 231026509    | Matheus de Alcântara | Desenvolvedor Backend         | 10%              |
| 231026358    | Gabriel Flores       | Desenvolvedor Banco de Dados  | 10%              |
| 231026302    | Caio Lucas           | Desenvolvedor Backend         | 10%              |
| 222022082    | Fábio Santos         | Desenvolvedor Banco de Dados  | 10%              |
| 231026590    | Vilmar Fagundes      | Desenvolvedor Banco de Dados  | 10%              |
| 231026400    | João V. Pires        | Desenvolvedor Backend         | 10%              |
| 221007635    | André Gustavo        | Desenvolvedor Frontend        | 10%              |
| 222015159    | Lucas Borges         | Desenvolvedor Backend         | 10%              |
| 222006150    | Mikael Kauan         | Desenvolvedor Frontend        | 10%              |
| 221008196    | João V. Silva        | Desenvolvedor Frontend        | 10%              |

---

## Sumário

1. [Introdução](#introducao)
    - [Propósito](#proposito)
    - [Escopo](#escopo)
2. [Representação Arquitetural](#representacao-arquitetural)
    - [Definições](#definicoes)
    - [Justifique sua escolha](#justifique-sua-escolha)
    - [Detalhamento](#detalhamento)
    - [Metas e restrições arquiteturais](#metas-e-restricoes-arquiteturais)
    - [Visão de Casos de Uso (escopo do produto)](#visao-de-casos-de-uso)
    - [Visão Lógica](#visao-logica)
    - [Visão de Implementação](#visao-de-implementacao)
    - [Visão de Implantação](#visao-de-implantacao)
    - [Restrições Adicionais](#restricoes-adicionais)
3. [Bibliografia](#bibliografia)

---

## Introdução

### Propósito
Este documento tem como objetivo descrever a arquitetura do sistema sendo desenvolvido pelo grupo Sagittarius, na disciplina de MDS – Métodos de Desenvolvimento de Software (2024.2). O projeto, chamado **Pele Dourada**, busca fornecer uma visão do sistema para desenvolvedores, testadores e demais interessados.

### Escopo
O projeto **Pele Dourada** visa criar um sistema para a loja **Frango Assado Pele Dourada**, com funcionalidades como:
- Gerenciamento de vendas semanais e mensais.
- Controle de estoque.
- Gerenciamento de encomendas.

---

## Representação Arquitetural

### Definições
O sistema seguirá uma arquitetura **monolítica**.

### Justifique sua escolha
A arquitetura monolítica foi escolhida devido a:
- **Simplicidade**: Facilita o aprendizado e a centralização do código.
- **Custo**: Menor custo de implementação e menor propensão a problemas de deploy.
- **Teste e Debugging**: Testes e rastreamento de erros são mais simples.
- **Desempenho**: Ideal para sistemas de baixa escala, com menor sobrecarga de rede.

### Detalhamento
O sistema terá três camadas principais:
1. **Interface do Usuário**: Login, cadastro de produtos, vendas, etc.
2. **Lógica de Negócios**: Comunicação com o banco para garantir funcionalidade correta.
3. **Banco de Dados**: Armazena os dados de forma segura e eficiente.

### Metas e restrições arquiteturais
- **Escalabilidade**: Suporte ao crescimento de dados sem comprometer o desempenho.
- **Desempenho**: Respostas rápidas para uma experiência satisfatória.
- **Manutenção**: Facilitar correções e melhorias.
- **Segurança**: Proteger contra acessos não autorizados.

---

## Visão de Casos de Uso

### Funcionalidades
O sistema permitirá:
- Gestão de estoque.
- Gerenciamento de vendas e encomendas.
- Cadastro de clientes.
- Controle financeiro.

### Cenários
O administrador poderá:
- Fazer login.
- Gerenciar estoque, vendas, e encomendas.
- Cadastrar clientes.
- Visualizar resumo financeiro.

---

## Visão de Implementação
A arquitetura segue o padrão MTV (Model-Template-View):
1. **Frontend**: Desenvolvido com React.
2. **Backend**: Desenvolvido com Django, responsável pelas regras de negócio.
3. **Banco de Dados**: MongoDB para armazenar os dados.

---

## Visão de Implantação
- O software será implantado em um desktop configurado como servidor web.
- O frontend usará React e Bootstrap.
- O backend usará Django.
- O banco de dados será MongoDB, integrado via Djongo.

---

## Restrições Adicionais
- Apenas o administrador terá acesso ao sistema.
- Login será obrigatório.
- Cadastro de clientes será necessário para encomendas.

---

## Bibliografia
1. AJAX, Ricardo. Slides do professor Ricardo Ajax. 2024.
2. SERRANO, Milene. Material da Profa. Milene Serrano. 2024.
3. Draw.io: https://app.diagrams.net/
4. Lucidchart: https://lucid.app/
