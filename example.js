import {
  describe,
  describeTags,
  describeContains,
  describeSync,
  describeTagsSync,
  describeContainsSync
} from './dist/index.js'

void async function () {
  console.log('Синхронный вариант:\n\n')
  console.log(describeSync())
  console.log(describeTagsSync())
  console.log(describeContainsSync())
  // Error - нет такого каталога.
  console.log(describeContainsSync('21f5510f-8372-408b-bb72-104ebd22f13e'))

  console.log('\n\nАсинхронный вариант:\n\n')
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
