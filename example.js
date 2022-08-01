import {
  describe,
  describeTags,
  describeContains
} from './dist/index.js'

void async function () {
  const t1 = await describe()
  console.log(t1)
  const t2 = await describeTags()
  console.log(t2)
  const t3 = await describeContains()
  console.log(t3)

  // Error - нет такого каталога.
  const te = await describeTags('21f5510f-8372-408b-bb72-104ebd22f13e')
  console.log(te)
}()
