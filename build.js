const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

let html = fs.readFileSync('index.html', 'utf8');

// 1. CSS 주석 제거
html = html.replace(/(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/g, (_, open, css, close) => {
  return open + css.replace(/\/\*[\s\S]*?\*\//g, '') + close;
});

// 2. HTML 주석 제거
html = html.replace(/<!--[\s\S]*?-->/g, '');

// 3. <script> 추출 및 처리
html = html.replace(/(<script>)([\s\S]*?)(<\/script>)(\s*<\/body>)/, (_, open, js, close, body) => {

  // SETTINGS 블록 추출 (const SETTINGS = { ... }; 까지)
  const settingsStart = js.indexOf('const SETTINGS = {');
  const settingsEnd   = js.indexOf('\n  };', settingsStart) + 5;
  const settingsBlock = js.slice(settingsStart, settingsEnd);

  // SETTINGS를 제외한 나머지 코드
  const rest = js.slice(0, settingsStart) + js.slice(settingsEnd);

  // JS 주석 제거 (단순 라인/블록)
  const stripped = rest
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 난독화
  const obfuscated = JavaScriptObfuscator.obfuscate(stripped, {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    rotateStringArray: true,
    selfDefending: false,
    shuffleStringArray: true,
    splitStrings: false,
    stringArray: true,
    stringArrayThreshold: 0.75,
    transformObjectKeys: false,
  }).getObfuscatedCode();

  return `<script>\n${settingsBlock}\n</script>\n<script>${obfuscated}</script>${body}`;
});

// 4. 빈 줄 정리
html = html.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync('index.html', html, 'utf8');
console.log('빌드 완료.');
