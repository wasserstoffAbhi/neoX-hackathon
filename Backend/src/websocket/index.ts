// import { initServer } from './websocketServer';
import http from 'http';
import { Server } from "socket.io";
import { getTransactionInfo } from '../service/txnHash';


// export const startWebSocketServer = (
//   server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
// ) => {
//   initServer(server);
// };

export const startWebSocketServer = async(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>)=>{
  try {
    const io = new Server(server,{
      connectTimeout: 120000,
      pingInterval: 120000,
      pingTimeout: 120000,
      connectionStateRecovery:{
        skipMiddlewares:true,
        maxDisconnectionDuration:2*60*1000
      },
      cors:{
        origin:"*",
    }});
    console.log("Websocket server started");


    io.on("connection", async(socket) => {
      console.log(socket.id);
      io.on("transaction",async(hash:string)=>{
        try {
          const txn = await getTransactionInfo(hash);
          
        } catch (error) {
          console.log(error)
        }
  
      })
  
      io.on("message",async(data)=>{
        console.log(data);
      })
    });

  } catch (error) {
    
  }
}
