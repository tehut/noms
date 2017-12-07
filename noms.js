
// depedencies(bluebird, request-promise, read-line module, Node 9.2, and chalk :D)
// instantiating readline and request-promise packages
const BASE_URL = "https://data.sfgov.org/resource/bbb8-hzi6.json";
const HEADER_KEY = "X-App-Token:";
const TOKEN_HEADER = "ITiPdCl7UNMsrqTgbRHz0J1x8";
const chalk = require("chalk");
const log = console.log;
const readline = require("readline");
const request = require("request-promise");
let offset = 0;
let truckValues = new Map();
let nameArray = new Array();

function getDate(){
  let today = new Date();
    day = today.getDay();
    hour = today.getHours();
    return day + " " + hour;
}


function parseResponse (offset, nameArray, truckValues, data = null) {
  // if parseResponse is being called for the first time parse data into structures
    if (data != null) {
      for (truck in data) {
        let name = data[truck].applicant;
        // scrub results for duplicates and whether they're open and push into nameArray
        if ( hour >= parseInt(data[truck].start24) &&
        hour <= parseInt(data[truck].end24) &&
        nameArray.includes(name)==false);
        {
          nameArray.push(name);
          truckValues[name] = data[truck];
        }
      }
      nameArray = nameArray.sort();
  }

// set ending index to starting index +10 unless there
// are less than 10 food trucks remaining
  let limit = offset + 10;
  limit <= nameArray.length ? "" : limit = nameArray.length;
  for(i = offset ; i < limit ; i ++){
    let name = nameArray[i];
    let data = truckValues[name];
    let ord = i + 1;
    let indent = "    ";
    log(chalk.white(ord + ". "+ name + "\n" + indent + "Located at: "
    + truckValues[name]["location"] + ", SAN FRANSISCO, CA"))


  log(chalk.white(indent + "Open from:  " + truckValues[name].starttime +
    " - " + truckValues[name].endtime))
  }

  if (limit !== nameArray.length) {
    log(chalk.white("\n Would you like to see 10 more food trucks?  y/n ?"));
  } else {
    log(chalk.white("\n Thank you and have a wonderful day!"));
    process.exit();
}
}

function callAPI() {
    let dateInfo = getDate().split(" ");
    let day = parseInt(dateInfo[0]);
  // hardcoded variables below reference API Interface
  //found: https://data.sfgov.org/Economy-and-Community/Mobile-Food-Schedule/jjew-r69b
    let  applicant = "applicant";
    let  end = "end24";
    let  prettyEnd = "endtime";
    let  location = "location";
    let  start = "start24";
    let  prettyStart = "starttime";
    let  text = "optionaltext";
    let  fields="$select="
        + applicant + ","
        + location + ","
        + text  + ","
        + start  + ","
        + end + ","
        + prettyStart + ","
        + prettyEnd + ","
        + "dayorder="+ day + "&";
        // + "$limit=" + limit + "&"
        // + "$offset=" + offset;

    options = {
      url : BASE_URL+ "?" + fields,
      method: "GET",
      headers:{
      HEADER_KEY: TOKEN_HEADER
      },
      json: true
    };

    request(options)
    .then((data) => {
      parseResponse(offset, nameArray, truckValues, data);
    })
    .then( () => {
      getInput();
    })

    .catch((error) => {
      return new Error(error);
    })
  }

function getInput(map){
  // instantitates readline data stream for user input
  rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
    terminal: false
  });
  rl.prompt();

  rl.on("line", function(line) {
    let answer = line.trim();
    if (answer === "n" || answer === "no" ||
    answer === "No" || answer === "NO")
    {
      console.log("Have a great meal!")
      escape = true;
      process.exit(0);
    } else if (answer === "y" || answer === "yes" ||
    answer === "Yes" || answer === "YES")
    {
      offset += 10;
      parseResponse(offset,nameArray, truckValues);
      rl.pause();
    } else {
      console.log("Ummmmmm, we're not sure what that means. Please reply with y/n")
    }
    rl.prompt();

  }).on("close", function() {
    console.log("Have a great day!");
    process.exit(0);
  });

}

function wrapCli(){
  log(chalk.dim.rgb(200, 200, 100)("(_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_)"));
  log(chalk.dim.rgb(0, 160, 160)("nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm   "));
  log(chalk.dim.rgb(0, 160, 160)("Let's choose a meal! I hope you're hungry *"));
  log(chalk.dim.rgb(0, 160, 160)("          * and in San Fransisco....  "));
  log(chalk.dim.rgb(0, 160, 160)("nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm  nᗧm nᗣm   "));
  log(chalk.dim.rgb(200, 200, 100)("(_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_}{_)"));

  callAPI();
}

wrapCli();
