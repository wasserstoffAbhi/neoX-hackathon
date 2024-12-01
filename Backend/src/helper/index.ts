import { DbService } from "../service/dbService";

const mongoFilterOperator:any={
  "neq":"ne",
  "nin":"nin",
  "in":"in",
  "eq":"eq",
  "gte":"gte",
  "lte":"lte",
  "lt":"lt",
  "gt":"gt"
}

const createWithOutCombiner=(filterArray:any)=>{
    let body:any={}
    let key:any=`${filterArray["$field"]}`;
    const subBody:any={};
    const subKey=`\$${mongoFilterOperator[filterArray["$op"]]}`;
    if(key=="txnType")subBody[subKey]=filterArray["$value"].toUpperCase();
    else subBody[subKey]=filterArray["$value"];
    if(key == "amount") key = "tokenValueInUSD";
    body[key]=subBody
    return body;
}

const createFilter=(filterArray:any,arr:Array<any>)=>{
    for (let i=0;i<filterArray.length;i++){
      let body:any={}
      body=createWithOutCombiner(filterArray[i])
      arr.push(body);
    }
    return arr;
}


export const queryFilter = (responseQuery:any) => {
  if (
    !responseQuery["$Argument"] ||
    responseQuery["$Argument"].length <= 0
  ){    return {};
  }
  let query= createFilter(responseQuery["$Argument"],[]);
  let out={"$and":query}
  return out
};


export function extractAndParseJSON(responseString:string) {
  // Regular expression to capture content between ```json and ```
  const regex = /```json([\s\S]*?)```/;
  
  // Extract the JSON string
  const match = responseString.match(regex);
  console.log(match)
  if (match && match[1]) {
    try {
      // Parse the JSON string
      const parsedData = JSON.parse(match[1].trim());
      return parsedData;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  
  console.error('No valid JSON block found in the response.');
  return null;
}

export function fetchReward() {
  const rewardPool = [
    { type: 'BonusTaps', chance: 70 },
    { type: 'Tokens', chance:  20},
    { type: 'Avatar', chance: 10 }
  ];

  

  const random = Math.random() * 100;

  let cumulative = 0;
  for (const reward of rewardPool) {
      cumulative += reward.chance;
      if (random < cumulative) {
          return reward.type;
      }
  }
}

export function fetchAvatar() {
  const avatars = [
    { rank: 'Common', chance: 70 },
    { rank: 'Rare', chance: 20 },
    { rank: 'Legendary', chance: 8 },
    { rank: 'Unique', chance: 2 }
  ];
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const avatar of avatars) {
      cumulative += avatar.chance;
      if (random < cumulative) {
          return avatar.rank;
          // now Fetch the avatar based on rank
      }
  }

  return 'Empty'; // Fallback for no avatar
}

export function getRandomTokenReward() {
  const min = 0.00001;
  const max = 0.0001;

  // Generate a random number between 0 and 1
  const random = Math.random();

  // Adjust the range and skew probabilities to favor smaller values
  const reward = min + (max - min) * Math.pow(random, 3); // Cubic distribution for skew
    // return reward;
  return parseFloat(reward.toFixed(5)); // Limit to 5 decimal places
}

export function getRandomTapReward() {
  const min = 100;
  const max = 1000;

  // Generate a random number between 0 and 1
  const random = Math.random();

  // Adjust the range and skew probabilities to favor smaller values
  const reward = min + (max - min) * Math.pow(random, 3); // Cubic distribution for skew
    // return reward;
  return parseFloat(reward.toFixed(0)); // Limit to 5 decimal places
}