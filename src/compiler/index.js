
export const Compiler = ({
  template = '',
  ob = {},
  tmpVarName = '',
  arrayName = ''
}) => {
  const templateMatchVars = template.match(/\{\{.*\}\}/g)
  let templateTranspiled = ''

  const iteratorLength = ob[arrayName].length
  console.log('iteratorLength', iteratorLength)
  for (let i = 0, l = iteratorLength; i < l; i++) {
    const templateVar = templateMatchVars[i]
    // const varWithoutBrackets = templateVar.replace(/}}|{{/g,'')
    templateTranspiled = template.replace(templateVar, ob[arrayName][i])
  }

  return templateTranspiled
}