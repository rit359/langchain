import dotenv from 'dotenv';
import { ChatOpenAI, OpenAIEmbeddings  } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

try{

const loader = new TextLoader("./data.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

const splitDocs = await splitter.splitDocuments(docs);


 const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

const retriever = vectorStore.asRetriever();

const prompt = ChatPromptTemplate.fromTemplate(`
Answer using ONLY the context below.
If the answer is not present, say "I don't know".

Context:
{context}

Question:
{question}
`);

const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4",
    temperature: 0.2,
  });

const chain = prompt.pipe(llm);

const question = "What is RAG?";

const docsRetrieved = await retriever.getRelevantDocuments(question);
const context = docsRetrieved.map(d => d.pageContent).join("\n");


const response = await llm.call(
    await prompt.formatMessages({ context, question })
  );

console.log('Response from LLM:', await response);

}catch(error){
    console.error('Error occurred while invoking LLM:', error);
}

