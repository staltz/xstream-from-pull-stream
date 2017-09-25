# `xstream-from-pull-stream`

```
npm install xstream-from-pull-stream
```

**Example:**

```js
import xsFromPullStream from 'xstream-from-pull-stream'

const values = require('pull-stream/sources/values')
const pullStream = values([10, 20, 30, 40])

const stream = xsFromPullStream(pullStream)
```
