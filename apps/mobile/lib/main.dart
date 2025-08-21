import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'screens/login.dart';
import 'screens/discover.dart';
import 'screens/chat.dart';

void main() {
  runApp(const ProviderScope(child: App()));
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(
      routes: [
        GoRoute(path: '/', builder: (c, s) => const LoginScreen()),
        GoRoute(path: '/discover', builder: (c, s) => const DiscoverScreen()),
        GoRoute(path: '/chat', builder: (c, s) => const ChatScreen()),
      ],
    );

    return MaterialApp.router(
      title: 'TokFriends',
      routerConfig: router,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
    );
  }
}
