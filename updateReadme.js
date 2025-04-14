const fs = require('fs');
const utils = require('./util');

const { 
  dateFormater,
  getNowSeconds,
  getRandomColor
} = utils;

const readReadme = () => {
  try {
    return fs.readFileSync('README.md', 'utf-8');
  } catch (error) {
    console.error('读取README文件时出错:', error);
    return null;
  }
};

const appendToReadme = (content, newContent) => {
  const newText = `\n${newContent}`;
  return content + newText;
};

const writeReadme = (content) => {
  try {
    fs.writeFileSync('README.md', content, 'utf-8')
    console.log('README文件已更新')
  } catch (error) {
    console.error('写入README文件时出错:', error); 
  }
};

const main = () => {
  const readmeContent = readReadme();
  if (readmeContent) {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const newContent = `- [x] <span style="display:inline-block; padding:0.2em 0.5em; margin:0.2em; border-radius:0.3em; background:${getRandomColor()}; color:#fff;">${Time}</span>`
    const updateContent = appendToReadme(readmeContent, newContent);
    writeReadme(updateContent);
  }
};

main()

