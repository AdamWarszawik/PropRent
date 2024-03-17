# PropRent project

Project to create website similar to airbnb

## Installation

Clone repo

```
git clone https://github.com/AdamWarszawik/PropRent.git
cd PropRent
```

Install npm packages, nodemon and mongodb

```
npm install
npm install -g nodemon
brew install mongodb-community@6.0
```

## Start the app

Terminal 1
```
brew services start mongodb-community@6.0
```
```
node seeds/index.js
```
Terminal 2
```
nodemon app.js
```
Visit http://localhost:3000/

## Stopping app
Terminal 1
```
brew services stop mongodb-community@6.0
```
Terminal 2
```
Ctrl+C (Windows) or Control+C (mac)
```

