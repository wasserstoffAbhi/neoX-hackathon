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