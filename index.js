const fs = require('fs-extra');
const glob = require('glob');

// import local modules
const createFolder = require('./modules/create-folder.js');
const getCountiesInfo = require('./modules/get-counties-info.js');
const getLocalitiesInfo = require('./modules/get-localities-info.js');
// const getMetadata = require('./src/getMetadata.js');
// const createIndexList = require('./src/createIndexList.js');
// const createHeaders = require('./src/createHeaders.js');
// const createPermutations = require('./src/createPermutations.js');
// const downloadTables = require('./src/downloadTables.js');

// local paths
const dataPath = './data';
const localPaths = {
  metadata: 'metadata',
  tables: 'tables',
  logs: 'logs',
};

// remote paths
const countiesInfoPath = 'http://www.cnas.ro/map-county'; // 


// ////////////////////////////////////////////////////////////////////////////
// // METHODS

// /////////////////////////////////////////////////////////////////////
// get current date - formated
function getCurrentDate() {
  const today = new Date().toISOString();
  const regex = /^(\d{4}-\d{2}-\d{2})/g;
  // return formated string
  return today.match(regex)[0];
};


// ////////////////////////////////////////////////////////////////////////////
// // MAIN function
async function main() {
  // get current date
  const today = getCurrentDate();

  // help text
  const helpText = `\n Available commands:\n\n\
  1. -h : display help text\n\
  2. -d : start new download\n\
          !!! removes all files and folders in the current date: \'${today}\' folder\n\
  3. -c : continue the most recent download\n`;

  // get command line arguments
  const arguments = process.argv;
  console.log('\x1b[34m%s\x1b[0m', '\n@START: CLI arguments >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.table(arguments);
  console.log('\n');

  // get third command line argument
  // if argument is missing, -h is set by default
  const mainArg = process.argv[2] || '-h';
  // manual select list of counties for download, leave active only the ones you want to download
  const countiesList = [
    // 'Alba',
    // 'Arad',
    // 'Argeş',
    // 'Bacău',
    // 'Bihor',
    // 'Bistrita Nasaud',
    // 'Botosani',
    // 'Brăila',
    // 'Brașov',
    // 'Buzău',
    // 'Călăraşi',
    // 'Caraş-Severin',
    // 'Cluj',
    // 'Constanţa',
    // 'Covasna',
    // 'Dâmboviţa',
    // 'Dolj',
    // 'Galați',
    // 'Giurgiu',
    // 'Gorj',
    // 'Harghita',
    // 'Hunedoara',
    // 'Ialomița',
    // 'Iasi',
    // 'Ilfov',
    // 'Maramures',
    // 'Mehedinţi',
    // 'Municipiul Bucuresti',
    // 'Mureş',
    // 'Neamt',
    // 'Olt',
    // 'Prahova',
    // 'Salaj',
    // 'Satu Mare',
    // 'Sibiu',
    // 'Suceava',
    // 'Teleorman',
    // 'Timiş',
    // 'Tulcea',
    // 'Valcea',
    // 'Vaslui',
    // 'Vrancea',
  ];

  // run requested command
  // 1. if argument is 'h' or 'help' print available commands
  if (mainArg === '-h') {
    console.log(helpText);

  // 2. else if argument is 'd'
  } else if (mainArg === '-d') {
    // create paths names
    const metadataPath = `${dataPath}/${today}/${localPaths['metadata']}`;
    const tablesPath = `${dataPath}/${today}/${localPaths['tables']}`;
    const logsPath = `${dataPath}/${today}/${localPaths['logs']}`;
    // prepare folders // folders are not overriten
    createFolder(1, metadataPath);
    createFolder(2, tablesPath);
    createFolder(3, logsPath);
    // get counties info
    const countiesSavePath = `${metadataPath}/counties.json`;
    const countiesInfo = await getCountiesInfo(countiesInfoPath, countiesSavePath);
    // get localities info
    const locSavePath = `${metadataPath}/localities.json`;
    const filteredCounties = {
      href: countiesInfo.href,
      counties: countiesInfo.counties.filter( item => countiesList.length > 0 ? countiesList.includes(item.title) : true )
    }
    const localitiesInfo = await getLocalitiesInfo(filteredCounties, locSavePath);
    // start new download
    

  // 3. else if argument is 'c'
  } else if (mainArg === '-c') {
    // continue most recent download
    continueDownload(today, countiesList);

    // else print help
  } else {
    console.log(helpText);
  }

}


// ////////////////////////////////////////////////////////////////////////////
// // MAIN
main();
