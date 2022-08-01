
# NodeJS Git Tag

Три функции возвращающих последний `Git tag`:

```ts
// Аннотированный - git describe
describe(
  workDir?: null | string, 
  syncFlag?: null | boolean, 
  args? : null | string[]
): Promise<Tag> | Tag

// Любой - git describe --tags
describeTags(...)

// После фиксации - git describe --contains
describeContains(...)

// Любая из функций возвратит объект:
type Tag = { 
  value: null|string, // Тег, если нет ошибки.
  error: null|string  // Строка ошибки.
}

// Примеры:
{ value: 'v0.2.0-2-g9d351b5', error: null }
{ value: 'v0.3.2^0', error: null }
{ value: null, error: "fatal: cannot describe 'cbd05bcbe40398b55250ed574544281f44ca0d58'" }
```

Параметры:

* __workDir__  - Рабочий каталог. Передается в параметры `spawn( x, y, {cwd: workDir})`.
                 По умолчанию `process.cwd()`, иначе вычисляется абсолютный путь.
* __syncFlag__ - По умолчанию команда запускает асинхронную функцию `child_process.spawn(...)`
                 и возвращает `Promise<Tag>`. Установка в `true` выполнит `child_process.spawnSync(...) => Tag`.
* __args__     - Массив дополнительных флагов, будет добавлен в конец `['describe', ...args]`.

## Установка из github

    git clone https://github.com/AlexLonberg/js-pkg-tools.git custom_dir_name
    cd custom_dir_name
    npm i
    npm run build
