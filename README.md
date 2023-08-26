# Joshua Hawatta Projeto para 1a XP em Node.js

### Rodar o projeto

#### **(é necessário que sua máquina tenha Docker e Docker Compose instalados!)**

```
sudo docker-compose up
```

Ele já gerará um build automaticamente da imagem com todas as dependências instaladas.

Para rodar testes unitários, use o comando

```
npm run test
```

Ou

```
npm run test:watch -t caminho_relativo_do_arquivo
```

### Variáveis de ambiente necessárias

```json
{
  "MONGO_URI": "mongodb://<USER>:<PASSWD>@<CLUSTER>:<PORT>/<DATABASE>",
  "MONGO_USER": "<USER>",
  "MONGO_PASSWD": "<PASSWD>"
  "PORT": "eg:(0000)",
  "JWT_SECRET": "chave secreta do JWT",
}
```

Para adicionar as mesmas localmente, crie um arquivo .env no root do projeto e siga o padrão do arquivo .env.example

### Estrutura de pastas

#### Dentro do src

app - onde ficam os módulos principais da aplicação como usuários, tarefas, etc...

enums - onde ficam as constantes do projeto, como excessões lançadas.

exceptions - os filtros de excessões personalizadas.

shared - onde ficam os módulos ou funçoes que precisam estar na aplicação inteira, como as estratégias de autenticação ou conexão com o banco de dados.

app.module.ts - módulo principal da aplicação e responsável por exportar todos os outros módulos globais do diretório shared.

main.ts - arquivo principal para carregar tudo do app.module.ts, criar filtros e CORS.

#### Fora do src

Onde fica todo o boilerplate do projeto. Seja arquivos de configuração do docker, ou .envs, eslint e etc...

### Rotas HTTP

#### Públicas

##### POST /authentication/register

```json
{
  "name": "nome do usuário",
  "email": "emaildousuario@email.com",
  "password": "s3n4d0_usuAr1o",
  "permission": "administrador" || "membro"
}
```

##### POST /authentication/login

```json
{
  "email": "emaildousuario@email.com",
  "password": "s3n4d0_usuAr1o",
  "permission": "administrador" || "membro"
}
```

O usuário deve passar a mesma permissão que ele escolheu para criar a conta na hora de fazer o login.

#### Privadas

##### POST /task

```json
{
  "name": "Tarefa 2",
  "responsibles": ["id do usuário 1", "id do usuário 2", ...]
}
```

Apenas um administrador pode criar tarefas, mas um usuário 'membro' pode fazer todo o restante do CRUD caso ele esteja como responsável na tarefa.

##### GET /task

Busca todas as tarefas. Caso o usuário seja membro e não esteja como responsável em nenhuma tarefa, lançará uma excessão.

##### GET /task/{id}

Busca uma tarefa. Caso o usuário seja membro e não esteja como responsável na tarefa, lançará uma excessão.

##### GET /task/by-me

Busca todas tarefas que um usuário criou.

##### GET /task/by-responsible

Busca todas tarefas que um usuário seja responsável.

##### PATCH /task/{id}

```json
{
  "name": "Nome da tarefa",
  "responsibles": ["id do usuário 1", "id do usuário 2", ...],
  "deliverDate": "2023-05-17T14:43:25.342Z" || "qualquer data no formato ISO8601"
}
```

Atualiza uma tarefa. Caso a tarefa tenha o campo 'deliverDate', ou seja: já concluída, lançará uma excessão.

##### DELETE /task/{id}

Deleta uma tarefa.
