import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              const Text('TokFriends', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              const Text('친구를 만들고 채팅을 시작하세요.', style: TextStyle(color: Colors.black54)),
              const SizedBox(height: 24),
              TextField(controller: _email, decoration: const InputDecoration(labelText: '이메일')),
              const SizedBox(height: 12),
              TextField(controller: _password, decoration: const InputDecoration(labelText: '비밀번호'), obscureText: true),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () => context.go('/discover'),
                child: const Text('로그인 (데모)'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.go('/discover'),
                child: const Text('Apple로 계속 (데모)'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
