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