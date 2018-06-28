
export const Compiler = ({ template = '', ob = {} }) => {
  const templateMatchVars = template.match(/\{\{.*\}\}/g)
  let templateTranspiled = ''

  const templateVarsLength = templateMatchVars.length
  for (let i = 0, l = templateVarsLength; i < l; i++) {
    const templateVar = templateMatchVars[i]
    const varWithoutBrackets = templateVar.replace(/}}|{{/g,'')
    templateTranspiled = template.replace(templateVar, ob[varWithoutBrackets])
  }

  return templateTranspiled
}