import 'package:socket_io_client/socket_io_client.dart' as IO;

class WS {
  IO.Socket? socket;

  void connect(String baseUrl, String token) {
    socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .enableReconnection()
      .setAuth({'token': token})
      .build());
    socket!.onConnect((_) {});
  }

  void joinChat(String chatId) {
    socket?.emit('join', {'chatId': chatId});
  }

  void sendMessage(String chatId, String content) {
    socket?.emit('message:send', {'chatId': chatId, 'content': content});
  }

  void onMessage(void Function(dynamic data) cb) {
    socket?.on('message:new', cb);
  }

  void typing(String chatId, bool typing) {
    socket?.emit('typing', {'chatId': chatId, 'typing': typing});
  }
}
