
<div id="top"></div>

<br />
<div align="center">
<h3 align="center">Порядок деплоя приложения (Heroku + Docker + GitHub Actions)</h3>
</div>

### Порядок

1. В сервисе Heroku создать новое приложение, зайти в настройки аккаунта (**Account settings**) и скопировать ключ `API Key`.
2. Добавить переменные окружения для работы приложения (**Settings** -> **Config Vars**).

3. В GitHub создать репозиторий, в настройках репозитория (**Settings** -> **Secrets** -> **Actions**) добавить  новый ключ `HEROKU_API_KEY`.

4. В GitHub Actions создать Workflow для Node.js приложения.
```yml
name: Node.js CI
	on:
		push:
			branches: [ 31-deploy-cd ]
    pull_request:
	    branches: [ master ]
defaults:
	run:
		working-directory: 31-deploy-cd # Директория с приложением, если оно находится в поддиректории
jobs:
	build:
		runs-on: ubuntu-latest
	  strategy:
	    matrix:
	    node-version: [16.x]
	  steps:
	    - uses: actions/checkout@v3
	    - name: Use Node.js ${{ matrix.node-version }}
		    uses: actions/setup-node@v3
		    with:
			    node-version: ${{ matrix.node-version }}
			    cache: 'npm'
			    cache-dependency-path: 31-deploy-cd/package-lock.json # Если оно находится в поддиректории
	    - run: npm ci
	    - run: npm run build --if-present
	    - run: npm test
	deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
	    - uses: actions/checkout@v2
	    - uses: akhileshns/heroku-deploy@v3.12.12
		    with:
			    heroku_api_key: ${{secrets.HEROKU_API_KEY}}
			    heroku_app_name: "otus-pirateit-deploy" 
			    heroku_email: "Email"
			    appdir: 31-deploy-cd # Поддиректория проекта
			    stack: "container"
```
5. Создать файла heroku.yml в корне приложения (<a href="https://devcenter.heroku.com/articles/build-docker-images-heroku-yml">https://devcenter.heroku.com/articles/build-docker-images-heroku-yml</a>).
```yml
build:
	docker:
		web: Dockerfile
	config:
		REQUIREMENTS_FILENAME: heroku.yml
run:
	web: npm start
```
6. Внести изменения в приложение и отправить изменения в Git.

### Ссылки

http://otus-pirateit-deploy.herokuapp.com/api-docs/


<p align="right">(<a href="#top">back to top</a>)</p>
