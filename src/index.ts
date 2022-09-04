import { cwd } from 'node:process'
import { spawn, spawnSync } from 'node:child_process'
import { isAbsolute, normalize, resolve } from 'node:path'

function resolvePath (path?: null | string): string {
  if (typeof path === 'undefined' || path === null) {
    return cwd()
  }
  return isAbsolute(path) ? normalize(path) : resolve(path)
}

/**
 * Возвращается функциями describe(...), describeTags(...), describeContains(...) и их синхронными версиями.
 */
type Tag = { value: string, error: null } | { value: null, error: string }

function newTag (value: string): Tag {
  return {
    value: value.trim(),
    error: null
  }
}

function newError (error: string): Tag {
  return {
    value: null,
    error: error.trim()
  }
}

function syncExecGit (args: string[], workDir?: null | string): Tag {
  const result = spawnSync('git', args, { cwd: resolvePath(workDir), encoding: 'utf8' })
  if (result.status === 0) {
    return newTag(result.stdout)
  }
  // Причины ошибок:
  //   + Нет такой команды "git", тогда status == 0, stderr == null
  //   + Неверный флаг команды "git"
  //   + Не найден tag
  return newError(
    result.stderr ||
    result.error?.stack || result.error?.message ||
    `git ${args.join(' ')}`
  )
}

function execGit (args: string[], workDir?: null | string): Promise<Tag> {
  const cp = spawn('git', args, { cwd: resolvePath(workDir) })
  return new Promise((s, _) => {
    let acc = ''
    let err = ''
    cp.stdout.on('data', (data) => {
      acc += data?.toString('utf8') || ''
    })
    cp.stderr.on('data', (data) => {
      err += data?.toString('utf8') || ''
    })
    cp.once('close', (code) => {
      if (code === 0) {
        s(newTag(acc))
      } else {
        s(newError(err || `git ${args.join(' ')}`))
      }
    })
    cp.once('error', (e) => {
      s(newError(e?.stack || e?.message || `git ${args.join(' ')}`))
    })
  })
}

/**
 * Возвращает результат команды `git describe` - аннотированный tag.
 * 
 * Если тег указывает на фиксацию, отображается только тег,
 * иначе к имени тега добавляется количество дополнительных коммитов поверх
 * помеченного объекта и сокращенное имя объекта самого последнего коммита.
 * Пример v0.2.0-2-g9d351b5.
 * 
 * @param  workDir Рабочий каталог. Передается в параметры `spawn( , , {cwd: workDir})`.
 *                 По умолчанию `process.cwd()`, иначе вычисляется абсолютный путь.
 * @param     args Массив дополнительных флагов, будет добавлен в конец ['describe', ...args].
 * @returns Возвращается объект с двумя свойствами:
 *            + value:string|null - Если результат команды завершился успешно.
 *            + error:string|null - Результат ошибки в строке.
 */
function describe (workDir?: null | string, args?: null | string[]): Promise<Tag> {
  const a = args ? ['describe', ...args] : ['describe']
  return execGit(a, workDir)
}

/**
 * Возвращает результат команды `git describe` - аннотированный tag.
 * 
 * Если тег указывает на фиксацию, отображается только тег,
 * иначе к имени тега добавляется количество дополнительных коммитов поверх
 * помеченного объекта и сокращенное имя объекта самого последнего коммита.
 * Пример v0.2.0-2-g9d351b5.
 * 
 * @param  workDir Рабочий каталог. Передается в параметры `spawn( , , {cwd: workDir})`.
 *                 По умолчанию `process.cwd()`, иначе вычисляется абсолютный путь.
 * @param     args Массив дополнительных флагов, будет добавлен в конец ['describe', ...args].
 * @returns Возвращается объект с двумя свойствами:
 *            + value:string|null - Если результат команды завершился успешно.
 *            + error:string|null - Результат ошибки в строке.
 */
function describeSync (workDir?: null | string, args?: null | string[]): Tag {
  const a = args ? ['describe', ...args] : ['describe']
  return syncExecGit(a, workDir)
}

/**
 * Возвращает результат команды `git describe --tags` - любой тег, найденный в refs/tags.
 * Смотри полное описание describe(...).
 */
function describeTags (workDir?: null | string, args?: null | string[]): Promise<Tag> {
  const a = args ? ['describe', '--tags', ...args] : ['describe', '--tags']
  return execGit(a, workDir)
}

/**
 * Возвращает результат команды `git describe --tags` - любой тег, найденный в refs/tags.
 * Смотри полное описание describe(...).
 */
function describeTagsSync (workDir?: null | string, args?: null | string[]): Tag {
  const a = args ? ['describe', '--tags', ...args] : ['describe', '--tags']
  return syncExecGit(a, workDir)
}

/**
 * Возвращает результат команды `git describe --contains` - тег, который идет после фиксации.
 * Смотри полное описание describe(...).
 */
function describeContains (workDir?: null | string, args?: null | string[]): Promise<Tag> {
  const a = args ? ['describe', '--contains', ...args] : ['describe', '--contains']
  return execGit(a, workDir)
}

/**
 * Возвращает результат команды `git describe --contains` - тег, который идет после фиксации.
 * Смотри полное описание describe(...).
 */
function describeContainsSync (workDir?: null | string, args?: null | string[]): Tag {
  const a = args ? ['describe', '--contains', ...args] : ['describe', '--contains']
  return syncExecGit(a, workDir)
}

export {
  type Tag,
  describe,
  describeTags,
  describeContains,
  describeSync,
  describeTagsSync,
  describeContainsSync
}
