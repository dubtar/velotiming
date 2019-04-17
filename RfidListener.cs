using System;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using VeloTiming.Hubs;

namespace VeloTiming
{
    internal static class RfidListener
    {
        internal static void ListenTCP()
        {
            new System.Threading.Thread(StartListening).Start();
        }

        // State object for reading client data asynchronously  
        public class StateObject
        {
            // Client  socket.  
            public Socket workSocket = null;
            // Size of receive buffer.  
            public const int BufferSize = 1024;
            // Receive buffer.  
            public byte[] buffer = new byte[BufferSize];
            // Received data string.  
            public StringBuilder sb = new StringBuilder();
        }

        // Thread signal.  
        private static ManualResetEvent allDone = new ManualResetEvent(false);
        private static void StartListening()
        {
            int port = 5080;

            IPHostEntry ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
            IPEndPoint localEndPoint = new IPEndPoint(ipHostInfo.AddressList[0], port);

            Socket listener = new Socket(localEndPoint.Address.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                listener.Bind(localEndPoint);
                listener.Listen(10);
                while (true)
                {
                    allDone.Reset();
                    Console.WriteLine("Socket listening on port: " + port);
                    listener.BeginAccept(
                        new AsyncCallback(AcceptCallback),
                        listener
                    );
                    // Wait until a connection is made before continuing.  
                    allDone.WaitOne();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            Console.WriteLine("TCP Listener exited");
        }
        private static void AcceptCallback(IAsyncResult ar)
        {
            // Signal the main thread to continue.  
            allDone.Set();

            // Get the socket that handles the client request.  
            Socket listener = (Socket)ar.AsyncState;
            Socket handler = listener.EndAccept(ar);

            // Create the state object.  
            StateObject state = new StateObject();
            state.workSocket = handler;
            handler.BeginReceive(state.buffer, 0, StateObject.BufferSize, 0,
                new AsyncCallback(ReadCallback), state);
        }
        private static void ReadCallback(IAsyncResult ar)
        {
            String content = String.Empty;

            // Retrieve the state object and the handler socket  
            // from the asynchronous state object.  
            StateObject state = (StateObject)ar.AsyncState;
            Socket handler = state.workSocket;

            // Read data from the client socket.   
            int bytesRead = handler.EndReceive(ar);

            if (bytesRead > 0)
            {
                // There  might be more data, so store the data received so far.  
                state.sb.Append(Encoding.ASCII.GetString(
                    state.buffer, 0, bytesRead));

                // Check for end-of-file tag. If it is not there, read   
                // more data.  
                content = state.sb.ToString();
                int ind;
                while((ind = content.IndexOf('}') > -1))
                {
                    var message = content
                    // Do the thing
                    for(int i = 0; i < messages. AsMemory var m in messages) {
                        var message = m + "}";
                        try {
                            var data = JsonConvert.DeserializeObject<RfidData>(message);
                        } catch {}
                    }
                }
                else
                {
                    // Not all data received. Get more.  
                    handler.BeginReceive(state.buffer, 0, StateObject.BufferSize, 0,
                    new AsyncCallback(ReadCallback), state);
                }
            }
        }


        


        public static void ListenRfidWebScoket(this IApplicationBuilder app)
        {
            // listen to websocket
            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/rfid")
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        await RfidListener.Receive(context, webSocket);
                    }
                    else
                        context.Response.StatusCode = 400;
                }
                else
                    await next();
            });

        }
        internal async static Task Receive(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;
            while (!(result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None)).CloseStatus.HasValue)
            {
                try
                {
                    var str = Encoding.ASCII.GetString(buffer, 0, result.Count);
                    var data = JsonConvert.DeserializeObject<RfidData>(str);
                    if (data != null && !String.IsNullOrEmpty(data.RFIDStamp))
                    {
                        var hubContext = context.RequestServices.GetRequiredService<IHubContext<RfidHub>>();
                        await hubContext.Clients.All.SendAsync("RfidFound", data.RFIDStamp);
                    }
                }
                catch (Exception ex) { Console.Error.WriteLine(ex.Message); }
            }
        }

        private class RfidData
        {
            public string RFIDStamp { get; set; }
            public string SourceId { get; set; }
            public string FirstRead { get; set; }
            public string MeanRead { get; set; }
        }

    }
}