import 'package:flutter/material.dart';
import '../ws.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final _messages = <String>[];
  final ws = WS();
  final chatId = 'demo-chat'; // 실제에선 API에서 받은 chatId 사용

  @override
  void initState() {
    super.initState();
    // 데모용: 토큰 없이도 연결되는 서버 설정이라 가정
    ws.connect('http://localhost:4000', 'dev');
    ws.joinChat(chatId);
    ws.onMessage((data) {
      setState(() { _messages.add(data['msg']?['content'] ?? ''); });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('채팅 (실시간 데모)')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final m = _messages[_messages.length - 1 - i];
                return Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.deepPurple.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(m),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(hintText: '메시지 입력'),
                  onChanged: (_) => ws.typing(chatId, true),
                )),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () {
                    if (_controller.text.trim().isEmpty) return;
                    ws.sendMessage(chatId, _controller.text.trim());
                    _controller.clear();
                  },
                  icon: const Icon(Icons.send),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
