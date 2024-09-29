import dotenv from 'dotenv';
import * as chromadb from 'chromadb';
import { neoXRagPrompt, neoXTxnResponsePrompt } from './prompt';
import { getTransactionInfo } from './txnHash';
import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { queryLangauageSeperator } from './queryLangPrompt';

dotenv.config();

const chromaClient = new chromadb.ChromaClient({path:process.env.CHROMA_DB_URI});
const modelName = 'text-embedding-3-large';
const openAIApiKey= process.env.OPENAI_API_KEY as string;

const llm = new ChatOpenAI({
  openAIApiKey: openAIApiKey, 
  modelName: 'gpt-4o',
  temperature: 0.0, 
  maxTokens: 256,
});

const rLlm = new ChatOpenAI({
  openAIApiKey: openAIApiKey, 
  modelName: 'gpt-4o',
  temperature: 0.4, 
  maxTokens: 1024,
});

const MyEmbeddingFunction = new chromadb.OpenAIEmbeddingFunction({
  openai_api_key: openAIApiKey,
  openai_model: modelName
});

function formatList(queryList: any): string {
  let content=""
    for (let i = 0; i < queryList['ids'][0].length; i++) {
      content += queryList['documents'][0][i];
    }
  return content;
}

export const transactionDetails = async(query:string, history:any, txnDetails: any)=>{
    try {

      const context =`
      <query>
      ${query}
      </query>

      <txnDetails>
      ${txnDetails}
      </txnDetails>
      `;

      const neoXPrompt = PromptTemplate.fromTemplate(neoXTxnResponsePrompt);
      console.log(context);
      const prompt = await neoXPrompt.format({context:context,history:history});
      const answer = await rLlm.invoke(prompt);
      return answer.content;
    } catch (error) {
        throw new Error();
    }
}

export const neoXRag = async(query:string, history:any)=>{
    try {
      const collection = await chromaClient.getCollection({ name: "neoX", embeddingFunction: MyEmbeddingFunction });
      const queryResults = await collection.query({ queryTexts: [query], nResults:4 });
      const results = formatList(queryResults);
      const context =`
      <query>
      ${query}
      </query>

      <context>
      ${results}
      </context>
      `;

      console.log(context);
      const neoXPrompt = PromptTemplate.fromTemplate(neoXRagPrompt);
      const prompt = await neoXPrompt.format({context:context,history:history});
      const answer = await rLlm.invoke(prompt);
      return answer.content;
    } catch (error) {
        throw new Error();
    }
}

export const finalChain = async( message: string,history: BaseMessage[])=>{
    try {
      const neoXPrompt = PromptTemplate.fromTemplate(queryLangauageSeperator);
      const prompt = await neoXPrompt.format({query:message,history:history});
      const answer = await llm.invoke(prompt);
      return answer.content;
    } catch (error:any) {
      throw new Error(error)
    }
}