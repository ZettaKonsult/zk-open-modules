[![Build Status](https://travis-ci.org/fiddep/swedish-ssn.png)](https://travis-ci.org/fiddep/swedish-ssn)

## Installation

```
  npm install --save zk-dynamodb-wrapper
```

or

```
  yarn add zk-dynamodb-wrapper
```

## Usage

```javascript
import initDatabase from ('zk-dynamodb-wrapper')

const database = initDatabase({region: 'AWS-DATABASE-REGION'})

database.create({TableName: String, Item: {key: value}})
database.update({TableName: String, Key: {key: value}, Values: {key: value}})
database.get({TableName: String, Key: {key, value}})
database.list({TableName: String, Values: {key, value}})
database.remove({TableName: String, Key: {key, value}})
```
